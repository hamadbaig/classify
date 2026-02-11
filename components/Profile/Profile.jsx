"use client";
import { placeholderImage, t } from "@/utils";
import Image from "next/image";
import { MdAddPhotoAlternate, MdVerifiedUser } from "react-icons/md";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { loadUpdateUserData, userSignUpData } from "@/redux/reducer/authSlice";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { Button, buttonVariants } from "../ui/button";
import { Fcmtoken, settingsData } from "@/redux/reducer/settingSlice";
import { getVerificationStatusApi, updateProfileApi } from "@/utils/api";
import { toast } from "sonner";
import CustomLink from "@/components/Common/CustomLink";
import { CurrentLanguageData } from "@/redux/reducer/languageSlice";

const Profile = () => {
  const CurrentLanguage = useSelector(CurrentLanguageData);
  const UserData = useSelector(userSignUpData);
  const IsLoggedIn = UserData !== undefined && UserData !== null;
  const settings = useSelector(settingsData);
  const placeholder_image = settings?.placeholder_image;
  const [profileImage, setProfileImage] = useState(
    UserData?.profile || placeholder_image
  );
  const [profileFile, setProfileFile] = useState(null);
  const fetchFCM = useSelector(Fcmtoken);
  const [formData, setFormData] = useState({
    name: UserData?.name || "",
    email: UserData?.email || "",
    phone: UserData?.mobile || "",
    address: UserData?.address || "",
    notification: UserData?.notification,
    show_personal_details: Number(UserData?.show_personal_details),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [VerificationStatus, setVerificationStatus] = useState("");
  const [RejectionReason, setRejectionReason] = useState("");

  const getVerificationProgress = async () => {
    try {
      const res = await getVerificationStatusApi.getVerificationStatus();
      if (res?.data?.error === true) {
        setVerificationStatus("not applied");
      } else {
        const status = res?.data?.data?.status;
        const rejectReason = res?.data?.data?.rejection_reason;
        setVerificationStatus(status);
        setRejectionReason(rejectReason);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (IsLoggedIn) {
      getVerificationProgress();
    }
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSwitchChange = (id) => {
    setFormData((prevData) => ({
      ...prevData,
      [id]: prevData[id] === 1 ? 0 : 1,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData?.name.trim() || !formData?.address.trim()) {
        toast.error(t("emptyFieldNotAllowed"));
        return;
      }
      setIsLoading(true);
      const response = await updateProfileApi.updateProfile({
        name: formData.name,
        email: formData.email,
        mobile: formData.phone,
        address: formData.address,
        profile: profileFile,
        fcm_id: fetchFCM ? fetchFCM : "",
        notification: formData.notification,
        show_personal_details: formData?.show_personal_details,
      });

      const data = response.data;
      if (data.error !== true) {
        loadUpdateUserData(data?.data);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col items-start md:flex-row md:items-center sm:justify-between gap-4 border py-6 px-4 rounded">
        <div className="flex flex-col items-start md:flex-row md:items-center gap-4 flex-1">
          <div className="relative">
            {profileImage && (
              <Image
                src={profileImage}
                alt="User profile"
                width={120}
                height={120}
                className="w-[120px] h-auto aspect-square rounded-full border-muted border-4"
                onErrorCapture={placeholderImage}
                loading="lazy"
              />
            )}

            <div className="flex items-center justify-center p-1 absolute size-10 rounded-full top-20 right-0 bg-primary border-4 border-[#efefef] text-white cursor-pointer">
              <input
                type="file"
                id="profileImageUpload"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              <label htmlFor="profileImageUpload" className="cursor-pointer">
                <MdAddPhotoAlternate size={22} />
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <h1 className="text-xl font-medium break-words">
              {UserData?.name}
            </h1>
            <p className="break-all">{UserData?.email}</p>
          </div>
        </div>
        <div className="flex-1 flex justify-end">
          {(() => {
            switch (VerificationStatus) {
              case "approved":
                return (
                  <div className="flex items-center gap-1 rounded text-white bg-[#fa6e53] py-1 px-2 text-sm">
                    <MdVerifiedUser size={14} />
                    <span>{t("verified")}</span>
                  </div>
                );

              case "not applied":
                return (
                  <div className="flex justify-end">
                    <CustomLink
                      href="/user-verification"
                      className={buttonVariants()}
                    >
                      {t("verfiyNow")}
                    </CustomLink>
                  </div>
                );

              case "rejected":
                return (
                  <div className="flex flex-col gap-4 justify-end">
                    {RejectionReason && (
                      <p className="text-sm md:text-right capitalize">
                        {RejectionReason}
                      </p>
                    )}

                    <CustomLink
                      href="/user-verification"
                      className={buttonVariants() + " w-fit self-end"}
                    >
                      {t("applyAgain")}
                    </CustomLink>
                  </div>
                );

              case "pending":
              case "resubmitted":
                return (
                  <Button type="button" className="cursor-auto">
                    {t("inReview")}
                  </Button>
                );
              default:
                return null;
            }
          })()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border py-6 px-4 rounded">
        <h1 className="col-span-full text-xl font-medium">
          {t("personalInfo")}
        </h1>

        <div className="labelInputCont">
          <Label htmlFor="name" className="requiredInputLabel">
            {t("name")}
          </Label>
          <Input
            type="text"
            id="name"
            placeholder={t("enterName")}
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-1">
          <div className="w-1/2 flex flex-col justify-between gap-3">
            <Label className="font-semibold" htmlFor="notification-mode">
              {t("notification")}
            </Label>
            <Switch
              className="rtl:[direction:rtl]"
              id="notification-mode"
              checked={Number(formData.notification) === 1}
              onCheckedChange={() => handleSwitchChange("notification")}
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between gap-3">
            <Label className="font-semibold" htmlFor="showPersonal-mode">
              {t("showContactInfo")}
            </Label>
            <Switch
              id="showPersonal-mode"
              checked={Number(formData.show_personal_details) === 1}
              onCheckedChange={() =>
                handleSwitchChange("show_personal_details")
              }
            />
          </div>
        </div>

        <div className="labelInputCont">
          <Label htmlFor="email" className="requiredInputLabel">
            {t("email")}
          </Label>
          <Input
            type="email"
            id="email"
            placeholder={t("enterEmail")}
            value={formData.email}
            onChange={handleChange}
            readOnly={
              UserData?.type === "email" || UserData?.type === "google"
                ? true
                : false
            }
          />
        </div>
        <div className="labelInputCont">
          <Label htmlFor="phone" className="font-semibold">
            {t("phoneNumber")}
          </Label>
          <Input
            type="number"
            id="phone"
            min={0}
            placeholder={t("enterPhoneNumber")}
            value={formData.phone}
            onChange={handleChange}
            readOnly={UserData?.type === "phone" ? true : false}
          />
        </div>
      </div>

      <div className="border py-6 px-4 rounded">
        <h1 className="col-span-full mb-6 text-xl font-medium">
          {t("address")}
        </h1>
        <div className="labelInputCont">
          <Label htmlFor="address" className="requiredInputLabel">
            {t("address")}
          </Label>
          <Textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
      </div>

      <Button disabled={isLoading} className="ltr:ml-auto rtl:mr-auto w-fit">
        {isLoading ? t("saving") : t("saveChanges")}
      </Button>
    </form>
  );
};

export default Profile;
