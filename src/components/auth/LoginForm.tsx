"use client";

import { useLoginForm } from "@/hooks/useLoginForm";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface LoginFormProps {
  onSubmit: (values: {
    username: string;
    password: string;
    rememberMe: boolean;
  }) => Promise<void>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const {
    values,
    errors,
    isLoading,
    showPassword,
    handleChange,
    handleSubmit,
    togglePasswordVisibility,
  } = useLoginForm();

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
          Explorer Access
        </span>
      </div>

      <h2 className="text-2xl font-bold text-white mb-1">
        Masuk ke Cosmic Explorer
      </h2>
      <p className="text-gray-400 text-sm mb-6">
        Lanjutkan petualanganmu di tata surya.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSubmit);
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-gray-400 text-xs font-medium mb-2 tracking-wider uppercase">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={values.username}
            onChange={handleChange}
            placeholder="Masukkan username"
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
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={values.password}
              onChange={handleChange}
              placeholder="Masukkan password"
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

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="rememberMe"
              checked={values.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-600 text-cyan-400 focus:ring-cyan-400"
            />
            <span className="text-gray-400 text-sm">Ingat saya</span>
          </label>
          <a
            href="#"
            className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors"
          >
            Lupa password?
          </a>
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
              <span>Memproses...</span>
            </>
          ) : (
            <span>Masuk Sekarang</span>
          )}
        </button>
      </form>

      <p className="text-center text-gray-400 text-sm mt-6">
        Belum punya akun?{" "}
        <a
          href="#"
          className="text-white font-medium hover:text-cyan-400 transition-colors underline"
        >
          Daftar di sini
        </a>
      </p>
    </div>
  );
}
