import { Loader2 } from "lucide-react";
import React from "react";

export default function LoadingComponent({ label }: { label?: string }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      {label && (
        <p className="mt-2 text-sm text-muted-foreground">{label}</p>
      )}
    </div>
  );
}
