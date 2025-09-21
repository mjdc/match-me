"use client";

import {
  memberEditSchema,
  MemberEditSchema,
} from "@/lib/schemas/MemberEditSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Member } from "@prisma/client";
import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateMemberProfile } from "@/app/actions/userActions"
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { handleFormServerErrors } from "@/lib/utils";

type Props = {
  member: Member;
};

export default function EditForm({ member }: Props) {
  const router = useRouter();
const defaultValues: MemberEditSchema = {
    name: member.name,
    description: member.description,
    city: member.city,
    country: member.country,
  };
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { isValid, isDirty, isSubmitting, errors },
  } = useForm<MemberEditSchema>({
    resolver: zodResolver(memberEditSchema),
    mode: "onTouched",
    values: defaultValues
  });

//   useEffect(() => {
//     if (member) {
//       reset({
//         name: member.name,
//         description: member.description,
//         city: member.city,
//         country: member.country,
//       });
//     }
//   }, [member, reset]);

  const onSubmit = async (data: MemberEditSchema) => {
    const nameUpdated = data.name !== member.name;
    const result = await updateMemberProfile(data, nameUpdated);

    if (result.status === "success") {
      toast.success("Profile updated");
      router.refresh();
      reset({ ...data });
    } else {
      handleFormServerErrors(result, setError);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4 py-4">
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <Input
          id="name"
          {...register("name")}
          defaultValue={member.name}
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          {...register("description")}
          defaultValue={member.description}
          rows={6}
          className={errors.description ? "border-destructive" : ""}
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <div className="flex flex-row gap-3">
        <div className="flex-1 space-y-1">
          <label htmlFor="city" className="text-sm font-medium">
            City
          </label>
          <Input
            id="city"
            {...register("city")}
            defaultValue={member.city}
            className={errors.city ? "border-destructive" : ""}
          />
          {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
        </div>

        <div className="flex-1 space-y-1">
          <label htmlFor="country" className="text-sm font-medium">
            Country
          </label>
          <Input
            id="country"
            {...register("country")}
            defaultValue={member.country}
            className={errors.country ? "border-destructive" : ""}
          />
          {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
        </div>
      </div>

      {errors.root?.serverError && (
        <p className="text-sm text-destructive">{errors.root.serverError.message}</p>
      )}

      <Button
        type="submit"
        className="self-end"
        disabled={!isValid || !isDirty || isSubmitting}
      >
        {isSubmitting ? "Updating..." : "Update profile"}
      </Button>
    </form>
  );
}
