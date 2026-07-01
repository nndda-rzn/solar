"use client";

import { StarBackground } from "./StarBackground";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "#0a0a0f",
      }}
    >
      <StarBackground />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
        className="lg:!flex-row"
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "48px 32px",
          }}
          className="lg:!flex-1 lg:!justify-center lg:!px-16 lg:!py-0"
        >
          <div style={{ maxWidth: "400px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #00ffff 0%, #3b82f6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "#67e8f9",
                  boxShadow: "0 0 15px rgba(0, 255, 255, 0.5)",
                }}
              />
            </div>

            <h1
              style={{
                fontSize: "40px",
                fontWeight: "bold",
                marginBottom: "16px",
                lineHeight: 1.2,
              }}
            >
              <span style={{ color: "#ffffff" }}>Jelajahi Tata Surya</span>
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #00ffff 0%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Secara Interaktif
              </span>
            </h1>

            <p
              style={{
                color: "#94a3b8",
                fontSize: "16px",
                marginBottom: "32px",
              }}
            >
              Masuk untuk melanjutkan eksplorasi planet, orbit, misi luar
              angkasa, dan kuis kosmik.
            </p>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#22d3ee",
                  }}
                />
                <span style={{ color: "#d1d5db", fontSize: "14px" }}>
                  Planet Interaktif
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#a855f7",
                  }}
                />
                <span style={{ color: "#d1d5db", fontSize: "14px" }}>
                  Kuis Edukatif
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#60a5fa",
                  }}
                />
                <span style={{ color: "#d1d5db", fontSize: "14px" }}>
                  Timeline Eksplorasi
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 32px",
          }}
          className="lg:!flex-1 lg:!items-center lg:!justify-center lg:!px-16"
        >
          {children}
        </div>
      </div>

      <footer
        style={{
          position: "relative",
          zIndex: 10,
          padding: "24px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <p style={{ color: "#6b7280", fontSize: "12px" }}>
          &copy; 2024 Cosmic Explorer. Jelajahi Alam Semesta.
        </p>
        <div style={{ display: "flex", gap: "24px" }}>
          <a
            href="#"
            style={{
              color: "#6b7280",
              fontSize: "12px",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#22d3ee")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
          >
            Tentang Kami
          </a>
          <a
            href="#"
            style={{
              color: "#6b7280",
              fontSize: "12px",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#22d3ee")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
          >
            Bantuan
          </a>
        </div>
      </footer>
    </div>
  );
}
