import { getMemberPhotosByUserId } from "@/app/actions/memberActions";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React from "react";

export default async function PhotosPage({
  params,
}: {
  params: { userId: string };
}) {
  const photos = await getMemberPhotosByUserId(params.userId);

  return (
    <>
      <CardHeader className="text-2xl font-semibold">
        Photos
      </CardHeader>
      <Separator />
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {photos &&
            photos.map((photo) => (
              <div key={photo.id} className="relative aspect-square">
                <Image
                  src={photo.url}
                  alt="Image of member"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            ))}
        </div>
      </CardContent>
    </>
  );
}
