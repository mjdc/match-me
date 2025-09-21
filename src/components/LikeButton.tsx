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
      className="relative group transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <AiOutlineHeart
        size={28}
        className={`${hasLiked ? 'fill-rose-500': 'fill-muted'} absolute -top-[2px] -right-[2px] pointer-events-none`}
      />
      <AiFillHeart
        size={24}
        className={`transition-colors disabled:animate-ping
          ${ hasLiked ?( isPending ? "fill-muted" : "fill-rose-500")  : ( isPending ? "fill-rose-500" : "fill-muted")}
          ${isPending ? "animate-ping" : "opacity-100"}
          group-hover:opacity-80`}
      />
    </button>
  );
}
