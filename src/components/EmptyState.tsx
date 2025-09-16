import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function EmptyState() {
  return (
    <div className="flex justify-center items-center mt-20">
      <Card className="p-5 max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-muted-foreground">
            There are no results for this filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please select a different filter
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
