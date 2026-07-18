import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-cosmic-deep">
      <div className="w-full max-w-4xl space-y-6 p-8">
        <Skeleton variant="rect" height={32} width="40%" />
        <Skeleton variant="text" lines={3} />
        <div className="grid grid-cols-3 gap-4 pt-8">
          <Skeleton variant="rect" height={120} />
          <Skeleton variant="rect" height={120} />
          <Skeleton variant="rect" height={120} />
        </div>
      </div>
    </div>
  );
}
