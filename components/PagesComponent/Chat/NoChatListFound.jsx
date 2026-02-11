import { t } from "@/utils"
import noChatListFound from "../../../public/assets/no_data_found_illustrator.svg"
import Image from "next/image"

const NoChatListFound = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <Image src={noChatListFound} loading="lazy" alt="no chat list found" width={200} height={200} className="w-[200px] h-auto aspect-square" />
            <h3 className="font-medium text-2xl text-primary">{t("noConversationsFound")}</h3>
            <span className="text-sm text-center">{t("noChatsAvailable")}</span>
        </div>
    )
}

export default NoChatListFound