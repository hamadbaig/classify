"use client"; // Error components must be Client Components
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import somthingWrong from "../public/assets/something_went_wrong.svg";
import { placeholderImage, t } from "@/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Error({ error }) {
  const router = useRouter();
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  const navigateHome = () => {
    router.push("/");
  };
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <Image
        src={somthingWrong}
        alt="something went wrong"
        width={200}
        height={200}
        onErrorCapture={placeholderImage}
      />
      <h3 className="text-2xl font-semibold text-primary text-center">
        {t("somthingWentWrong")}
      </h3>
      <div className="flex flex-col gap-2">
        <span>{t("tryLater")}</span>
        <Button variant="outline" onClick={navigateHome}>
          {t("home")}
        </Button>
      </div>
    </div>
  );
}
