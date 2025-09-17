"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import { GiPadlock } from "react-icons/gi";
import { useForm } from "react-hook-form";
import {
  loginSchema,
  LoginSchema,
} from "@/lib/schemas/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInUser } from "@/app/actions/authActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

export default function LoginForm() {
const {register, handleSubmit, formState: { errors, isValid }} = useForm({
    mode: "onBlur",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
const router = useRouter();
const onSubmit = async(data: LoginSchema) => {
    const result = await signInUser(data);
    if (result.status === "success") {
      router.push("/members"); 
      // router.refresh(); no longer needed in Next.js 13 with app directory
    } else {
      toast.error(`Login error: ${result.error as string}`);
      
    }
}

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center text-center">
        <div className="flex flex-row items-center gap-3">
          <GiPadlock size={30} />
          <CardTitle className="text-3xl font-semibold">
            Login
          </CardTitle>
        </div>
        <CardDescription className="text-neutral-500">
          Welcome back to MatchMe!
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password"
              {...register("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={!isValid}>
            Login
          </Button>
          <div className="flex justify-center hover:underline text-sm">
            <Link href="/forgot-password">
              Forgot password?
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
