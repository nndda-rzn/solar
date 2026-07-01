import { StarBackground } from "./StarBackground";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "#0a0a0f" }}
    >
      <StarBackground />

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        <div className="flex-1 flex flex-col justify-center px-8 py-12 lg:px-16 lg:py-0">
          <div className="max-w-md">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mb-6">
              <div
                className="w-6 h-6 rounded-full bg-cyan-300"
                style={{ boxShadow: "0 0 15px rgba(0, 255, 255, 0.5)" }}
              />
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              <span className="text-white">Jelajahi Tata Surya</span>
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #00ffff 0%, #8b5cf6 100%)",
                }}
              >
                Secara Interaktif
              </span>
            </h1>

            <p className="text-gray-400 text-base mb-8">
              Masuk untuk melanjutkan eksplorasi planet, orbit, misi luar
              angkasa, dan kuis kosmik.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-gray-300 text-sm">Planet Interaktif</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400" />
                <span className="text-gray-300 text-sm">Kuis Edukatif</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-gray-300 text-sm">
                  Timeline Eksplorasi
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-12 lg:px-16">
          {children}
        </div>
      </div>

      <footer className="relative z-10 px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-gray-500 text-xs">
          &copy; 2024 Cosmic Explorer. Jelajahi Alam Semesta.
        </p>
        <div className="flex gap-6">
          <a
            href="#"
            className="text-gray-500 hover:text-cyan-400 text-xs transition-colors"
          >
            Tentang Kami
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-cyan-400 text-xs transition-colors"
          >
            Bantuan
          </a>
        </div>
      </footer>
    </div>
  );
}
