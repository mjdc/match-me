import React from "react";
import { CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ChatPage() {
  return (
    <>
      <CardHeader className="text-2xl font-semibold">
        Chat
      </CardHeader>
      <Separator />
      <CardContent>
        Chat goes here
      </CardContent>
    </>
  );
}
