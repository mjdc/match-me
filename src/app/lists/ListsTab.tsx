"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Member } from "@prisma/client";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useTransition } from "react";
import MemberCard from "../members/MemberCard";
import LoadingComponent from "@/components/Loading";

type Props = {
  members: Member[];
  likeIds: string[];
};

export default function ListsTab({ members, likeIds }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const currentType = searchParams.get("type") ?? "source";

  function handleTabChange(key: string) {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("type", key);
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex w-full flex-col mt-10 gap-5">
      <Tabs
        value={currentType}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="w-full justify-start gap-2">
          <TabsTrigger value="source">Members I have liked</TabsTrigger>
          <TabsTrigger value="target">Members that like me</TabsTrigger>
          <TabsTrigger value="mutual">Mutual likes</TabsTrigger>
        </TabsList>

        <TabsContent value="source">
          {isPending ? (
            <LoadingComponent />
          ) : members.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8">
              {members.map((member) => (
                <MemberCard key={member.id} member={member} likeIds={likeIds} />
              ))}
            </div>
          ) : (
            <div>No members for this filter</div>
          )}
        </TabsContent>

        <TabsContent value="target">
          {isPending ? (
            <LoadingComponent />
          ) : members.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8">
              {members.map((member) => (
                <MemberCard key={member.id} member={member} likeIds={likeIds} />
              ))}
            </div>
          ) : (
            <div>No members for this filter</div>
          )}
        </TabsContent>

        <TabsContent value="mutual">
          {isPending ? (
            <LoadingComponent />
          ) : members.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8">
              {members.map((member) => (
                <MemberCard key={member.id} member={member} likeIds={likeIds} />
              ))}
            </div>
          ) : (
            <div>No members for this filter</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
