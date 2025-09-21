"use client";

import { registerUser } from "@/app/actions/authActions";
import {
  profileSchema,
  registerSchema,
  RegisterSchema,
  combinedRegisterSchema
} from "@/lib/schemas/RegisterSchema";
import { handleFormServerErrors } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import {
  FormProvider,
  useForm,
} from "react-hook-form";
import { GiPadlock } from "react-icons/gi";
import UserDetailsForm from "./UserDetailsForm";
import ProfileDetailsForm from "./ProfileDetailsForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const stepSchemas = [
  registerSchema.partial(), // Only require fields for step 1
  profileSchema.partial(),  // Only require fields for step 2
];

export default function RegisterForm() {
  const [activeStep, setActiveStep] = useState(0);
  const currentValidationSchema = stepSchemas[activeStep];

  const registerFormMethods = useForm<RegisterSchema>({
    resolver: zodResolver(combinedRegisterSchema.and(currentValidationSchema)),
    mode: "onTouched",
  });

  const {
    handleSubmit,
    getValues,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = registerFormMethods;

  const router = useRouter();

  const onSubmit = async () => {
    const result = await registerUser(getValues());
    if (result.status === "success") {
      router.push("/register/success");
    } else {
      handleFormServerErrors(result, setError);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <UserDetailsForm />;
      case 1:
        return <ProfileDetailsForm />;
      default:
        return "Unknown step";
    }
  };

  const onBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const onNext = async () => {
    if (activeStep === stepSchemas.length - 1) {
      await onSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  return (
    <Card className="w-3/5 mx-auto">
      <CardHeader className="flex flex-col items-center justify-center">
        <div className="flex flex-col gap-2 items-center text-foreground">
          <div className="flex flex-row items-center gap-3">
            <GiPadlock size={30} />
            <CardTitle className="text-3xl font-semibold">
              Register
            </CardTitle>
          </div>
          <CardDescription>
            Welcome to NextMatch
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <FormProvider {...registerFormMethods}>
          <form onSubmit={handleSubmit(onNext)}>
            <div className="space-y-4 w-full">
              {getStepContent(activeStep)}

              {errors.root?.serverError && (
                <p className="text-destructive text-sm">
                  {errors.root.serverError.message}
                </p>
              )}

              <div className="w-full flex flex-row items-center gap-6">
                {activeStep !== 0 && (
                  <Button
                    type="button"
                    onClick={onBack}
                    className="flex-grow"
                    variant="secondary"
                  >
                    Back
                  </Button>
                )}
                <Button
                  disabled={!isValid || isSubmitting}
                  className="flex-grow"
                  type="submit"
                >
                  {activeStep === stepSchemas.length - 1
                    ? "Submit"
                    : "Continue"}
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
