import Link from "next/link";
import React from "react";
import { MessageDto } from "@/types";
import { toast } from "react-toastify";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";

type Props = {
  image?: string | null;
  href: string;
  title: string;
  subtitle?: string;
};

function NotificationToast({ image, href, title, subtitle }: Props) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-3 p-2 hover:bg-muted rounded-md transition-colors"
    >
      <Avatar>
       <Image
          src={image || "/images/user.png"}
          alt="Sender image"
          width={40}
          height={40}
          className="object-cover rounded-full"
          priority
        />
      </Avatar>
      <div className="flex flex-col justify-center">
        <div className="font-semibold text-sm text-foreground">{title}</div>
        <div className="text-muted-foreground text-xs">{subtitle || "Click to view"}</div>
      </div>
    </Link>
  );
}

export const newMessageToast = (message: MessageDto) => {
  toast(
    <NotificationToast
      image={message.senderImage}
      href={`/members/${message.senderId}/chat`}
      title={`${message.senderName} has sent you a new message`}
    />
  );
};

export const newLikeToast = (name: string, image: string | null, userId: string) => {
  toast(
    <NotificationToast
      image={image}
      href={`/members/${userId}`}
      title={`You have been liked by ${name}`}
      subtitle="Click here to view their profile"
    />
  );
};
