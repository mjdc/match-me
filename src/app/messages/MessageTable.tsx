"use client";

import { MessageDto } from "@/types";
import React from "react";
import MessageTableCell from "./MessageTableCell";
import { useMessages } from "@/hooks/useMessages";
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
import { Button } from "@/components/ui/button";

type Props = {
  initialMessages: MessageDto[];
  nextCursor?: string;
};

export default function MessageTable({
  initialMessages,
  nextCursor,
}: Props) {
  const {
    columns,
    isOutbox,
    isDeleting,
    deleteMessage,
    selectRow,
    messages,
    loadMore,
    loadingMore,
    hasMore,
  } = useMessages(initialMessages, nextCursor);

  return (
    <div className="flex flex-col h-[80vh]">
      <Card className="flex flex-col h-full">
        <CardContent className="flex-1 overflow-auto p-0">
          <Table className="h-full">
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
              {messages.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center text-muted-foreground"
                  >
                    No messages for this container
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((item) => (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer"
                    onClick={() => selectRow(item.id)}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        className={
                          !item.dateRead && !isOutbox
                            ? "font-semibold"
                            : ""
                        }
                      >
                        <MessageTableCell
                          item={item}
                          columnKey={col.key}
                          isOutbox={isOutbox}
                          deleteMessage={deleteMessage}
                          isDeleting={
                            isDeleting.loading &&
                            isDeleting.id === item.id
                          }
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* Sticky footer with Load More */}
        <div className="sticky bottom-0 pb-3 mr-3 text-right bg-background">
          <Button
            variant="outline"
            disabled={!hasMore || loadingMore}
            onClick={loadMore}
          >
            {loadingMore
              ? "Loading..."
              : hasMore
              ? "Load more"
              : "No more messages"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
