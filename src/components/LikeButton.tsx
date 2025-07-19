"use client";

import { toggleLikeMember } from "@/app/actions/likeActions";
import { useRouter } from "next/navigation";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useTransition } from "react";

type Props = {
  targetId: string;
  hasLiked: boolean;
};

export default function LikeButton({ targetId, hasLiked }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function toggleLike() {
    startTransition(async () => {
      await toggleLikeMember(targetId, hasLiked);
      router.refresh();
    });
  }

  return (
    <button
      onClick={toggleLike}
      disabled={isPending}
      aria-label={hasLiked ? "Unlike" : "Like"}
      className="relative group transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <AiOutlineHeart
        size={28}
        className="fill-white absolute -top-[2px] -right-[2px] pointer-events-none"
      />
      <AiFillHeart
        size={24}
        className={`transition-colors ${
          hasLiked ? "fill-rose-500" : "fill-muted"
        } group-hover:opacity-80`}
      />
    </button>
  );
}
