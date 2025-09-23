"use client";

import { MessageDto } from "@/types";
import React, {useState, useCallback, useEffect, useRef } from "react";
import MessageBox from "./MessageBox";
import { pusherClient } from "@/lib/pusher";
import { formatShortDateTime } from "@/lib/utils";
import useMessageStore from "@/hooks/useMessageStore";
import { getMessageThread } from "@/app/actions/messageActions";

type Props = {
  initialMessages: {
    messages: MessageDto[];
    readCount: number;
  };
  currentUserId: string;
  chatId: string;
  recipientId: string;
};

export default function MessageList({
  initialMessages,
  currentUserId,
  chatId,
  recipientId
}: Props) {
  const setReadCount = useRef(false);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  // pull from Zustand store
  const messages = useMessageStore((state) => state.messages);
  // const addMessage = useMessageStore((state) => state.add);
  const setMessages = useMessageStore((state) => state.set);
  const updateUnreadCount = useMessageStore((state) => state.updateUnreadCount);
  const resetMessages = useMessageStore((state) => state.resetMessages);

  // initialize store with initialMessages
  useEffect(() => {
    resetMessages();
    setMessages(initialMessages.messages);
    // Set cursor to the last message's id for infinite scroll
    if (initialMessages.messages.length > 0) {
      setCursor(initialMessages.messages[initialMessages.messages.length - 1].id);
    } else {
      setCursor(undefined);
    }

    if (!setReadCount.current) {
      updateUnreadCount(-initialMessages.readCount);
      setReadCount.current = true;
    }
  }, [chatId, resetMessages, initialMessages.messages, initialMessages.readCount, setMessages, updateUnreadCount]);

  // Infinite scroll handler
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!topRef.current) return;
    const observer = new IntersectionObserver(async ([entry]) => {
      if (entry.isIntersecting && !loading && cursor) {
        setLoading(true);
        const res = await getMessageThread(recipientId, 20, cursor);
        setMessages([...res.messages, ...messages]);
        // Update cursor to the last message's id from the new batch
        if (res.messages.length > 0) {
          setCursor(res.messages[res.messages.length - 1].id);
        } else {
          setCursor(undefined);
        }
        setLoading(false);
      }
    }, { threshold: 1 });
    observer.observe(topRef.current);
    return () => observer.disconnect();
  }, [cursor, loading, messages, recipientId, setMessages]);

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
    // channel.bind("message:new", handleNewMessage);
    channel.bind("messages:read", handleReadMessages);

    return () => {
      channel.unsubscribe();
      // channel.unbind("message:new", handleNewMessage);
      channel.unbind("messages:read", handleReadMessages);
    };
  }, [chatId, handleReadMessages]);

  return (
    <div>
      {messages.length === 0 ? (
        "No messages to display"
      ) : (
        <>
          <div ref={topRef} />
          {loading && <div>Loading...</div>}
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
