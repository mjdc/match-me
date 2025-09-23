import CardInnerWrapper from "@/components/CardInnerWrapper";
import React from "react";
import ChatForm from "./ChatForm";
import { getMessageThread } from "@/app/actions/messageActions";
import { getAuthUserId } from "@/app/actions/authActions";
import MessageList from "./MessageList";
import { createChatId } from "@/lib/utils";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const paramsResolved = await params
  const messages = await getMessageThread(
    paramsResolved.userId, 20
  );
  const userId = await getAuthUserId();

  const chatId = createChatId(
    userId,
    paramsResolved.userId
  );

  return (
    <CardInnerWrapper
      header="Chat"
      body={
        <MessageList
          initialMessages={messages}
          currentUserId={userId}
          chatId={chatId}
        />
      }
      footer={<ChatForm userId={userId}/>}
    />
  );
}