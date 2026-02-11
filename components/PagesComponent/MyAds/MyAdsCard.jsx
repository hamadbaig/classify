import Image from "next/image";
import CustomLink from "@/components/Common/CustomLink";
import {
  MdAirplanemodeInactive,
  MdOutlineDone,
  MdOutlineLiveTv,
  MdOutlineSell,
} from "react-icons/md";
import { BiBadgeCheck, BiHeart } from "react-icons/bi";
import { RxCross2, RxEyeOpen } from "react-icons/rx";
import { RiPassExpiredLine } from "react-icons/ri";
import {
  formatPriceAbbreviated,
  formatSalaryRange,
  placeholderImage,
  t,
} from "@/utils";
import { IoTimerOutline } from "react-icons/io5";

const MyAdsCard = ({ data, isApprovedSort }) => {
  const isJobCategory = Number(data?.category?.is_job_category) === 1;
  const isAdminEdited = Number(data?.is_edited_by_admin) === 1;
  const translated_item = data?.translated_item;
  const isHidePrice = isJobCategory
    ? [data?.min_salary, data?.max_salary].every(
        (val) =>
          val === null ||
          val === undefined ||
          (typeof val === "string" && val.trim() === "")
      )
    : data?.price === null ||
      data?.price === undefined ||
      (typeof data?.price === "string" && data?.price.trim() === "");

  const status = data?.status;

  const statusComponents = {
    approved: isApprovedSort
      ? { icon: <MdOutlineLiveTv size={16} color="white" />, text: t("live") }
      : data?.is_feature
      ? { icon: <BiBadgeCheck size={16} color="white" />, text: t("featured") }
      : { icon: <MdOutlineLiveTv size={16} color="white" />, text: t("live") },

    review: {
      icon: <IoTimerOutline size={16} color="white" />,
      text: t("review"),
    },
    "permanent rejected": {
      icon: <RxCross2 size={16} color="white" />,
      text: t("permanentRejected"),
      bg: "bg-red-600",
    },
    "soft rejected": {
      icon: <RxCross2 size={16} color="white" />,
      text: t("softRejected"),
      bg: "bg-red-500",
    },
    inactive: {
      icon: <MdAirplanemodeInactive size={16} color="white" />,
      text: t("deactivate"),
      bg: "bg-gray-500",
    },
    "sold out": {
      icon: <MdOutlineSell size={16} color="white" />,
      text: isJobCategory ? t("positionFilled") : t("soldOut"),
      bg: "bg-yellow-600",
    },
    resubmitted: {
      icon: <MdOutlineDone size={16} color="white" />,
      text: t("resubmitted"),
      bg: "bg-green-600",
    },
    expired: {
      icon: <RiPassExpiredLine size={16} color="white" />,
      text: t("expired"),
      bg: "bg-gray-700",
    },
  };

  const { icon, text, bg = "bg-primary" } = statusComponents[status] || {};

  return (
    <CustomLink
      href={`/my-listing/${data?.slug}`}
      className="border flex flex-col gap-2 rounded-xl p-2"
    >
      <Image
        src={data?.image}
        width={220}
        height={220}
        alt={data?.image}
        className="w-full h-auto aspect-square rounded-sm object-cover"
        loading="lazy"
        onErrorCapture={placeholderImage}
      />

      <div className="flex items-center gap-2 flex-wrap">
        {status && (
          <div
            className={`flex items-center gap-1 ${bg} rounded-sm py-0.5 px-1`}
          >
            {icon}
            <span className="text-white text-sm text-ellipsis">{text}</span>
          </div>
        )}

        {isAdminEdited && (
          <div className="py-1 px-2 bg-red-400/15 rounded-sm text-destructive text-sm">
            {t("adminEdited")}
          </div>
        )}
      </div>

      {!isHidePrice && (
        <p className="font-medium line-clamp-1">
          {translated_item?.name || data?.name}
        </p>
      )}

      <div className="space-between gap-1">
        {isHidePrice ? (
          <p className="font-medium line-clamp-1">
            {translated_item?.name || data?.name}
          </p>
        ) : (
          <p className="font-semibold text-lg text-balance break-all">
            {isJobCategory
              ? formatSalaryRange(data?.min_salary, data?.max_salary)
              : formatPriceAbbreviated(data?.price)}
          </p>
        )}
        <div className="flex items-center gap-1 text-xs">
          <div className="flex items-center gap-1">
            <RxEyeOpen size={14} className="text-black/60" />
            <span>{data?.clicks}</span>
          </div>
          <div className="flex items-center gap-1">
            <BiHeart size={14} className="text-black/60" />
            <span>{data?.total_likes}</span>
          </div>
        </div>
      </div>
    </CustomLink>
  );
};

export default MyAdsCard;
