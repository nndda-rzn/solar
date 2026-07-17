import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex h-screen w-full gap-6 bg-cosmic-deep p-6">
      <Skeleton variant="rect" width={240} className="rounded-lg" />
      <div className="flex-1 space-y-4">
        <Skeleton variant="rect" height={48} />
        <Skeleton variant="rect" height={200} />
        <Skeleton variant="text" lines={4} />
      </div>
    </div>
  );
}
