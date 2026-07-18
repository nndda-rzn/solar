"use client";

import { useTranslations } from "next-intl";

import { StarBackground } from "./StarBackground";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const t = useTranslations("common");
  return (
    <div
      style={{
        height: "100vh",
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
          height: "100%",
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
              <span style={{ color: "#ffffff" }}>
                {t("auth.layout.titleLine1")}
              </span>
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
                {t("auth.layout.titleLine2")}
              </span>
            </h1>

            <p
              style={{
                color: "#94a3b8",
                fontSize: "16px",
                marginBottom: "32px",
              }}
            >
              {t("auth.layout.subtitle")}
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
                  {t("auth.layout.feature1")}
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
                  {t("auth.layout.feature2")}
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
                  {t("auth.layout.feature3")}
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
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: "16px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          pointerEvents: "auto",
        }}
      >
        <p style={{ color: "#6b7280", fontSize: "12px" }}>
          {t("auth.layout.footer")}
        </p>
        <div style={{ display: "flex", gap: "24px" }}>
          <span
            style={{
              color: "#6b7280",
              fontSize: "12px",
              textDecoration: "none",
              cursor: "not-allowed",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#22d3ee")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
          >
            {t("auth.layout.aboutUs")}
          </span>
          <span
            style={{
              color: "#6b7280",
              fontSize: "12px",
              textDecoration: "none",
              cursor: "not-allowed",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#22d3ee")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
          >
            {t("auth.layout.help")}
          </span>
        </div>
      </footer>
    </div>
  );
}
