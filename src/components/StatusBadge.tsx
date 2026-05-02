import type { StatusSemaforo } from "@/lib/data";
import { cn } from "@/lib/utils";

const map: Record<StatusSemaforo, { label: string; cls: string; dot: string }> = {
  ok: { label: "No prazo", cls: "bg-success/10 text-success border-success/20", dot: "bg-success" },
  atencao: {
    label: "Atenção",
    cls: "bg-warning/15 text-warning-foreground border-warning/30",
    dot: "bg-warning",
  },
  critico: {
    label: "Crítico",
    cls: "bg-critical/10 text-critical border-critical/20",
    dot: "bg-critical",
  },
};

export function StatusBadge({ status, label }: { status: StatusSemaforo; label?: string }) {
  const item = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        item.cls,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", item.dot)} />
      {label ?? item.label}
    </span>
  );
}

export function StatusDot({ status }: { status: StatusSemaforo }) {
  return (
    <span
      className={cn(
        "inline-block h-2.5 w-2.5 rounded-full ring-2 ring-background",
        map[status].dot,
      )}
    />
  );
}
