"use client";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";
import { SignupFormValues } from "@/types/auth/signup";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function SignupPage() {
  const router = useRouter();
  const t = useTranslations("common");

  const handleSignup = async (values: SignupFormValues) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
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
          ? t("auth.signup.errorExists")
          : error.message,
      );
    }

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      router.push("/login?signup=success");
    }
  };

  return (
    <AuthLayout>
      <SignupForm onSubmit={handleSignup} />
    </AuthLayout>
  );
}
