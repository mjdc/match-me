"use client";

import React from "react";
import { AiFillDelete, AiOutlineDelete } from "react-icons/ai";
import { PiSpinnerGap } from "react-icons/pi";
import { Button } from "@/components/ui/button";

type Props = {
  loading: boolean;
  onClick?: () => void;
};

export default function DeleteButton({ loading, onClick }: Props) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-10 w-10 p-0 hover:bg-red-100"
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <PiSpinnerGap size={24} className="animate-spin text-red-600" />
      ) : (
        <>
          <AiOutlineDelete
            size={28}
            className="absolute text-white"
          />
          <AiFillDelete size={24} className="text-red-600" />
        </>
      )}
    </Button>
  );
}
