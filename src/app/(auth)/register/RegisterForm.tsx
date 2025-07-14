"use client";

import {
  RegisterSchema,
  registerSchema,
} from "@/lib/schemas/RegisterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { useForm } from "react-hook-form";
import { GiPadlock } from "react-icons/gi";
import { registerUser } from "@/app/actions/authActions";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const onSubmit = async(data: RegisterSchema) => {
    const result = await registerUser(data);
    if (result.status === "success") {
      // Handle successful registration, e.g., redirect or show a success message
      console.log("Registration successful:", result.data);
    } else {
      // Handle error, e.g., show an error message
      if(Array.isArray(result.error)) {
        result.error.forEach(err => {
          console.error("Registration error:", err.message);
          const fieldName = err.path.join(".") as |"email" | "password" | "name";
          setError(fieldName, {
            message: err.message,
          })
        });
      } else {
        console.error("Registration error:", result.error);
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center text-center space-y-2">
        <div className="flex items-center gap-3">
          <GiPadlock size={30} />
          <CardTitle className="text-3xl font-semibold">Register</CardTitle>
        </div>
        <CardDescription className="text-neutral-500">
          Welcome to NextMatch
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              placeholder="Name"
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Input
              placeholder="Email"
              type="email"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Input
              placeholder="Password"
              type="password"
              {...register("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={!isValid || isSubmitting}>
            {isSubmitting ? "Submitting..." : "Register"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
