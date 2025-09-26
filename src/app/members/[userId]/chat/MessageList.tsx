"use client";

import { MessageDto } from "@/types";
import React, { useState, useEffect, useRef, useCallback } from "react";
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
  recipientId,
}: Props) {
  const setReadCount = useRef(false);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);

  const messages = useMessageStore((state) => state.messages);
  const setMessages = useMessageStore((state) => state.set);
  const updateUnreadCount = useMessageStore((state) => state.updateUnreadCount);
  const resetMessages = useMessageStore((state) => state.resetMessages);

  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const prevScrollHeight = useRef(0);

  // Initialize store with initial messages
  useEffect(() => {
    resetMessages();
    setMessages(initialMessages.messages);

    // Set cursor to the last message's id for infinite scroll
    if (initialMessages.messages.length > 0) {
      setCursor(initialMessages.messages[initialMessages.messages.length - 1].id);
    }

    if (!setReadCount.current) {
      updateUnreadCount(-initialMessages.readCount);
      setReadCount.current = true;
    }
  }, [
    chatId,
    initialMessages.messages,
    initialMessages.readCount,
    resetMessages,
    setMessages,
    updateUnreadCount,
  ]);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (messages.length === initialMessages.messages.length) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, initialMessages.messages.length]);

  // Infinite scroll for older messages
  useEffect(() => {
    if (!topRef.current) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !loading && cursor) {
          if (!containerRef.current) return;
          prevScrollHeight.current = containerRef.current.scrollHeight;

          setLoading(true);
          const res = await getMessageThread(recipientId, 20, cursor);
          setMessages([...res.messages, ...messages]);

          if (res.messages.length > 0) {
            setCursor(res.messages[res.messages.length - 1].id);
          } else {
            setCursor(undefined);
          }

          setLoading(false);

          // Keep scroll position stable after prepending messages
          if (containerRef.current) {
            const newScrollHeight = containerRef.current.scrollHeight;
            containerRef.current.scrollTop += newScrollHeight - prevScrollHeight.current;
          }
        }
      },
      { threshold: 1 }
    );

    observer.observe(topRef.current);
    return () => observer.disconnect();
  }, [cursor, loading, messages, recipientId, setMessages]);

  // Handle read messages
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

  // Pusher subscription
  useEffect(() => {
    const channel = pusherClient.subscribe(chatId);
    channel.bind("messages:read", handleReadMessages);

    return () => {
      channel.unsubscribe();
      channel.unbind("messages:read", handleReadMessages);
    };
  }, [chatId, handleReadMessages]);

  return (
    <div>
      {messages.length === 0 ? (
        "No messages to display"
      ) : (
        <div
          ref={containerRef}
          className="flex flex-col-reverse overflow-y-auto h-[600px]"
        >
          <div ref={bottomRef} />
          {messages.map((message) => (
            <MessageBox
              key={message.id}
              message={message}
              currentUserId={currentUserId}
            />
          ))}
          <div ref={topRef} />
          {loading && <div>Loading...</div>}
        </div>
      )}
    </div>
  );
}
