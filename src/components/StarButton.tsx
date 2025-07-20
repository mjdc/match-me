"use client";

import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { PiSpinnerGap } from "react-icons/pi";
import { Button } from "@/components/ui/button";

type Props = {
  selected: boolean;
  loading: boolean;
  onClick?: () => void;
};

export default function StarButton({ selected, loading, onClick }: Props) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-10 w-10 p-0 hover:bg-yellow-100"
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <PiSpinnerGap size={24} className="animate-spin text-yellow-500" />
      ) : (
        <>
          <AiOutlineStar
            size={28}
            className="absolute text-white"
          />
          <AiFillStar
            size={24}
            className={selected ? "text-yellow-400" : "text-neutral-400"}
          />
        </>
      )}
    </Button>
  );
}
