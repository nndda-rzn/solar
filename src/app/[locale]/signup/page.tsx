"use client";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";
import { SignupFormValues } from "@/types/auth/signup";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "@/i18n/navigation";

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = async (values: SignupFormValues) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          username: values.username,
          displayName: values.username,
        },
      },
    });

    if (error) {
      throw new Error(
        error.message === "User already registered"
          ? "Email sudah terdaftar"
          : error.message,
      );
    }

    router.push("/login");
  };

  return (
    <AuthLayout>
      <SignupForm onSubmit={handleSignup} />
    </AuthLayout>
  );
}
