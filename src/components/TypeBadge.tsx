import { cn } from "@/lib/utils";
import type { DocType } from "@/data/documents";

const styles: Record<DocType, string> = {
  "Política": "bg-navy/10 text-navy border-navy/30",
  "SOP": "bg-teal-50 text-teal-700 border-teal-300",
  "Apresentação": "bg-purple-50 text-purple-700 border-purple-300",
  "Fluxograma": "bg-indigo-50 text-indigo-700 border-indigo-300",
  "Formulário": "bg-slate-100 text-slate-700 border-slate-300",
  "Documento": "bg-zinc-100 text-zinc-700 border-zinc-300",
  "Procedimento": "bg-teal-50 text-teal-700 border-teal-300",
};

export function TypeBadge({ type, className }: { type: DocType; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-tight",
        styles[type] ?? styles["Documento"],
        className,
      )}
    >
      {type}
    </span>
  );
}
