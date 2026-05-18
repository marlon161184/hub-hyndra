import { Check, Clock, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApprovalStage } from "@/data/documents";

export function ApprovalTracker({ chain, compact = false }: { chain: ApprovalStage[]; compact?: boolean }) {
  const doneCount = chain.filter((s) => s.status === "done").length;
  const progress = (doneCount / chain.length) * 100;

  return (
    <div className="w-full">
      <div className="relative h-1 w-full overflow-hidden rounded-full bg-border">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-foreground via-graphite to-verde-newe transition-all"
          style={{ width: `${progress + (100 / chain.length) * 0.5}%` }}
        />
      </div>

      <div className={cn("mt-4 grid gap-3", compact ? "grid-cols-4" : "grid-cols-2 md:grid-cols-4")}>
        {chain.map((stage) => (
          <div key={stage.name} className="flex items-start gap-2">
            <div
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                stage.status === "done" && "border-success bg-success text-primary-foreground",
                stage.status === "current" && "border-amber bg-amber-light text-amber animate-pulse",
                stage.status === "pending" && "border-border bg-card text-muted-foreground",
              )}
            >
              {stage.status === "done" ? (
                <Check className="h-3 w-3" />
              ) : stage.status === "current" ? (
                <Clock className="h-3 w-3" />
              ) : (
                <Circle className="h-2 w-2" />
              )}
            </div>
            <div className="min-w-0">
              <div className={cn("text-xs font-medium", stage.status === "pending" ? "text-muted-foreground" : "text-foreground")}>
                {stage.name}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {stage.status === "done" && (stage.date ?? "Concluído")}
                {stage.status === "current" && "Pendente"}
                {stage.status === "pending" && "Aguardando"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
