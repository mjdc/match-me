import { ReactNode } from "react";
import { IconType } from "react-icons/lib";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  body?: ReactNode;
  headerIcon: IconType;
  headerText: string;
  subHeaderText?: string;
  action?: () => void;
  actionLabel?: string;
  footer?: ReactNode;
};

export default function CardWrapper({
  body,
  footer,
  headerIcon: Icon,
  headerText,
  subHeaderText,
  action,
  actionLabel,
}: Props) {
  return (
    <div className="flex items-center justify-center">
      <Card className="w-2/5 mx-auto p-6">
        <CardHeader className="flex flex-col items-center justify-center">
          <div className="flex flex-col gap-2 items-center text-center">
            <div className="flex flex-row items-center gap-3">
              <Icon size={30} />
              <CardTitle className="text-3xl font-semibold">
                {headerText}
              </CardTitle>
            </div>
            {subHeaderText && (
              <CardDescription className="text-neutral-500">
                {subHeaderText}
              </CardDescription>
            )}
          </div>
        </CardHeader>

        {body && <CardContent>{body}</CardContent>}

        {(action || footer) && (
          <CardFooter className="flex flex-col gap-2 justify-center">
            {action && (
              <Button
                onClick={action}
                variant="outline"
                className="w-full"
              >
                {actionLabel}
              </Button>
            )}
            {footer && <>{footer}</>}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
