import { getMemberByUserId } from "@/app/actions/memberActions";
import React, { ReactNode } from "react";
import MemberSidebar from "../MemberSidebar";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { fetchCurrentUserLikeIds } from "@/app/actions/likeActions";

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ userId: string }>; 
}) {
  const {userId} = await params;
  const member = await getMemberByUserId(userId);
  if (!member) return notFound();

  const basePath = `/members/${member.userId}`;

  const navLinks = [
    { name: "Profile", href: `${basePath}` },
    {
      name: "Photos",
      href: `${basePath}/photos`,
    },
    { name: "Chat", href: `${basePath}/chat` },
  ];
  const likeIds = await fetchCurrentUserLikeIds();

  return (
    <div className="grid grid-cols-12 md:gap-5 h-[75vh] md:h[80vh] min-h-[48rem] px-3 md:px-0">
      <div className="col-span-12 md:col-span-3 z-2 relative">
        <MemberSidebar member={member} navLinks={navLinks} hasLiked={likeIds.includes(member.userId)} />
      </div>
      <div className="col-span-12 md:col-span-9">
        <Card className="w-full -mt-20 md:mt-10 h-[75vh] md:h[80vh] min-h-[48rem] flex flex-col">
          {children}
        </Card>
      </div>
    </div>
  );
}
