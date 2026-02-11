import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import trueGif from "../../../public/assets/true.gif";
import Image from "next/image";
import CustomLink from "@/components/Common/CustomLink";
import { placeholderImage, t } from "@/utils";

const AdSuccessModal = ({
  openSuccessModal,
  setOpenSuccessModal,
  createdAdSlug,
}) => {
  const closeSuccessModal = () => {
    setOpenSuccessModal(false);
  };

  return (
    <Dialog open={openSuccessModal} onOpenChange={closeSuccessModal}>
      <DialogContent
        className="[&>button]:hidden !max-w-[520px] py-[50px] px-[30px] sm:px-[80px]"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className="flex flex-col gap-4 items-center">
          <Image
            src={trueGif}
            alt="success"
            loading="lazy"
            height={176}
            width={176}
            className="h-44 w-44"
            onErrorCapture={placeholderImage}
          />
          <DialogTitle className="text-3xl font-semibold text-center">
            {t("adPostedSuccess")}
          </DialogTitle>
          <CustomLink
            href={`/my-listing/${createdAdSlug}`}
            className="py-3 px-6 bg-primary text-white rounded-md"
          >
            {t("viewAd")}
          </CustomLink>
          <CustomLink href="/" className="">
            {t("backToHome")}
          </CustomLink>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AdSuccessModal;
