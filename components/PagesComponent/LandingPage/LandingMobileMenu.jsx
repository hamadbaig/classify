"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { settingsData } from "@/redux/reducer/settingSlice";
import { placeholderImage, t } from "@/utils";
import Image from "next/image";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import LanguageDropdown from "../../Common/LanguageDropdown";
import { CurrentLanguageData } from "@/redux/reducer/languageSlice";

const LandingMobileMenu = ({ isOpen, setIsOpen }) => {
  const CurrentLanguage = useSelector(CurrentLanguageData);
  const settings = useSelector(settingsData);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      setIsOpen(false);
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen} className="lg:hidden">
      <SheetTrigger asChild className="lg:hidden">
        <span
          id="hamburg"
          className="text-2xl cursor-pointer border rounded-lg p-1"
        >
          <GiHamburgerMenu size={25} className="text-primary" />
        </span>
      </SheetTrigger>
      <SheetContent className="[&>button:first-child]:hidden] p-0">
        <SheetHeader className="py-4 px-6 border-b border">
          <SheetTitle>
            <Image
              src={settings?.header_logo}
              width={195}
              height={52}
              alt="Logo"
              className="w-full h-[52px] object-contain ltr:object-left rtl:object-right max-w-[195px]"
              loading="lazy"
              onErrorCapture={placeholderImage}
            />
          </SheetTitle>
        </SheetHeader>
        <div className="p-6">
          <div className="flex flex-col gap-4 list-none">
            <li className="text-primary">{t("home")}</li>
            <li
              className="cursor-pointer"
              onClick={() => scrollToSection("work_process")}
            >
              {t("whyChooseUs")}
            </li>
            <li
              className="cursor-pointer"
              onClick={() => scrollToSection("faq")}
            >
              {t("faqs")}
            </li>
            <li
              className="cursor-pointer"
              onClick={() => scrollToSection("ourBlogs")}
            >
              {t("blog")}
            </li>
            <li>
              <LanguageDropdown
                settings={settings}
                CurrentLanguage={CurrentLanguage}
              />
            </li>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LandingMobileMenu;
