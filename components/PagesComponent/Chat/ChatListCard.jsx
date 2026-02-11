import Image from "next/image";
import { formatTime, placeholderImage } from "@/utils";
import CustomLink from "@/components/Common/CustomLink";
import { getPlaceholderImage } from "@/redux/reducer/settingSlice";
import { useSelector } from "react-redux";

const ChatListCard = ({
  chat,
  isSelling,
  isActive,
  setSellerChatList,
  setBuyerChatList,
}) => {
  const placeholderImg = useSelector(getPlaceholderImage);
  const user = isSelling ? chat?.buyer : chat?.seller;
  const isUnread = chat?.unread_chat_count > 0;

  // Function to safely get image source - returns null instead of empty string
  const getSafeImageSrc = (primarySrc) => {
    if (primarySrc && primarySrc !== "") return primarySrc;
    else return placeholderImg;
  };

  const handleChatTabClick = () => {
    isSelling
      ? setSellerChatList((prevList) =>
          prevList.map((item) =>
            item.id === chat.id ? { ...item, unread_chat_count: 0 } : item
          )
        )
      : setBuyerChatList((prevList) =>
          prevList.map((item) =>
            item.id === chat.id ? { ...item, unread_chat_count: 0 } : item
          )
        );
  };

  return (
    <CustomLink
      scroll={false}
      href={`/chat?activeTab=${isSelling ? "selling" : "buying"}&chatid=${
        chat?.id
      }`}
      onClick={handleChatTabClick}
      className={`py-3 px-4 border-b flex items-center gap-4 cursor-pointer ${
        isActive ? "bg-primary text-white" : ""
      }`}
    >
      <div className="relative flex-shrink-0">
        <Image
          src={getSafeImageSrc(user?.profile)}
          alt="User avatar"
          onErrorCapture={placeholderImage}
          width={56}
          height={56}
          className="w-[56px] h-auto aspect-square object-cover rounded-full"
          loading="lazy"
        />

        <Image
          src={getSafeImageSrc(chat?.item?.image)}
          alt="Item image"
          onErrorCapture={placeholderImage}
          width={24}
          height={24}
          className="w-[24px] h-auto aspect-square object-cover rounded-full absolute top-[32px] bottom-[-6px] right-[-6px]"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col gap-2 w-full min-w-0">
        <div className="w-full flex items-center gap-1 justify-between min-w-0">
          <h5 className="font-medium truncate" title={user?.name}>
            {user?.name}
          </h5>
          <span className="text-xs">{formatTime(chat?.created_at)}</span>
        </div>
        <div className="flex items-center gap-1 justify-between">
          <p
            className="truncate text-sm"
            title={chat?.item?.translated_name || chat?.item?.name}
          >
            {chat?.item?.translated_name || chat?.item?.name}
          </p>
          {isUnread && !isActive && (
            <span className="flex items-center justify-center bg-primary text-white rounded-full px-2 py-1 text-xs">
              {chat?.unread_chat_count}
            </span>
          )}
        </div>
      </div>
    </CustomLink>
  );
};

export default ChatListCard;
