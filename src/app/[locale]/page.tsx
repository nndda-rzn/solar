"use client";

import dynamic from "next/dynamic";
import { CosmicLoader } from "@/components/ui/CosmicLoader";

const CosmicExplorer = dynamic(
  () =>
    import("@/components/cosmic-explorer/CosmicExplorer").then(
      (m) => m.CosmicExplorer,
    ),
  {
    ssr: false,
    loading: () => <CosmicLoader />,
  },
);

export default function Home() {
  return <CosmicExplorer />;
}
