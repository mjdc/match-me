import React, { ReactNode } from "react";
import {
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Props = {
  header: ReactNode | string;
  body: ReactNode;
  footer?: ReactNode;
};

export default function CardInnerWrapper({ header, body, footer }: Props) {
  return (
    <>
      <CardHeader>
        {typeof header === "string" ? (
          <CardTitle>{header}</CardTitle>
        ) : (
          <>{header}</>
        )}
      </CardHeader>
      <Separator className="my-0" />
      <CardContent className="overflow-scroll px-0 md:px-6">{body}</CardContent>

      {footer && <CardFooter className="mt-auto">{footer}</CardFooter>}
    </>
  );
}
