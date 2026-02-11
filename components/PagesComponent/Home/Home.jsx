"use client";
import { useEffect, useState } from "react";
import AllItems from "./AllItems";
import FeaturedSections from "./FeaturedSections";
import OfferSlider from "./OfferSlider";
import { FeaturedSectionApi, sliderApi } from "@/utils/api";
import { settingsData } from "@/redux/reducer/settingSlice";
import { CurrentLanguageData } from "@/redux/reducer/languageSlice";
import { useSelector } from "react-redux";
import { getCityData, getKilometerRange } from "@/redux/reducer/locationSlice";
import OfferSliderSkeleton from "@/components/PagesComponent/Home/OfferSliderSkeleton";
import FeaturedSectionsSkeleton from "./FeaturedSectionsSkeleton";
import PopularCategories from "./PopularCategories";

const Home = () => {
  const KmRange = useSelector(getKilometerRange);
  const cityData = useSelector(getCityData);
  const settings = useSelector(settingsData);
  const isDemoMode = settings?.demo_mode;
  const CurrentLanguage = useSelector(CurrentLanguageData);
  const [IsFeaturedLoading, setIsFeaturedLoading] = useState(false);
  const [featuredData, setFeaturedData] = useState([]);
  const [Slider, setSlider] = useState([]);
  const [IsSliderLoading, setIsSliderLoading] = useState(true);
  const allEmpty = featuredData?.every((ele) => ele?.section_data.length === 0);


  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        const response = await sliderApi.getSlider();
        const data = response.data;
        setSlider(data.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsSliderLoading(false);
      }
    };
    fetchSliderData();
  }, []);

  useEffect(() => {
    const fetchFeaturedSectionData = async () => {
      setIsFeaturedLoading(true);
      try {
        const params = {};
        if (!isDemoMode) {
          if (cityData.lat && cityData.long) {
            params.radius = KmRange;
            params.latitude = cityData.lat;
            params.longitude = cityData.long;
          }
        }
        const response = await FeaturedSectionApi.getFeaturedSections(params);
        const { data } = response.data;
        setFeaturedData(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsFeaturedLoading(false);
      }
    };
    fetchFeaturedSectionData();
  }, [cityData.lat, cityData.long, KmRange, CurrentLanguage?.id]);
  return (
    <>
      {IsSliderLoading ? (
        <OfferSliderSkeleton />
      ) : (
        Slider &&
        Slider.length > 0 && (
          <OfferSlider Slider={Slider} IsLoading={IsSliderLoading} />
        )
      )}
      <PopularCategories />
      {IsFeaturedLoading ? (
        <FeaturedSectionsSkeleton />
      ) : (
        <FeaturedSections
          featuredData={featuredData}
          setFeaturedData={setFeaturedData}
          allEmpty={allEmpty}
        />
      )}
      <AllItems cityData={cityData} isDemoMode={isDemoMode} KmRange={KmRange} />
    </>
  );
};

export default Home;
