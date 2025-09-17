"use client";

import { resetPassword } from "@/app/actions/authActions";
import CardWrapper from "@/components/CardWrapper";
import ResultMessage from "@/components/ResultMessage";
import {
  ResetPasswordSchema,
  resetPasswordSchema,
} from "@/lib/schemas/ForgotPasswordSchema";
import { ActionResult } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GiPadlock } from "react-icons/gi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [result, setResult] =
    useState<ActionResult<string> | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ResetPasswordSchema>({
    mode: "onTouched",
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordSchema) => {
    setResult(
      await resetPassword(
        data.password,
        searchParams.get("token")
      )
    );
    reset();
  };

  return (
    <CardWrapper
      headerIcon={GiPadlock}
      headerText="Reset password"
      subHeaderText="Enter your new password below"
      body={
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="Enter new password"
                {...register("password")}
              />
            </FormControl>
            {errors.password && (
              <FormMessage>
                {errors.password.message}
              </FormMessage>
            )}
          </FormItem>

          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="Confirm new password"
                {...register("confirmPassword")}
              />
            </FormControl>
            {errors.confirmPassword && (
              <FormMessage>
                {errors.confirmPassword.message}
              </FormMessage>
            )}
          </FormItem>

          <Button
            type="submit"
            disabled={!isValid}
          >
            {isSubmitting ? "Resetting..." : "Reset password"}
          </Button>
        </form>
      }
      footer={<ResultMessage result={result} />}
    />
  );
}
