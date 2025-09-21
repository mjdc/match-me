"use client";

import { Photo } from "@prisma/client";
import { CldImage } from "next-cloudinary";
import React from "react";
import { Button } from "@/components/ui/button"; // ✅ shadcn
import clsx from "clsx";
import { ImCheckmark, ImCross } from "react-icons/im";
import { useRole } from "@/hooks/useRole";
import { approvePhoto, rejectPhoto } from "@/app/actions/adminActions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image"; // ✅ optimized Next.js image

type Props = {
  photo: Photo | null;
};

export default function MemberImage({ photo }: Props) {
  const role = useRole();
  const isAdmin = role === "ADMIN";
  const router = useRouter();

  if (!photo) return null;

  const approve = async (photoId: string) => {
    try {
      await approvePhoto(photoId);
      router.refresh();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const reject = async (photo: Photo) => {
    try {
      await rejectPhoto(photo);
      router.refresh();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="relative">
      {photo?.publicId ? (
        <CldImage
          alt="Image of member"
          src={photo.publicId}
          width={300}
          height={300}
          crop="fill"
          gravity="faces"
          className={clsx("rounded-2xl", {
            "opacity-40": !photo.isApproved && !isAdmin,
          })}
          priority
        />
      ) : (
        <Image
          src={photo?.url || "/images/user.png"}
          alt="Image of user"
          width={300}
          height={300}
          className="rounded-2xl object-cover"
        />
      )}

      {/* Pending Approval Banner */}
      {!photo?.isApproved && !isAdmin && (
        <div className="absolute bottom-2 w-full bg-slate-200 p-1 rounded-md">
          <div className="flex justify-center text-red-600 font-semibold text-sm">
            Awaiting approval
          </div>
        </div>
      )}

      {/* Admin Action Buttons */}
      {isAdmin && (
        <div className="flex flex-row gap-2 mt-2">
          <Button
            onClick={() => approve(photo.id)}
            variant="outline"
            className="w-full border-green-500 text-green-600 hover:bg-green-50"
          >
            <ImCheckmark size={20} />
          </Button>
          <Button
            onClick={() => reject(photo)}
            variant="outline"
            className="w-full border-red-500 text-red-600 hover:bg-red-50"
          >
            <ImCross size={20} />
          </Button>
        </div>
      )}
    </div>
  );
}
