import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { settingsApi } from "@/utils/api";
import {
  settingsSucess,
  getIsMaintenanceMode,
  getShowLandingPage,
} from "@/redux/reducer/settingSlice";
import {
  getKilometerRange,
  setKilometerRange,
  setIsBrowserSupported,
} from "@/redux/reducer/locationSlice";
import { getIsVisitedLandingPage } from "@/redux/reducer/globalStateSlice";
import { CurrentLanguageData, getIsRtl } from "@/redux/reducer/languageSlice";
import { useRouter } from "next/navigation";
import {
  getHasFetchedSystemSettings,
  setHasFetchedSystemSettings,
} from "@/utils/settingsFetcherStatus";

export function useClientLayoutLogic() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  const CurrentLanguage = useSelector(CurrentLanguageData);
  const isMaintenanceMode = useSelector(getIsMaintenanceMode);
  const isRtl = useSelector(getIsRtl);
  const appliedRange = useSelector(getKilometerRange);
  const isVisitedLandingPage = useSelector(getIsVisitedLandingPage);
  const showLandingPage = useSelector(getShowLandingPage);

  useEffect(() => {
    const getSystemSettings = async () => {
      if (getHasFetchedSystemSettings()) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await settingsApi.getSettings();
        const data = response?.data;
        dispatch(settingsSucess({ data }));
        const min = Number(data?.data?.min_length);
        const max = Number(data?.data?.max_length);
        if (appliedRange < min) dispatch(setKilometerRange(min));
        else if (appliedRange > max) dispatch(setKilometerRange(max));
        document.documentElement.style.setProperty(
          "--primary-color",
          data?.data?.web_theme_color
        );
        setHasFetchedSystemSettings(true);
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getSystemSettings();

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) dispatch(setIsBrowserSupported(false));
  }, [CurrentLanguage.id]);

  useEffect(() => {
    if (showLandingPage && !isVisitedLandingPage) {
      router.push("/landing");
    }
  }, [showLandingPage, isVisitedLandingPage]);

  useEffect(() => {
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
  }, [isRtl]);

  return {
    isLoading,
    isMaintenanceMode,
  };
}
