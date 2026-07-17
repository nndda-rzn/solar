import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex h-screen w-full flex-col bg-cosmic-deep p-6">
      <Skeleton variant="rect" height={40} width="50%" />
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} variant="rect" height={160} />
        ))}
      </div>
    </div>
  );
}
