"use client";

import { signOutUser } from "@/app/actions/authActions";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Session } from "next-auth";
import Link from "next/link";
import Image from "next/image";
type Props = {
  user: Session["user"];
};

export default function UserMenu({ user }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          <Image
            src={user?.image || "/images/user.png"}
            alt={user?.name || "user avatar"}
            width={32}
            height={32}
            className="rounded-full object-cover"
            />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          Signed in as {user?.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/members/edit">Edit profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () => signOutUser()}
          className="text-red-600"
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
