"use client";

import { useSignupForm } from "@/hooks/useSignupForm";
import { SignupFormValues } from "@/types/auth/signup";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface SignupFormProps {
  onSubmit: (values: SignupFormValues) => Promise<void>;
}

export function SignupForm({ onSubmit }: SignupFormProps) {
  const t = useTranslations("common");
  const {
    values,
    errors,
    isLoading,
    showPassword,
    handleChange,
    handleSubmit,
    togglePasswordVisibility,
  } = useSignupForm();

  return (
    <div
      className="w-full max-w-md p-8 rounded-2xl relative pointer-events-auto"
      style={{
        background: "rgba(15, 15, 26, 0.8)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(0, 255, 255, 0.15)",
        boxShadow:
          "0 0 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 255, 255, 0.05)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-2 h-2 rounded-full bg-cyan-400"
          style={{ boxShadow: "0 0 8px rgba(0, 255, 255, 0.6)" }}
        />
        <span className="text-cyan-400 text-xs font-medium tracking-wider uppercase">
          {t("auth.signup.badge")}
        </span>
      </div>

      <h2 className="text-2xl font-bold text-white mb-1">
        {t("auth.signup.title")}
      </h2>
      <p className="text-gray-400 text-sm mb-6">{t("auth.signup.subtitle")}</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSubmit);
        }}
        className="space-y-4"
      >
        {errors.form && (
          <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-400">
            {errors.form}
          </p>
        )}

        <div>
          <label className="block text-gray-400 text-xs font-medium mb-2 tracking-wider uppercase">
            {t("auth.signup.username")}
          </label>
          <input
            type="text"
            name="username"
            value={values.username}
            onChange={handleChange}
            placeholder={t("auth.signup.usernamePlaceholder")}
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
            style={{
              background: "rgba(30, 41, 59, 0.5)",
              border: errors.username
                ? "1px solid #f87171"
                : "1px solid rgba(255, 255, 255, 0.1)",
            }}
          />
          {errors.username && (
            <p className="text-red-400 text-xs mt-1">{errors.username}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-400 text-xs font-medium mb-2 tracking-wider uppercase">
            {t("auth.signup.email")}
          </label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder={t("auth.signup.emailPlaceholder")}
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
            style={{
              background: "rgba(30, 41, 59, 0.5)",
              border: errors.email
                ? "1px solid #f87171"
                : "1px solid rgba(255, 255, 255, 0.1)",
            }}
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-400 text-xs font-medium mb-2 tracking-wider uppercase">
            {t("auth.signup.password")}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={values.password}
              onChange={handleChange}
              placeholder={t("auth.signup.passwordPlaceholder")}
              disabled={isLoading}
              className="w-full px-4 py-3 pr-12 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
              style={{
                background: "rgba(30, 41, 59, 0.5)",
                border: errors.password
                  ? "1px solid #f87171"
                  : "1px solid rgba(255, 255, 255, 0.1)",
              }}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-400 text-xs font-medium mb-2 tracking-wider uppercase">
            {t("auth.signup.confirmPassword")}
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            placeholder={t("auth.signup.confirmPlaceholder")}
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
            style={{
              background: "rgba(30, 41, 59, 0.5)",
              border: errors.confirmPassword
                ? "1px solid #f87171"
                : "1px solid rgba(255, 255, 255, 0.1)",
            }}
          />
          {errors.confirmPassword && (
            <p className="text-red-400 text-xs mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-lg font-medium text-black text-sm transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)",
          }}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>{t("auth.signup.processing")}</span>
            </>
          ) : (
            <span>{t("auth.signup.submit")}</span>
          )}
        </button>
      </form>

      <p className="text-center text-gray-400 text-sm mt-6">
        {t("auth.signup.hasAccount")}{" "}
        <Link
          href="/login"
          className="text-white font-medium hover:text-cyan-400 transition-colors underline"
        >
          {t("auth.signup.loginHere")}
        </Link>
      </p>
    </div>
  );
}
