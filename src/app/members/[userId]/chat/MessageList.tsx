"use client";

import { MessageDto } from "@/types";
import React, { useCallback, useEffect, useRef } from "react";
import MessageBox from "./MessageBox";
import { pusherClient } from "@/lib/pusher";
import { formatShortDateTime } from "@/lib/utils";
import useMessageStore from "@/hooks/useMessageStore";

type Props = {
  initialMessages: {
    messages: MessageDto[];
    readCount: number;
  };
  currentUserId: string;
  chatId: string;
};

export default function MessageList({
  initialMessages,
  currentUserId,
  chatId,
}: Props) {
  const setReadCount = useRef(false);

  // pull from Zustand store
  const messages = useMessageStore((state) => state.messages);
  const addMessage = useMessageStore((state) => state.add);
  const setMessages = useMessageStore((state) => state.set);
  const updateUnreadCount = useMessageStore((state) => state.updateUnreadCount);

  // initialize store with initialMessages
  useEffect(() => {
    setMessages(initialMessages.messages);

    if (!setReadCount.current) {
      updateUnreadCount(-initialMessages.readCount);
      setReadCount.current = true;
    }
  }, [initialMessages.messages, initialMessages.readCount, setMessages, updateUnreadCount]);

  // handle new incoming message
  const handleNewMessage = useCallback(
    (message: MessageDto) => {
      addMessage(message);
    },
    [addMessage]
  );

  // handle read messages
  const handleReadMessages = useCallback(
    (messageIds: string[]) => {
      const updated = messages.map((message) =>
        messageIds.includes(message.id)
          ? { ...message, dateRead: formatShortDateTime(new Date()) }
          : message
      );
      setMessages(updated);
    },
    [messages, setMessages]
  );

  // subscribe to Pusher
  useEffect(() => {
    const channel = pusherClient.subscribe(chatId);
    channel.bind("message:new", handleNewMessage);
    channel.bind("messages:read", handleReadMessages);

    return () => {
      channel.unsubscribe();
      channel.unbind("message:new", handleNewMessage);
      channel.unbind("messages:read", handleReadMessages);
    };
  }, [chatId, handleNewMessage, handleReadMessages]);

  return (
    <div>
      {messages.length === 0 ? (
        "No messages to display"
      ) : (
        <>
          {messages.map((message) => (
            <MessageBox
              key={message.id}
              message={message}
              currentUserId={currentUserId}
            />
          ))}
        </>
      )}
    </div>
  );
}
