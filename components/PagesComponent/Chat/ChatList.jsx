import { t } from "@/utils";
import ChatListCard from "./ChatListCard";
import ChatListCardSkeleton from "./ChatListCardSkeleton";
import BlockedUsersMenu from "./BlockedUsersMenu";
import NoChatListFound from "./NoChatListFound";
import { useEffect, useState } from "react";
import { chatListApi } from "@/utils/api";
import InfiniteScroll from "react-infinite-scroll-component";
import CustomLink from "@/components/Common/CustomLink";

const ChatList = ({
  chatId,
  activeTab,
  setSellerChatList,
  setBuyerChatList,
  SellerChatList,
  BuyerChatList,
  langCode,
}) => {
  const [CurrentSellerPage, setCurrentSellerPage] = useState(1);
  const [CurrentBuyerPage, setCurrentBuyerPage] = useState(1);
  const [HasMoreBuyer, setHasMoreBuyer] = useState(false);
  const [HasMoreSeller, setHasMoreSeller] = useState(false);
  const [IsLoading, setIsLoading] = useState(true);

  useEffect(() => {
    activeTab === "selling" ? fetchSellerChatList() : fetchBuyerChatList();
  }, [activeTab, langCode]);

  const fetchSellerChatList = async (page = 1) => {
    if (page === 1) {
      setIsLoading(true);
    }
    try {
      const res = await chatListApi.chatList({ type: "seller", page });
      if (res?.data?.error === false) {
        const data = res?.data?.data?.data;
        const currentPage = res?.data?.data?.current_page;
        const lastPage = res?.data?.data?.last_page;
        page === 1
          ? setSellerChatList(data)
          : setSellerChatList((prev) => [...prev, ...data]);
        setCurrentSellerPage(currentPage);
        setHasMoreSeller(currentPage < lastPage);
      } else {
        console.error(res?.data?.message);
      }
    } catch (error) {
      console.error("Error fetching seller chat list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBuyerChatList = async (page = 1) => {
    if (page === 1) {
      setIsLoading(true);
    }
    try {
      const res = await chatListApi.chatList({ type: "buyer", page });
      if (res?.data?.error === false) {
        const data = res?.data?.data?.data;
        const currentPage = res?.data?.data?.current_page;
        const lastPage = res?.data?.data?.last_page;
        page === 1
          ? setBuyerChatList(data)
          : setBuyerChatList((prev) => [...prev, ...data]);
        setCurrentBuyerPage(currentPage);
        setHasMoreBuyer(currentPage < lastPage);
      } else {
        console.log(res?.data?.message);
      }
    } catch (error) {
      console.log("Error fetching buyer chat list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-h-[800px] flex flex-col h-full">
      <div className="p-4 flex items-center gap-1 justify-between border-b">
        <h4 className="font-medium text-xl">{t("chat")}</h4>
        {/* Blocked Users Menu Component */}
        <BlockedUsersMenu />
      </div>
      <div className="flex items-center">
        <CustomLink
          href={`/chat?activeTab=selling`}
          className={`py-4 flex-1 text-center border-b ${
            activeTab === "selling" ? "border-primary" : ""
          }`}
          scroll={false}
        >
          {t("selling")}
        </CustomLink>
        <CustomLink
          href={`/chat?activeTab=buying`}
          className={`py-4 flex-1 text-center border-b ${
            activeTab === "buying" ? "border-primary" : ""
          }`}
          scroll={false}
        >
          {t("buying")}
        </CustomLink>
      </div>
      <div className="flex-1 overflow-y-auto" id="chatList">
        <InfiniteScroll
          dataLength={
            activeTab === "buying"
              ? BuyerChatList?.length
              : SellerChatList?.length
          }
          next={() => {
            activeTab === "buying"
              ? fetchBuyerChatList(CurrentBuyerPage + 1)
              : fetchSellerChatList(CurrentSellerPage + 1);
          }}
          hasMore={activeTab === "buying" ? HasMoreBuyer : HasMoreSeller}
          loader={Array.from({ length: 3 }, (_, index) => (
            <ChatListCardSkeleton key={index} />
          ))}
          scrollableTarget="chatList"
        >
          {IsLoading
            ? Array.from({ length: 8 }, (_, index) => (
                <ChatListCardSkeleton key={index} />
              ))
            : (() => {
                const chatList =
                  activeTab === "selling" ? SellerChatList : BuyerChatList;
                return chatList.length > 0 ? (
                  chatList.map((chat, index) => (
                    <ChatListCard
                      key={chat.id || index}
                      chat={chat}
                      isActive={chat?.id === chatId}
                      isSelling={activeTab === "selling"}
                      setSellerChatList={setSellerChatList}
                      setBuyerChatList={setBuyerChatList}
                    />
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <NoChatListFound />
                  </div>
                );
              })()}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ChatList;
