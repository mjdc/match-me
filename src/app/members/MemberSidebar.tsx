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

type Props = {
  member: Member;
  navLinks: { name: string; href: string }[];
};

export default function MemberSidebar({ member, navLinks }: Props) {
  const pathname = usePathname();

  return (
    <Card className="w-full mt-10 h-[80vh] min-h-[48rem] flex flex-col items-center">
      <div className="mt-6 relative w-40 h-40 rounded-full overflow-hidden">
        <Image
          src={member.image || "/images/user.png"}
          alt="User profile main image"
          fill
          className="object-cover"
        />
      </div>

      <CardContent className="flex flex-col items-center mt-4 px-6 text-center overflow-hidden">
        <div className="flex">
          <div className="text-2xl">
            {member.name},{" "}
            {calculateAge(member.dateOfBirth)}
          </div>
          <div>
            <PresenceDot member={member} />
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {member.city}, {member.country}
        </div>

        <Separator className="my-4 w-full" />

        <nav className="flex flex-col text-lg gap-4 w-full">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`rounded px-2 py-1 text-center transition-colors ${
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

      <CardFooter className="mt-auto w-full px-6 pb-6">
        <Button asChild variant="outline" className="w-full">
          <Link href="/members">Go back</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
