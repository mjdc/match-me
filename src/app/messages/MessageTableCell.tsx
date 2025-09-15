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
};

export default function MessageTableCell({
  item,
  columnKey,
  isOutbox,
  deleteMessage,
  isDeleting,
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
        </div>
      );

    case "text":
      return <div>{truncateString(cellValue, 80)}</div>;

    case "created":
      return <span>{new Date(cellValue as string).toLocaleString()}</span>;

    default:
      return (
        <Button
          variant="ghost"
          size="icon"
          title="Delete message"
          onClick={() => deleteMessage(item)}
          disabled={isDeleting}
          className="text-red-500 hover:text-red-600"
        >
          <AiFillDelete className="w-5 h-5" />
        </Button>
      );
  }
}
