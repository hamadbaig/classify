"use client";
import { getCurrentLangCode } from "@/redux/reducer/languageSlice";
import { getDefaultLanguageCode } from "@/redux/reducer/settingSlice";
import Link from "next/link";
import { useSelector } from "react-redux";

const CustomLink = ({ href, children, ...props }) => {
  const defaultLangCode = useSelector(getDefaultLanguageCode);
  const currentLangCode = useSelector(getCurrentLangCode);

  const langCode = currentLangCode || defaultLangCode;

  // Append lang param safely
  const separator = href.includes("?") ? "&" : "?";
  const newHref = `${href}${separator}lang=${langCode}`;

  return (
    <Link href={newHref} {...props}>
      {children}
    </Link>
  );
};

export default CustomLink;
