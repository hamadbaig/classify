"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { placeholderImage, t } from "@/utils";
import Image from "next/image";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import LanguageDropdown from "../../Common/LanguageDropdown";
import { GrLocation } from "react-icons/gr";
import { IoIosAddCircleOutline } from "react-icons/io";
import ProfileDropdown from "./ProfileDropdown";
import { setIsLoginOpen } from "@/redux/reducer/globalStateSlice";
import FilterTree from "@/components/Filter/FilterTree";
import { usePathname } from "next/navigation";

const HomeMobileMenu = ({
  setIsLocationModalOpen,
  setIsRegisterModalOpen,
  IsLogout,
  setIsLogout,
  locationArray,
  locationText,
  IsLoggedin,
  CurrentLanguage,
  settings,
  handleAdListing,
  IsAdListingClicked,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();
  const adsPage = pathname.startsWith("/ads");

  const openLocationEditModal = () => {
    setIsOpen(false);
    setIsLocationModalOpen(true);
  };

  const handleLogin = () => {
    setIsOpen(false);
    setIsLoginOpen(true);
  };

  const handleRegister = () => {
    setIsOpen(false);
    setIsRegisterModalOpen(true);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen} className="lg:hidden">
      <SheetTrigger asChild className="xl:hidden">
        <span
          id="hamburg"
          className="text-2xl cursor-pointer border rounded-lg p-1"
        >
          <GiHamburgerMenu size={25} className="text-primary" />
        </span>
      </SheetTrigger>
      <SheetContent className="[&>button:first-child]:hidden] p-0 overflow-y-auto">
        <SheetHeader className="py-4 px-6 border-b border">
          <SheetTitle>
            <Image
              src={settings?.header_logo}
              width={195}
              height={92}
              alt="Logo"
              className="w-full h-[52px] object-contain ltr:object-left rtl:object-right max-w-[195px]"
              loading="lazy"
              onErrorCapture={placeholderImage}
            />
          </SheetTitle>
        </SheetHeader>
        <div className="p-6">
          <div className="flex flex-col gap-4 list-none">
            <li
              className="flex items-center gap-1 cursor-pointer"
              onClick={openLocationEditModal}
            >
              <GrLocation size={16} className="flex-shrink-0" />
              <p>
                {locationArray.length > 0 ? locationText : t("addLocation")}
              </p>
            </li>
            {IsLoggedin ? (
              <ProfileDropdown setIsLogout={setIsLogout} IsLogout={IsLogout} />
            ) : (
              <div className="flex gap-2">
                <button onClick={handleLogin}>{t("login")}</button>
                <span className="border-l h-6 self-center"></span>
                <button onClick={handleRegister}>{t("register")}</button>
              </div>
            )}

            <li className="flex items-center gap-2 font-medium">
              <button
                className="flex items-center gap-2 bg-primary py-2 px-3 text-white rounded-md"
                disabled={IsAdListingClicked}
                onClick={handleAdListing}
              >
                <IoIosAddCircleOutline size={18} />
                <span>{t("adListing")}</span>
              </button>
            </li>

            <li>
              <LanguageDropdown
                settings={settings}
                CurrentLanguage={CurrentLanguage}
              />
            </li>

            {/* not render on ads page because page have category filter already and to avoid api calls when language changes */}
            {!adsPage && <FilterTree />}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HomeMobileMenu;
