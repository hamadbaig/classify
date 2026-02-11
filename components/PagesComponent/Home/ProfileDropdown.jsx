import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userSignUpData } from "@/redux/reducer/authSlice";
import { placeholderImage, t, truncate } from "@/utils";
import Image from "next/image";
import { useSelector } from "react-redux";
import { FiUser } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiChat, BiDollarCircle, BiReceipt } from "react-icons/bi";
import { LiaAdSolid } from "react-icons/lia";
import { LuHeart } from "react-icons/lu";
import { MdOutlineRateReview, MdWorkOutline } from "react-icons/md";
import { RiLogoutCircleLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { FaAngleDown } from "react-icons/fa";
import { getPlaceholderImage } from "@/redux/reducer/settingSlice";
import { useMediaQuery } from "usehooks-ts";

const ProfileDropdown = ({ IsLogout, setIsLogout }) => {
  const isSmallScreen = useMediaQuery("(max-width: 1200px)");
  const router = useRouter();
  const UserData = useSelector(userSignUpData);
  const placeholderImg = useSelector(getPlaceholderImage);
  return (
    <DropdownMenu key={IsLogout}>
      <DropdownMenuTrigger className="flex items-center gap-1">
        <Image
          src={UserData?.profile || placeholderImg}
          alt={UserData?.name}
          width={32}
          height={32}
          onErrorCapture={placeholderImage}
          className="rounded-full w-8 h-8 aspect-square object-cover border"
          loading="lazy"
        />
        <p>{truncate(UserData.name, 12)}</p>
        <FaAngleDown className="text-muted-foreground flex-shrink-0" size={12} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isSmallScreen ? "start" : "center"}>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/profile")}
        >
          <FiUser size={16} />
          <span>{t("myProfile")}</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/notifications")}
        >
          <IoMdNotificationsOutline size={16} />
          {t("notification")}
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/chat")}
        >
          <BiChat size={16} />
          {t("chat")}
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/user-subscription")}
        >
          <BiDollarCircle size={16} />
          {t("subscription")}
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/my-ads")}
        >
          <LiaAdSolid size={16} />
          {t("myAds")}
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/favorites")}
        >
          <LuHeart size={16} />
          {t("favorites")}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push("/transactions")}>
          <BiReceipt size={16} />
          {t("transaction")}
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/reviews")}
        >
          <MdOutlineRateReview size={16} />
          {t("myReviews")}
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/job-applications")}
        >
          <MdWorkOutline size={16} />
          {t("jobApplications")}
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setIsLogout(true)}
        >
          <RiLogoutCircleLine size={16} />
          {t("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
