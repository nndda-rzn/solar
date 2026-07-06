"use client";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("common");
  const searchParams = useSearchParams();
  const signupSuccess = searchParams.get("signup") === "success";

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

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <AuthLayout>
      {signupSuccess && (
        <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-center text-sm text-emerald-300">
          {t("auth.login.signupSuccess")}
        </div>
      )}
      <LoginForm onSubmit={handleLogin} />
    </AuthLayout>
  );
}
