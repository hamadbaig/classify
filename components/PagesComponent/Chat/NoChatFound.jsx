import { t } from "@/utils"


const NoChatFound = () => {
    return (
        <div className="flex flex-col text-center">
            <h5 className="text-primary text-2xl font-medium">{t('noChatFound')}</h5>
            <p>{t('startConversation')}</p>
        </div>
    )
}

export default NoChatFound