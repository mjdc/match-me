"use client";

import { Photo } from "@prisma/client";
import { CldImage } from "next-cloudinary";
import React from "react";
import Image from "next/image";

type Props = {
  photo: Photo | null;
};

export default function MemberImage({ photo }: Props) {
  const fallbackSrc = "/images/user.png";

  return (
    <div className="w-full h-auto relative rounded-2xl overflow-hidden">
      {photo?.publicId ? (
        <CldImage
          alt="Image of member"
          src={photo.publicId}
          width={300}
          height={300}
          crop="fill"
          gravity="faces"
          className="object-cover w-full h-full rounded-2xl"
          priority
        />
      ) : (
        <Image
          src={photo?.url || fallbackSrc}
          alt="Image of user"
          fill
          className="object-cover w-full h-full relative! rounded-2xl"
        />
      )}
    </div>
  );
}
