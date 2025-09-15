"use client";

import useMessageStore from "@/hooks/useMessageStore";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useState } from "react";
import { GoInbox } from "react-icons/go";
import { MdOutlineOutbox } from "react-icons/md";

export default function MessageSidebar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [selected, setSelected] = useState<string>(
    searchParams.get("container") || "inbox"
  );

  const items = [
    {
      key: "inbox",
      label: "Inbox",
      icon: GoInbox,
      badge: true,
    },
    {
      key: "outbox",
      label: "Outbox",
      icon: MdOutlineOutbox,
      badge: false,
    },
  ];

  const handleSelect = (key: string) => {
    setSelected(key);
    const params = new URLSearchParams();
    params.set("container", key);
    router.replace(`${pathname}?${params}`);
  };

  const unreadCount= useMessageStore(
    (state) => state.unreadCount
  );

  return (
    <div className="flex flex-col shadow-md rounded-lg cursor-pointer overflow-hidden">
      {items.map(({ key, icon: Icon, label, badge }) => (
        <div
          key={key}
          className={clsx(
            "flex flex-row items-center gap-2 p-3 transition-colors",
            {
              "bg-muted text-primary font-semibold": selected === key,
              "hover:bg-muted/50": selected !== key,
            }
          )}
          onClick={() => handleSelect(key)}
        >
          <Icon size={24} />
          <div className="flex justify-between flex-grow items-center">
            <span>{label}</span>
            {badge && (
              <Badge variant="secondary">{unreadCount}</Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
