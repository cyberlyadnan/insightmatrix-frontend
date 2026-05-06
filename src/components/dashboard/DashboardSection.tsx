import type { ReactNode } from "react";

interface DashboardSectionProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function DashboardSection({ title, description, actions, children }: DashboardSectionProps) {
  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900">{title}</h2>
          {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}
