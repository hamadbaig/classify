"use client";
import Header from "../Common/Header";
import Footer from "../Footer/Footer";
import PushNotificationLayout from "./PushNotificationLayout";
import Loading from "@/app/loading";
import Image from "next/image";
import UnderMaintenance from "../../public/assets/something_went_wrong.svg";
import { t } from "@/utils";
import { useClientLayoutLogic } from "./useClientLayoutLogic";

export default function Layout({ children }) {
  const { isLoading, isMaintenanceMode } = useClientLayoutLogic();

  if (isLoading) {
    return <Loading />;
  }

  if (isMaintenanceMode) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-2">
        <Image
          src={UnderMaintenance}
          alt="Maintenance Mode"
          height={255}
          width={255}
          loading="lazy"
        />
        <p className="text-center max-w-[40%]">{t("underMaintenance")}</p>
      </div>
    );
  }

  return (
    <PushNotificationLayout>
      <Header />
      {children}
      <Footer />
    </PushNotificationLayout>
  );
}