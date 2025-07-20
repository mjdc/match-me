import { getMemberByUserId } from "@/app/actions/memberActions";
import { getAuthUserId } from "@/app/actions/authActions";
import {  CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import React from "react";
import EditForm from "./EditForm";

export default async function MemberEditPage() {
    
  const userId = await getAuthUserId();

  const member = await getMemberByUserId(userId);

  if (!member) return notFound();

  return (
    <>
      <CardHeader className="text-2xl font-semibold">Edit Profile</CardHeader>
      <Separator />
      <CardContent className="text-sm text-muted-foreground">
        <EditForm member={member} /> 
      </CardContent>
    </>
  );
}
