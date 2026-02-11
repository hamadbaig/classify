import { formatDateMonthYear, placeholderImage, t } from "@/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getNotificationList } from "@/utils/api";
import { CurrentLanguageData } from "@/redux/reducer/languageSlice";
import Image from "next/image";
import Pagination from "@/components/Common/Pagination";
import NoData from "@/components/EmptyStates/NoData";
import { settingsData } from "@/redux/reducer/settingSlice";
import NotificationSkeleton from "./NotificationSkeleton";

const Notifications = () => {
  const CurrentLanguage = useSelector(CurrentLanguageData);
  const settings = useSelector(settingsData);
  const placeholder_image = settings?.placeholder_image;
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotificationData = async (page) => {
    try {
      setIsLoading(true);
      const response = await getNotificationList.getNotification({ page });
      if (response?.data?.error === false) {
        setNotifications(response?.data.data.data);
        setTotalPages(response?.data?.data?.last_page);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotificationData(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return isLoading ? (
    <NotificationSkeleton />
  ) : notifications.length > 0 ? (
    <>
      <div className="overflow-hidden border rounded-md">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow className="text-xs sm:text-sm">
              <TableHead className="ltr:text-left rtl:text-right">
                {t("notification")}
              </TableHead>
              <TableHead className="text-center">{t("date")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs sm:text-sm">
            {notifications.map((notification, index) => (
              <TableRow key={index} className="hover:bg-muted">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={notification?.image || placeholder_image}
                      width={48}
                      height={48}
                      alt="notification icon"
                      className="w-[48px] h-[48px] object-cover rounded"
                      onErrorCapture={placeholderImage}
                      loading="lazy"
                    />
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {formatDateMonthYear(notification.created_at)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination
        className="mt-7"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  ) : (
    <NoData name={t("notifications")} />
  );
};
export default Notifications;
