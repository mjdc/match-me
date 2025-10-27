import React from "react";
import MessageSidebar from "./MessageSidebar";
import { getMessagesByContainer } from "../actions/messageActions";
import MessageTable from "./MessageTable";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ container: string }>;
}) {
  const {container} = await searchParams;
  const { threads, nextCursor } =
    await getMessagesByContainer(
      container
    );
  return (
    <div className="grid grid-cols-12 gap-5 h-[80vh] mt-10 px-3 md:px-0">
      <div className="md:col-span-2 col-span-12">
        <MessageSidebar />
      </div>
      <div className="md:col-span-10 col-span-12">
        <MessageTable
          initialThreads={threads}
          nextCursor={nextCursor}
        />
      </div>
    </div>
  );
}