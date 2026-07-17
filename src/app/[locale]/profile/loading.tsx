import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-start justify-center bg-cosmic-deep p-6">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton variant="circle" width={80} height={80} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" />
            <Skeleton variant="text" width="60%" />
          </div>
        </div>
        <Skeleton variant="rect" height={200} />
      </div>
    </div>
  );
}
