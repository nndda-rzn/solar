"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          background: "#0d1117",
          color: "#e6edf3",
          fontFamily: "system-ui, sans-serif",
          margin: 0,
          padding: "48px 24px",
        }}
      >
        <main style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ color: "#4a9eff", fontSize: 28, marginBottom: 12 }}>
            Something went wrong
          </h1>
          <p style={{ color: "#9aa4af", marginBottom: 24 }}>
            The application failed to start. Please try again.
          </p>
          {error.digest ? (
            <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 24 }}>
              Reference: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => reset()}
            style={{
              border: "1px solid #4a9eff",
              background: "transparent",
              color: "#4a9eff",
              padding: "10px 24px",
              borderRadius: 6,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
