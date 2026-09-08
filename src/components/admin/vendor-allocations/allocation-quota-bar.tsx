export function AllocationQuotaBar({
  completed,
  allocated,
  label = "Completes",
}: {
  completed: number;
  allocated: number;
  label?: string;
}) {
  const pct = allocated > 0 ? Math.min(100, Math.round((completed / allocated) * 100)) : 0;

  return (
    <div className="space-y-0.5 min-w-[90px]">
      <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-gray-500">
        <span>{label}</span>
        <span>
          {completed} / {allocated}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-brand-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
