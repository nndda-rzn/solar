"use client";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("common");

  const handleLogin = async (values: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      throw new Error(
        error.message === "Invalid login credentials"
          ? t("auth.login.errorInvalid")
          : error.message,
      );
    }

    router.push("/");
    router.refresh();
  };

  return (
    <AuthLayout>
      <LoginForm onSubmit={handleLogin} />
    </AuthLayout>
  );
}
