import { calculateAge } from "@/lib/utils";
import { Card, CardFooter } from "@/components/ui/card";
import { Member } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import React from "react";

type Props = {
  member: Member;
};

export default function MemberCard({ member }: Props) {
  return (
    <Link href={`/members/${member.userId}`} className="block">
      <Card className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-shadow">
        <div className="aspect-square relative w-full">
          <Image
            src={member.image || "/images/user.png"}
            alt={member.name}
            fill
            className="object-cover"
          />
        </div>
        <CardFooter className="absolute bottom-0 z-10 bg-gradient-to-t from-black/70 to-transparent w-full p-4">
          <div className="text-white">
            <div className="font-semibold">
              {member.name}, {calculateAge(member.dateOfBirth)}
            </div>
            <div className="text-sm">{member.city}</div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
