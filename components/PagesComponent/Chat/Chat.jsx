"use client";
import SelectedChatHeader from "./SelectedChatHeader";
import ChatList from "./ChatList";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import NoChatFound from "./NoChatFound";
import ChatMessages from "./ChatMessages";
import { useSelector } from "react-redux";
import { getCurrentLangCode } from "@/redux/reducer/languageSlice";

const Chat = () => {
  const [SellerChatList, setSellerChatList] = useState([]);
  const [BuyerChatList, setBuyerChatList] = useState([]);
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("activeTab") || "selling";
  const chatId = Number(searchParams.get("chatid"));
  const [selectedChatDetails, setSelectedChatDetails] = useState();
  const langCode = useSelector(getCurrentLangCode);

  useEffect(() => {
    if (chatId && activeTab === "selling" && SellerChatList.length > 0) {
      setSelectedChatDetails(SellerChatList.find((chat) => chat.id === chatId));
    } else if (chatId && activeTab === "buying" && BuyerChatList.length > 0) {
      setSelectedChatDetails(BuyerChatList.find((chat) => chat.id === chatId));
    } else if (!chatId) {
      setSelectedChatDetails("");
    }
  }, [chatId, activeTab, SellerChatList, BuyerChatList, langCode]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12">
      <div className="col-span-4">
        <ChatList
          chatId={chatId}
          activeTab={activeTab}
          setSellerChatList={setSellerChatList}
          setBuyerChatList={setBuyerChatList}
          SellerChatList={SellerChatList}
          BuyerChatList={BuyerChatList}
          langCode={langCode}
        />
      </div>
      <div className="col-span-8">
        {selectedChatDetails?.id ? (
          <div className="ltr:lg:border-l rtl:lg:border-r h-[800px] flex flex-col">
            <SelectedChatHeader
              selectedChat={selectedChatDetails}
              isSelling={activeTab === "selling"}
              setSelectedChat={setSelectedChatDetails}
            />

            <ChatMessages
              selectedChatDetails={selectedChatDetails}
              setSelectedChatDetails={setSelectedChatDetails}
              isSelling={activeTab === "selling"}
              setBuyerChatList={setBuyerChatList}
              chatId={chatId}
            />
          </div>
        ) : (
          <div className="ltr:lg:border-l rtl:lg:border-r h-[800px] flex items-center justify-center">
            <NoChatFound />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
