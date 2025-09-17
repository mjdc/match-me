"use client";

import { Input } from "@/components/ui/input";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";

export default function UserDetailsForm() {
  const {
    register,
    getValues,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4">
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input
            defaultValue={getValues("name")}
            placeholder="Enter your name"
            {...register("name")}
          />
        </FormControl>
        {errors.name && (
          <FormMessage>
            {errors.name.message as string}
          </FormMessage>
        )}
      </FormItem>

      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input
            defaultValue={getValues("email")}
            placeholder="Enter your email"
            type="email"
            {...register("email")}
          />
        </FormControl>
        {errors.email && (
          <FormMessage>
            {errors.email.message as string}
          </FormMessage>
        )}
      </FormItem>

      <FormItem>
        <FormLabel>Password</FormLabel>
        <FormControl>
          <Input
            defaultValue={getValues("password")}
            placeholder="Enter your password"
            type="password"
            {...register("password")}
          />
        </FormControl>
        {errors.password && (
          <FormMessage>
            {errors.password.message as string}
          </FormMessage>
        )}
      </FormItem>
    </div>
  );
}
