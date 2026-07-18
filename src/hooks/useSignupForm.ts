"use client";

import { useState } from "react";
import { SignupFormValues, SignupFormErrors } from "@/types/auth/signup";
import { validateSignupForm } from "@/lib/utils/validators";

export function useSignupForm() {
  const [values, setValues] = useState<SignupFormValues>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof SignupFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (
    onSubmit: (values: SignupFormValues) => Promise<void>,
  ) => {
    const { isValid, errors: validationErrors } = validateSignupForm(values);

    if (!isValid) {
      setErrors(validationErrors as SignupFormErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    try {
      await onSubmit(values);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Pendaftaran gagal. Coba lagi.";
      setErrors({ form: message });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return {
    values,
    errors,
    isLoading,
    showPassword,
    handleChange,
    handleSubmit,
    togglePasswordVisibility,
  };
}
