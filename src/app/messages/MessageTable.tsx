"use client";

import { MessageDto } from "@/types";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import MessageTableCell from "./MessageTableCell";
import { useMessages } from "@/hooks/useMessages";

type Props = {
  initialMessages: MessageDto[];
};

export default function MessageTable({
  initialMessages,
}: Props) {
  const {
    columns,
    isOutbox,
    isDeleting,
    deleteMessage,
    selectRow,
    messages,
  } = useMessages(initialMessages);

  return (
    <Card className="h-[80vh] overflow-auto">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={column.key === "text" ? "w-1/2" : ""}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.length > 0 ? (
              messages.map((item) => (
                <TableRow
                  key={item.id}
                  className="cursor-pointer"
                  onClick={() => selectRow(item.id)}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={`${
                        !item.dateRead && !isOutbox ? "font-semibold" : ""
                      }`}
                    >
                      <MessageTableCell
                        item={item}
                        columnKey={column.key}
                        isOutbox={isOutbox}
                        deleteMessage={deleteMessage}
                        isDeleting={
                          isDeleting.loading && isDeleting.id === item.id
                        }
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-6">
                  No messages for this container
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
