import { Link } from "@tanstack/react-router";
import { ArrowUpRight, FileText } from "lucide-react";
import type { Document } from "@/data/documents";
import { StatusBadge } from "./StatusBadge";
import { TypeBadge } from "./TypeBadge";
import hyndraMark from "@/assets/hyndra-mark.png";

export function PolicyCard({ doc }: { doc: Document }) {
  return (
    <Link
      to="/documento/$code"
      params={{ code: doc.code }}
      className="group relative block overflow-hidden rounded-lg border border-border bg-card p-5 transition-all hover:border-foreground/40 hover:shadow-[0_4px_24px_-12px_oklch(0.2_0_0/0.25)]"
    >
      <img
        src={hyndraMark}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-5 -bottom-5 h-24 w-24 object-contain opacity-[0.05] transition-opacity group-hover:opacity-[0.1] dark:invert"
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileText className="h-3.5 w-3.5" />
          <span className="font-mono-caps">{doc.code}</span>
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>

      <h3 className="font-display relative mt-3 text-lg leading-snug text-foreground">{doc.title}</h3>
      <p className="relative mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{doc.summary}</p>

      <div className="relative mt-4 flex flex-wrap items-center gap-2">
        <StatusBadge status={doc.status} />
        <TypeBadge type={doc.type} />
        <span className="text-xs text-muted-foreground">v{doc.version.split(" ")[0]}</span>
      </div>

      <div className="relative mt-4 flex items-center justify-between gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="truncate">{doc.responsible}</span>
        <span className="shrink-0">{doc.updatedAt}</span>
      </div>
    </Link>
  );
}
