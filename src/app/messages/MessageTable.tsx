"use client";

import { Thread } from "@/types";
import React, { useEffect, useRef } from "react";
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

type Props = {
  initialThreads: Thread[];
  nextCursor?: string;
};

export default function MessageTable({
  initialThreads,
  nextCursor,
}: Props) {
  const {
    columns,
    isOutbox,
    isDeleting,
    deleteMessage,
    selectRow,
    messages,
    threads, // <-- threads now available
    loadMore,
    loadingMore,
    hasMore,
  } = useMessages(initialThreads, nextCursor);
  // console.log('table threads', threads)
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentLoader = loaderRef.current;
    if (!currentLoader) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { root: null, rootMargin: "100px", threshold: 0 }
    );

    observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [hasMore, loadingMore, loadMore]);

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
                messages.map((item) => {
                  // Find the thread for this message
                  const thread = threads.find(
                    (t) => t.lastMessage.id === item.id
                  );
                  return (
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
                            unreadCount={thread?.unreadCount} // <-- Pass unreadCount from thread
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Loader sentinel */}
          <div ref={loaderRef} className="h-12 flex items-center justify-center">
            {loadingMore && <span className="text-muted-foreground">Loading...</span>}
            {!hasMore && <span className="text-muted-foreground">No more messages</span>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
