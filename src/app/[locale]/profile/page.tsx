"use client";

import { ProfileForm } from "@/components/profile/ProfileForm";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cosmic-deep px-4 py-12">
      <div className="w-full max-w-lg">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-cosmic-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Explorer
        </Link>
        <h1 className="mb-6 text-2xl font-bold text-white">Profil Saya</h1>
        <ProfileForm />
      </div>
    </div>
  );
}
