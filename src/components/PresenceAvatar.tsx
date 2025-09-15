import usePresenceStore from "@/hooks/usePresenceStore";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import clsx from "clsx";

type Props = {
  userId?: string;
  src?: string | null;
};

export default function PresenceAvatar({ userId, src }: Props) {
  const membersId= usePresenceStore((state) => state.membersId);

  const isOnline = userId && membersId.includes(userId);

  return (
    <div className="relative w-10 h-10">
      <Avatar className="w-10 h-10">
        {src ? (
          <Image
            src={src}
            alt="User avatar"
            fill
            className="object-cover rounded-full"
          />
        ) : (
          <AvatarFallback>?</AvatarFallback>
        )}
      </Avatar>

      {/* Online Dot */}
      <span
        className={clsx(
          "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background",
          {
            "bg-green-500": isOnline,
            "hidden": !isOnline,
          }
        )}
      />
    </div>
  );
}
