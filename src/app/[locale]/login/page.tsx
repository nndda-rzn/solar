"use client";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  const handleLogin = async (values: {
    username: string;
    password: string;
    rememberMe: boolean;
  }) => {
    console.log("Login:", values);
  };

  return (
    <AuthLayout>
      <LoginForm onSubmit={handleLogin} />
    </AuthLayout>
  );
}
