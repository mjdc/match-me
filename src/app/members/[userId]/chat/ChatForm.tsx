"use client";

import { createMessage } from "@/app/actions/messageActions";
import {
  MessageSchema,
  messageSchema,
} from "@/lib/schemas/MessageSchema";
import { handleFormServerErrors } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { HiPaperAirplane } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PiSpinnerGap } from "react-icons/pi";
import useMessageStore from "@/hooks/useMessageStore";


export default function ChatForm({ userId }: { userId: string }) {
  const params = useParams<{ userId: string }>();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, isValid, errors },
  } = useForm<MessageSchema>({
    resolver: zodResolver(messageSchema),
  });

  const addMessage = useMessageStore((state) => state.addMessage);
  const replaceMessage = useMessageStore((state) => state.replaceMessage);
  const markFailed = useMessageStore((state) => state.markFailed);
  const onSubmit = async (data: MessageSchema) => {
    const sentDate = new Date().getTime();
    const sent = sentDate.toString();
    // 1. Optimistic pending message
    addMessage({
      id: sent, // real id will come later
      sent: sent,
      text: data.text,
      senderId: userId, 
      recipientId: params.userId,
      created: new Date(sentDate).toLocaleString('en-US'),
      dateRead: null,
      pending: true,
    });

    reset();

    const result = await createMessage(params.userId, data);

    if (result.status === "error") {
      handleFormServerErrors(result, setError);
      markFailed(sent);
    } else {
      // replace pending with server version
      replaceMessage(sent, { ...result.data, pending: false, sent });
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Type a message"
          {...register("text")}
          className={`w-full ${errors.text ? "border-destructive" : ""}`}
        />
        <Button
          type="submit"
          size="icon"
          variant="default"
          disabled={!isValid || isSubmitting}
        >
            {isSubmitting ? (
              <PiSpinnerGap size={18} className="animate-spin" />
            ) : (
              <HiPaperAirplane size={18} />
            )}
          
        </Button>
      </div>
      {errors.root?.serverError && (
        <p className="text-sm text-destructive mt-1">
          {errors.root.serverError.message}
        </p>
      )}
    </form>
  );
}
