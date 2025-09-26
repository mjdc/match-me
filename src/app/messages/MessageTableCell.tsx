import PresenceAvatar from "@/components/PresenceAvatar";
import { truncateString } from "@/lib/utils";
import { MessageDto } from "@/types";
import { Button } from "@/components/ui/button";
import React from "react";
import { AiFillDelete } from "react-icons/ai";

type Props = {
  item: MessageDto;
  columnKey: string;
  isOutbox: boolean;
  deleteMessage: (message: MessageDto) => void;
  isDeleting: boolean;
  unreadCount?: number; // <-- Add this line
};

export default function MessageTableCell({
  item,
  columnKey,
  isOutbox,
  deleteMessage,
  isDeleting,
  unreadCount, // <-- Add this line
}: Props) {
  const cellValue = item[columnKey as keyof MessageDto];

  switch (columnKey) {
    case "recipientName":
    case "senderName":
      return (
        <div className="flex items-center gap-2 cursor-pointer">
          <PresenceAvatar
            userId={isOutbox ? item.recipientId : item.senderId}
            src={isOutbox ? item.recipientImage : item.senderImage}
          />
          <span className="truncate max-w-[160px]">{cellValue}</span>
          {/* Show unreadCount badge for inbox only */}
          {unreadCount! > 0 && !isOutbox && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                  {unreadCount}
              </span>
          )}
        </div>
      );

    case "text":
      return <div>{truncateString(cellValue, 80)}</div>;

    case "created":
      return <span>{new Date(cellValue as string).toLocaleString()}</span>;

  }
}