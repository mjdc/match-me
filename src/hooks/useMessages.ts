import {
  deleteMessage,
  getMessagesByContainer,
} from "@/app/actions/messageActions";
import { MessageDto, Thread } from "@/types";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  useState,
  useCallback,
  Key,
  useEffect,
  useRef,
} from "react";
import useMessageStore from "./useMessageStore";

const outboxColumns = [
  { key: "recipientName", label: "Recipient" },
  { key: "text", label: "Message" },
  { key: "created", label: "Date sent" },
  // { key: "actions", label: "Actions" },
];

const inboxColumns = [
  { key: "senderName", label: "Sender" },
  { key: "text", label: "Message" },
  { key: "created", label: "Date received" },
  // { key: "actions", label: "Actions" },
];

export const useMessages = (
  initialThreads: Thread[],
  nextCursor?: string
) => {
  const set = useMessageStore((state) => state.set);
  const remove = useMessageStore((state) => state.remove);
  const messages = useMessageStore((state) => state.messages);
  const updateUnreadCount = useMessageStore((state) => state.updateUnreadCount);
  const resetMessages = useMessageStore((state) => state.resetMessages);

  const cursorRef = useRef(nextCursor);

  const searchParams = useSearchParams();
  const router = useRouter();
  const container = searchParams.get("container");
  const isOutbox = container === "outbox";
  const [isDeleting, setDeleting] = useState({
    id: "",
    loading: false,
  });

  const [loadingMore, setLoadingMore] = useState(false);

  // Track threads for unreadCount and lastMessage
  const [threads, setThreads] = useState<Thread[]>(initialThreads);

  useEffect(() => {
    set(initialThreads.map(thread => thread.lastMessage));
    setThreads(initialThreads);
    cursorRef.current = nextCursor;

    return () => {
      resetMessages();
      setThreads([]);
    };
  }, [initialThreads, set, nextCursor, resetMessages]);

  const loadMore = useCallback(async () => {
    if (cursorRef.current) {
      setLoadingMore(true);
      const { threads: newThreads, nextCursor } = await getMessagesByContainer(container, cursorRef.current);
      setThreads(prev => [...prev, ...newThreads]);
      set([...messages, ...newThreads.map(thread => thread.lastMessage)]);
      cursorRef.current = nextCursor;
      setLoadingMore(false);
    }
  }, [container, messages, set]);

  const columns = isOutbox
    ? outboxColumns
    : inboxColumns;

  const handleDeleteMessage = useCallback(
    async (message: MessageDto) => {
      setDeleting({
        id: message.id,
        loading: true,
      });
      await deleteMessage(message.id, isOutbox);
      remove(message.id);
      if (!message.dateRead && !isOutbox)
        updateUnreadCount(-1);
      setDeleting({ id: "", loading: false });
    },
    [isOutbox, remove, updateUnreadCount]
  );

  const handleRowSelect = (key?: string) => {
    // const message = messages.find(
    //   (m) => m.id === key
    // );
    // const url = isOutbox
    //   ? `/members/${message?.recipientId}`
    //   : `/members/${message?.senderId}`;
    const url = `/members/${key}`;
    router.push(url + "/chat");
  };

  return {
    isOutbox,
    columns,
    deleteMessage: handleDeleteMessage,
    selectRow: handleRowSelect,
    isDeleting,
    messages,
    threads, // <-- Pass threads for unreadCount
    loadingMore,
    loadMore,
    hasMore: !!cursorRef.current,
  };
};