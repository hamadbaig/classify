"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getCurrentLangCode,
  setCurrentLanguage,
} from "@/redux/reducer/languageSlice";
import { getCityData, saveCity } from "@/redux/reducer/locationSlice";
import { getIsPaidApi } from "@/redux/reducer/settingSlice";
import { isEmptyObject, placeholderImage } from "@/utils";
import { getLanguageApi, getLocationApi } from "@/utils/api";
import { setHasFetchedSystemSettings } from "@/utils/settingsFetcherStatus";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FaAngleDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const LanguageDropdown = ({ settings, CurrentLanguage }) => {
  const IsPaidApi = useSelector(getIsPaidApi);
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const location = useSelector(getCityData);
  const currentLangCode = useSelector(getCurrentLangCode);

  const languages = settings && settings?.languages;

  const searchParams = useSearchParams();
  const langCode = searchParams?.get("lang");
  const params = new URLSearchParams(searchParams.toString());

  const setDefaultLanguage = async () => {
    try {
      params.set("lang", settings?.default_language.toLowerCase());
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
      const language_code = settings?.default_language;
      const res = await getLanguageApi.getLanguage({
        language_code,
        type: "web",
      });
      if (res?.data?.error === false) {
        dispatch(setCurrentLanguage(res?.data?.data));
        document.documentElement.lang =
          res?.data?.data?.code?.toLowerCase() ||
          settings?.default_language.toLowerCase();
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      isEmptyObject(CurrentLanguage) ||
      (languages && !languages.some((lang) => lang.code === currentLangCode))
    ) {
      setDefaultLanguage();
    } else if (!langCode) {
      params.set("lang", currentLangCode);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [langCode]);

  const getLanguageData = async (
    language_code = settings?.default_language
  ) => {
    try {
      const res = await getLanguageApi.getLanguage({
        language_code,
        type: "web",
      });
      if (res?.data?.error === false) {
        dispatch(setCurrentLanguage(res?.data?.data));
        getLocationAfterLanguageChange(language_code);
        document.documentElement.lang =
          res?.data?.data?.code?.toLowerCase() || "en";

        setHasFetchedSystemSettings(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLocationAfterLanguageChange = async (language_code) => {
    // If no country/state/city/area stored, skip API call
    if (
      !location?.country &&
      !location?.state &&
      !location?.city &&
      !location?.area
    ) {
      return;
    }

    const response = await getLocationApi.getLocation({
      lat: location?.lat,
      lng: location?.long,
      lang: language_code,
    });

    if (response?.data.error === false) {
      if (IsPaidApi) {
        let city = "";
        let state = "";
        let country = "";
        const results = response?.data?.data?.results;

        results?.forEach((result) => {
          const addressComponents = result.address_components;
          const getAddressComponent = (type) => {
            const component = addressComponents.find((comp) =>
              comp.types.includes(type)
            );
            return component ? component.long_name : "";
          };
          if (!city) city = getAddressComponent("locality");
          if (!state)
            state = getAddressComponent("administrative_area_level_1");
          if (!country) country = getAddressComponent("country");
        });
        const updatedLocation = {};
        if (location?.country) updatedLocation.country = country;
        if (location?.state) updatedLocation.state = state;
        if (location?.city) updatedLocation.city = city;
        updatedLocation.lat = location?.lat;
        updatedLocation.long = location?.long;
        saveCity(updatedLocation);
      } else {
        const result = response?.data?.data;
        const updatedLocation = {};
        if (location?.country)
          updatedLocation.country = result?.country_translation;
        if (location?.state) updatedLocation.state = result?.state_translation;
        if (location?.city) updatedLocation.city = result?.city_translation;
        if (location?.area) {
          updatedLocation.area = result?.area_translation;
          updatedLocation.areaId = result?.area_id;
        }
        updatedLocation.lat = location?.lat;
        updatedLocation.long = location?.long;
        saveCity(updatedLocation);
      }
    }
  };

  const handleLanguageSelect = (id) => {
    const lang = languages?.find((item) => item.id === Number(id));
    if (CurrentLanguage.id === lang.id) {
      return;
    }
    params.set("lang", lang.code.toLowerCase()); // Store language code
    // Push new URL with lang param
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    getLanguageData(lang?.code);
  };

  return (
    <DropdownMenu on>
      <DropdownMenuTrigger className="border rounded-full py-2 px-4">
        <div className="flex items-center gap-1">
          <Image
            src={CurrentLanguage?.image || settings?.placeholder_image}
            alt={CurrentLanguage?.name || "language"}
            width={20}
            height={20}
            className="rounded-full"
            onErrorCapture={placeholderImage}
            loading="lazy"
          />
          <span>{CurrentLanguage?.code}</span>
          <FaAngleDown className="text-black/60" size={12} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-0 max-h-[250px] overflow-y-auto">
        {languages &&
          languages.map((lang) => (
            <DropdownMenuItem
              key={lang?.id}
              onClick={() => handleLanguageSelect(lang.id)}
              className="cursor-pointer"
            >
              <Image
                src={lang?.image ? lang?.image : settings?.placeholder_image}
                alt={lang.name || "english"}
                width={20}
                height={20}
                className="rounded-full"
                onErrorCapture={placeholderImage}
                loading="lazy"
              />
              <span>{lang.code}</span>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;
