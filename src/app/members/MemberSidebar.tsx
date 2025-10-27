"use client";

import { calculateAge } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Member } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import PresenceDot from "@/components/PresenceDot";
import LikeButton from "@/components/LikeButton";

type Props = {
  member: Member;
  navLinks: { name: string; href: string }[];
  hasLiked?: boolean;
};

export default function MemberSidebar({ member, navLinks, hasLiked }: Props) {
  const pathname = usePathname();


  return (
    <Card className="w-full mt-5 md:mt-10 md:h-[80vh] md:min-h-[48rem] flex flex-row md:flex-col items-center rounded-b-none rounded-t-lg md:rounded-xl md:.shadow-sm shadow-none py-3 md:py-6">
      <div className="mt-6 w-18 h-18 md:w-32 md:h-32 lg:w-50 lg:h-50 relative">
        <Image
          src={member.image || "/images/user.png"}
          alt="User profile main image"
          fill
          className="object-cover rounded-full p-2 overflow-hidden"
        />
        <div className="absolute top-[-5px] right-[-5px] md:top-3 md:right-3 z-50">
          {typeof hasLiked !== "undefined" && (
            <LikeButton
              targetId={member.userId}
              hasLiked={hasLiked}
            />
          )}
        </div>
      </div>

      <CardContent className="flex w-[calc(100%-4.5rem)] flex-col md:items-center md:mt-4 px-2 md:px-6 md:text-center overflow-hidden">
        <div className="flex">
          <div className="md:text-2xl">
            {member.name},{" "}
            {calculateAge(member.dateOfBirth)}
          </div>
          <div>
            <PresenceDot member={member} />
          </div>
        </div>
        <div className="text-xs md:text-sm text-muted-foreground">
          {member.city}, {member.country}
        </div>

        <Separator className="my-3 md:my-4 w-full" />

        <nav className="flex flex-row md:flex-col md:text-lg gap-3 md:gap-4 w-full">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`rounded md:px-2 py-1 text-center transition-colors ${
                pathname === link.href
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </CardContent>

      <CardFooter className="mt-auto w-full px-6 pb-6 hidden md:block">
        <Button asChild variant="outline" className="w-full">
          <Link href="/members">Go back</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
