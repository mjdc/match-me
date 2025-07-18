import { getMemberByUserId } from "@/app/actions/memberActions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import React from "react";

export default async function MemberDetailedPage({
  params,
}: {
  params: { userId: string };
}) {
  const member = await getMemberByUserId(params.userId);

  if (!member) return notFound();

  return (
    <>
      <CardHeader className="text-2xl font-semibold">Profile</CardHeader>
      <Separator />
      <CardContent className="text-sm text-muted-foreground">
        {member.description}
      </CardContent>
    </>
  );
}
