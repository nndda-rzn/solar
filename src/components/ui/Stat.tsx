export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-white/40">{label}</span>
      <span className="font-medium text-white/70">{value}</span>
    </div>
  );
}
