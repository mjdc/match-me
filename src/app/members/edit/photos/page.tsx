import { getMemberPhotosByUserId } from "@/app/actions/memberActions";
import { getAuthUserId } from "@/app/actions/authActions";
import { getMemberByUserId } from "@/app/actions/memberActions";
import {
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import MemberPhotos from "@/components/MemberPhotos";
import MemberPhotoUpload from "./MemberPhotoUpload";
import React from "react";

export default async function PhotosPage() {
      const userId = await getAuthUserId();
  const member = await getMemberByUserId(userId);
  const photos = await getMemberPhotosByUserId(
    userId
  );

  return (
    <>
      <CardHeader className="text-2xl font-semibold">
        Photos
      </CardHeader>
      <Separator />
      <CardContent>
        <MemberPhotoUpload />
        <MemberPhotos
          photos={photos}
          editing={true}
          mainImageUrl={member?.image}
        />
      </CardContent>
    </>
  );
}
