"use client";
import { placeholderImage, t } from "@/utils";
import { useEffect, useState } from "react";
import { SlLocationPin } from "react-icons/sl";
import { IoSearchOutline } from "react-icons/io5";
import Img1 from "../../../public/assets/Image1.svg";
import Img2 from "../../../public/assets/Image2.svg";
import Img3 from "../../../public/assets/Image3.svg";
import Img4 from "../../../public/assets/Image4.svg";
import Img5 from "../../../public/assets/Image5.svg";
import Img6 from "../../../public/assets/Image6.svg";
import Image from "next/image";
import {
  getCityData,
  getIsBrowserSupported,
  getKilometerRange,
  saveCity,
} from "@/redux/reducer/locationSlice";
import { useDispatch, useSelector } from "react-redux";
import { CurrentLanguageData } from "@/redux/reducer/languageSlice";
import LocationModal from "../../Location/LocationModal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FaLocationCrosshairs } from "react-icons/fa6";
import SearchAutocomplete from "@/components/Location/SearchAutocomplete";
import { getCompanyName } from "@/redux/reducer/settingSlice";
import CustomLink from "@/components/Common/CustomLink";
import { ArrowRight } from "lucide-react";
import { setIsVisitedLandingPage } from "@/redux/reducer/globalStateSlice";

const AnythingYouWant = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const CurrentLanguage = useSelector(CurrentLanguageData);
  const LocationData = useSelector(getCityData);
  const companyName = useSelector(getCompanyName);
  const [selectedCity, setSelectedCity] = useState(LocationData);
  const IsBrowserSupported = useSelector(getIsBrowserSupported);
  const [IsLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const KmRange = useSelector(getKilometerRange);

  useEffect(() => {
    dispatch(setIsVisitedLandingPage(true));
  }, []);

  const handleSearchLocation = () => {
    const isInvalidLocation =
      KmRange > 0
        ? !selectedCity?.lat || !selectedCity?.long
        : !selectedCity?.areaId &&
          !selectedCity?.city &&
          !selectedCity?.state &&
          !selectedCity?.country;

    if (isInvalidLocation) {
      toast.error(t("pleaseSelectLocation"));
      return;
    }

    saveCity(selectedCity);
    router.push("/");
  };

  return (
    <>
      <div className="py-28 bg-muted flex items-center justify-center">
        <div className="container relative">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex flex-col items-center font-bold text-4xl lg:text-5xl gap-3 relative">
              <h1 className="flex flex-column items-center relative z-10 after:content-[''] after:absolute after:bg-[#00b2ca] after:h-[40%] after:w-full after:z-[-1] after:bottom-0">
                {t("buySell")}
              </h1>
              <h1>{t("anythingYouWant")}</h1>
            </div>
            <p className="text-sm font-light md:w-1/2">
              {t("discoverEndlessPossibilitiesAt")} {companyName}{" "}
              {t("goToMarketplace")}
            </p>
            <div className="space-between gap-3 rounded border w-full lg:w-[60%] bg-white py-2 px-3 relative">
              <div className="flex items-center w-full gap-2">
                <SlLocationPin size={22} />
                <SearchAutocomplete
                  saveOnSuggestionClick={false}
                  setSelectedLocation={setSelectedCity}
                />
              </div>
              <div className="flex items-center gap-3">
                {IsBrowserSupported && (
                  <button
                    className="flex items-center gap-2"
                    onClick={() => setIsLocationModalOpen(true)}
                  >
                    <FaLocationCrosshairs size={22} />
                  </button>
                )}
                <button
                  className="flex items-center gap-2 bg-primary px-3 py-[6px] rounded text-white"
                  onClick={handleSearchLocation}
                >
                  <IoSearchOutline size={22} />
                  <span className="hidden md:block">{t("search")}</span>
                </button>
              </div>
              <CustomLink
                href="/"
                className="hidden sm:flex items-center gap-2 text-destructive"
              >
                <span className="whitespace-nowrap">{t("skip")}</span>
                <ArrowRight size={16} />
              </CustomLink>
            </div>
            <CustomLink
              href="/"
              className="sm:hidden flex items-center gap-2 text-destructive"
            >
              <span className="whitespace-nowrap">{t("skip")}</span>
              <ArrowRight size={16} />
            </CustomLink>
          </div>
          <Image
            src={Img1}
            className="hidden xl:block absolute xl:-top-[38%] ltr:xl:left-[3%] rtl:xl:right-[3%] xl:w-[110px]"
            height={135}
            width={90}
            alt=""
            loading="lazy"
            onErrorCapture={placeholderImage}
          />
          <Image
            src={Img2}
            className="hidden xl:block absolute xl:top-[38%] ltr:xl:left-[9%] rtl:xl:right-[9%] xl:w-[110px]"
            height={135}
            width={90}
            alt=""
            loading="lazy"
            onErrorCapture={placeholderImage}
          />
          <Image
            src={Img3}
            className="hidden xl:block absolute xl:top-[120%] ltr:xl:left-[3%] rtl:xl:right-[3%] xl:w-[110px]"
            height={90}
            width={90}
            alt=""
            loading="lazy"
            onErrorCapture={placeholderImage}
          />
          <Image
            src={Img4}
            className="hidden xl:block absolute xl:-top-[38%] ltr:xl:right-[3%] rtl:xl:left-[3%] xl:w-[110px]"
            height={135}
            width={90}
            alt=""
            loading="lazy"
            onErrorCapture={placeholderImage}
          />
          <Image
            src={Img5}
            className="hidden xl:block absolute xl:top-[50%] ltr:xl:right-[9%] rtl:xl:left-[9%] xl:w-[110px]"
            height={90}
            width={90}
            alt=""
            loading="lazy"
            onErrorCapture={placeholderImage}
          />
          <Image
            src={Img6}
            className="hidden xl:block absolute xl:top-[109%] ltr:xl:right-[3%] rtl:xl:left-[3%] xl:w-[110px]"
            height={0}
            width={0}
            alt=""
            loading="lazy"
            onErrorCapture={placeholderImage}
          />
        </div>
      </div>
      <LocationModal
        key={`${IsLocationModalOpen}-location-modal`}
        IsLocationModalOpen={IsLocationModalOpen}
        setIsLocationModalOpen={setIsLocationModalOpen}
      />
    </>
  );
};

export default AnythingYouWant;
