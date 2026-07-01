"use client";

import { useState } from "react";
import { LoginFormValues, LoginFormErrors } from "@/types/auth/login";
import { validateLoginForm } from "@/lib/utils/validators";

export function useLoginForm() {
  const [values, setValues] = useState<LoginFormValues>({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name as keyof LoginFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (
    onSubmit: (values: LoginFormValues) => Promise<void>,
  ) => {
    const { isValid, errors: validationErrors } = validateLoginForm(values);

    if (!isValid) {
      setErrors(validationErrors as LoginFormErrors);
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

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
