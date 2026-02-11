"use client";
import { t } from "@/utils";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AdsCard from "./MyAdsCard.jsx";
import { getMyItemsApi } from "@/utils/api";
import { useSelector } from "react-redux";
import ProductCardSkeleton from "@/components/Common/ProductCardSkeleton.jsx";
import NoData from "@/components/EmptyStates/NoData";
import { Button } from "@/components/ui/button";
import {
  CurrentLanguageData,
  getIsRtl,
} from "@/redux/reducer/languageSlice.js";

const MyAds = () => {
  const CurrentLanguage = useSelector(CurrentLanguageData);
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSort = searchParams.get("sort") || "new-to-old";
  const initialStatus = searchParams.get("status") || "all";
  const [sortValue, setSortValue] = useState(initialSort);
  const [status, setStatus] = useState(initialStatus);
  const [totalAdsCount, setTotalAdsCount] = useState(0);
  const [MyItems, setMyItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [IsLoading, setIsLoading] = useState(true);
  const [IsLoadMore, setIsLoadMore] = useState(false);
  const isRTL = useSelector(getIsRtl);

  const getMyItemsData = async (page) => {
    try {
      const params = {
        page,
        sort_by: sortValue,
      };
      if (status !== "all") {
        params.status = status;
      }
      const res = await getMyItemsApi.getMyItems(params);
      const data = res?.data;
      if (data?.error === false) {
        setTotalAdsCount(data?.data?.total);
        page > 1
          ? setMyItems((prevData) => [...prevData, ...data?.data?.data])
          : setMyItems(data?.data?.data);
        setCurrentPage(data?.data?.current_page);
        setLastPage(data?.data?.last_page);
      } else {
        console.log("Error in response: ", data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsLoadMore(false);
    }
  };

  useEffect(() => {
    getMyItemsData(1);
  }, [sortValue, status, CurrentLanguage?.id]);

  const updateURLParams = (key, value) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleSortChange = (value) => {
    setSortValue(value);
    updateURLParams("sort", value);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    updateURLParams("status", value);
  };

  const handleLoadMore = () => {
    setIsLoadMore(true);
    getMyItemsData(currentPage + 1);
  };

  return (
    <>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between py-2 px-4 bg-muted rounded-lg">
        <h1 className="font-semibold">
          {t("totalAds")} {totalAdsCount}
        </h1>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          <div className="flex items-center gap-1">
            <CgArrowsExchangeAltV size={25} />
            <span className="whitespace-nowrap">{t("sortBy")}</span>
          </div>
          <Select value={sortValue} onValueChange={handleSortChange}>
            <SelectTrigger className="bg-transparent border-black/23">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent align={isRTL ? "start" : "end"}>
              <SelectGroup>
                <SelectItem value="new-to-old">
                  {t("newestToOldest")}
                </SelectItem>
                <SelectItem value="old-to-new">
                  {t("oldestToNewest")}
                </SelectItem>
                <SelectItem value="price-high-to-low">
                  {t("priceHighToLow")}
                </SelectItem>
                <SelectItem value="price-low-to-high">
                  {t("priceLowToHigh")}
                </SelectItem>
                <SelectItem value="popular_items">{t("popular")}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="bg-transparent border-black/23">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent align={isRTL ? "start" : "end"}>
              <SelectGroup>
                <SelectItem value="all">{t("all")}</SelectItem>
                <SelectItem value="review">{t("review")}</SelectItem>
                <SelectItem value="approved">{t("live")}</SelectItem>
                <SelectItem value="soft rejected">
                  {t("softRejected")}
                </SelectItem>
                <SelectItem value="permanent rejected">
                  {t("permanentRejected")}
                </SelectItem>
                <SelectItem value="inactive">{t("deactivate")}</SelectItem>
                <SelectItem value="featured">{t("featured")}</SelectItem>
                <SelectItem value="sold out">{t("soldOut")}</SelectItem>
                <SelectItem value="resubmitted">{t("resubmitted")}</SelectItem>
                <SelectItem value="expired">{t("expired")}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 mt-[30px] xl:grid-cols-3 gap-3 sm:gap-6">
        {IsLoading ? (
          [...Array(12)].map((item, index) => (
            <ProductCardSkeleton key={index} />
          ))
        ) : MyItems && MyItems?.length > 0 ? (
          MyItems.map((item) => (
            <AdsCard
              key={item?.id}
              data={item}
              isApprovedSort={sortValue === "approved"}
            />
          ))
        ) : (
          <div className="col-span-full">
            <NoData name={t("advertisement")} />
          </div>
        )}
      </div>
      {MyItems && MyItems.length > 0 && currentPage < lastPage && (
        <div className="text-center mt-6">
          <Button
            variant="outline"
            className="text-sm sm:text-base text-primary w-[256px]"
            disabled={IsLoading || IsLoadMore}
            onClick={handleLoadMore}
          >
            {IsLoadMore ? t("loading") : t("loadMore")}
          </Button>
        </div>
      )}
    </>
  );
};

export default MyAds;
