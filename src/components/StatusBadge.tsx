import { cn } from "@/lib/utils";
import type { DocStatus } from "@/data/documents";

const styles: Record<DocStatus, string> = {
  "Publicado": "bg-success-light text-success border-success/30",
  "Em Aprovação": "bg-amber-light text-amber border-amber/40",
  "Em Revisão": "bg-blue-light text-blue border-blue/30",
  "Arquivado": "bg-muted text-muted-foreground border-border",
};

const dot: Record<DocStatus, string> = {
  "Publicado": "bg-success",
  "Em Aprovação": "bg-amber",
  "Em Revisão": "bg-blue",
  "Arquivado": "bg-muted-foreground",
};

export function StatusBadge({ status, className }: { status: DocStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-tight",
        styles[status],
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dot[status])} />
      {status}
    </span>
  );
}
