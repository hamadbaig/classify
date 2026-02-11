"use client";
import Image from "next/image";
import CustomLink from "@/components/Common/CustomLink";
import { placeholderImage, t } from "@/utils";
import { useSelector } from "react-redux";
import { CurrentLanguageData } from "@/redux/reducer/languageSlice";
import { settingsData } from "@/redux/reducer/settingSlice";
import LanguageDropdown from "../../Common/LanguageDropdown";
import LandingMobileMenu from "@/components/PagesComponent/LandingPage/LandingMobileMenu";
import { useState } from "react";

const LandingHeader = () => {
  const CurrentLanguage = useSelector(CurrentLanguageData);
  const settings = useSelector(settingsData);
  const [isShowMobileMenu, setIsShowMobileMenu] = useState(false);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      if (isShowMobileMenu) {
        setIsShowMobileMenu(false);
      }
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header>
        <nav className="shadow-md">
          <div className="container py-5 lg:flex lg:items-center lg:justify-between">
            <div className="flex w-100 items-center justify-between">
              <Image
                src={settings?.header_logo}
                className="w-full h-[52px] object-contain ltr:object-left rtl:object-right max-w-[195px]"
                alt="logo"
                width={195}
                height={52}
                onErrorCapture={placeholderImage}
                loading="lazy"
              />

              <LandingMobileMenu
                isOpen={isShowMobileMenu}
                setIsOpen={setIsShowMobileMenu}
              />
            </div>
            <div className="hidden lg:flex gap-6">
              <ul className="flex items-center gap-6">
                <li className="text-gray-800 cursor-pointer text-primary">
                  {t("home")}
                </li>
                <li
                  className="text-gray-800 cursor-pointer hover:text-primary"
                  onClick={() => scrollToSection("work_process")}
                >
                  {t("whyChooseUs")}
                </li>
                <li
                  className="text-gray-800 cursor-pointer hover:text-primary"
                  onClick={() => scrollToSection("faq")}
                >
                  {t("faqs")}
                </li>
                <li
                  className="text-gray-800 cursor-pointer hover:text-primary"
                  onClick={() => scrollToSection("ourBlogs")}
                >
                  {t("blog")}
                </li>
              </ul>
            </div>
            <div className="hidden lg:flex">
              <LanguageDropdown
                settings={settings}
                CurrentLanguage={CurrentLanguage}
              />
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default LandingHeader;
