"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getIsLandingPage } from "@/redux/reducer/settingSlice";
import { getCityData } from "@/redux/reducer/locationSlice";
import Loader from "../Common/Loader";


const withRedirect = (WrappedComponent) => {
  const WithRedirect = (props) => {
    const isLandingPage = useSelector(getIsLandingPage);
    const router = useRouter();
    const cityData = useSelector(getCityData);
    const [shouldRender, setShouldRender] = useState(false);

    // Check if location data is missing
    const noLocationData =
      !cityData?.city && !cityData?.state && !cityData?.country;
    // Redirect to "/home" if landing page is 1 and no location data
    useEffect(() => {
      if (isLandingPage === 1 && noLocationData) {
        router.push("/landing");
      } else {
        setShouldRender(true);
      }
    }, [isLandingPage, noLocationData, router]);

    if (!shouldRender) {
      return <Loader />;
    }

    // Render the wrapped component if no redirection is needed
    return <WrappedComponent {...props} />;
  };
  return WithRedirect;
};

export default withRedirect;
