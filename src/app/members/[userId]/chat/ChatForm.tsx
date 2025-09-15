"use client";

import { createMessage } from "@/app/actions/messageActions";
import {
  MessageSchema,
  messageSchema,
} from "@/lib/schemas/MessageSchema";
import { handleFormServerErrors } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { HiPaperAirplane } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PiSpinnerGap } from "react-icons/pi";

export default function ChatForm() {
  const router = useRouter();
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

  const onSubmit = async (data: MessageSchema) => {
    const result = await createMessage(params.userId, data);
    if (result.status === "error") {
      handleFormServerErrors(result, setError);
    } else {
      reset();
      router.refresh();
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
      {/* {errors.text?.message && (
        <p className="text-sm text-destructive mt-1">{errors.text.message}</p>
      )} */}
      {errors.root?.serverError && (
        <p className="text-sm text-destructive mt-1">
          {errors.root.serverError.message}
        </p>
      )}
    </form>
  );
}
