import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Users, Wallet, TrendingUp, Building2, Landmark, Scale, ShieldCheck,
  CheckCircle2, Clock, Plus, ChevronDown, ChevronUp, ExternalLink,
  LayoutList,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  backlogAreas,
  getAreaProgress,
  getGlobalProgress,
  type BacklogArea,
  type BacklogItem,
  type BacklogPriority,
  type BacklogDocType,
} from "@/data/backlog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/backlog")({
  component: BacklogPage,
  head: () => ({
    meta: [
      { title: "Backlog de Governança — Hyndra Hub" },
      {
        name: "description",
        content:
          "Painel de progresso da construção do alicerce documental da Hyndra Participações.",
      },
    ],
  }),
});

const iconMap: Record<string, typeof Users> = {
  Users,
  Wallet,
  TrendingUp,
  Building2,
  Landmark,
  Scale,
  ShieldCheck,
};

const priorityLabel: Record<BacklogPriority, string> = {
  "crítico": "Crítico",
  "importante": "Importante",
  "estruturante": "Estruturante",
};

const priorityColor: Record<BacklogPriority, string> = {
  "crítico": "text-red-600 bg-red-50 border-red-200",
  "importante": "text-amber-600 bg-amber-50 border-amber-200",
  "estruturante": "text-blue-600 bg-blue-50 border-blue-200",
};

const typeColor: Record<BacklogDocType, string> = {
  "Política": "text-navy bg-navy/8 border-navy/20",
  "Procedimento": "text-blue bg-blue/8 border-blue/20",
  "Fluxograma": "text-verde-newe bg-verde-newe/8 border-verde-newe/20",
};

function StatusIcon({ status }: { status: BacklogItem["status"] }) {
  if (status === "publicado")
    return <CheckCircle2 className="h-4 w-4 shrink-0 text-verde-newe" />;
  if (status === "em-aprovacao")
    return <Clock className="h-4 w-4 shrink-0 text-amber" />;
  return <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />;
}

function ProgressBar({ pct, className }: { pct: number; className?: string }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-secondary", className)}>
      <div
        className="h-full rounded-full bg-verde-newe transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function AreaCard({ area }: { area: BacklogArea }) {
  const [open, setOpen] = useState(false);
  const progress = getAreaProgress(area);
  const Icon = iconMap[area.icon] ?? LayoutList;

  const byType: Record<BacklogDocType, BacklogItem[]> = {
    "Política": area.items.filter((i) => i.type === "Política"),
    "Procedimento": area.items.filter((i) => i.type === "Procedimento"),
    "Fluxograma": area.items.filter((i) => i.type === "Fluxograma"),
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-secondary/40"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy text-primary-foreground">
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <span className="font-display text-base font-medium tracking-tight">{area.name}</span>
            <span className="text-xs text-muted-foreground">{area.executive}</span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <ProgressBar pct={progress.pct} className="max-w-[220px]" />
            <span className="font-mono-caps text-[11px] text-muted-foreground">
              {progress.done}/{progress.total}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <div className="hidden items-center gap-3 text-xs sm:flex">
            <span className="flex items-center gap-1 text-verde-newe">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {progress.done}
            </span>
            <span className="flex items-center gap-1 text-amber">
              <Clock className="h-3.5 w-3.5" />
              {progress.inProgress}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Plus className="h-3.5 w-3.5" />
              {progress.total - progress.done - progress.inProgress}
            </span>
          </div>
          {open ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="space-y-6 border-t border-border p-5">
          {(["Política", "Procedimento", "Fluxograma"] as const).map((type) => {
            const items = byType[type];
            if (items.length === 0) return null;
            return (
              <div key={type}>
                <h3 className="mb-3 font-mono-caps text-[11px] text-muted-foreground">
                  {type}s — {items.length}
                </h3>
                <div className="space-y-1.5">
                  {items.map((item) => (
                    <div
                      key={item.code}
                      className="flex items-start gap-3 rounded-lg border border-border bg-background p-3"
                    >
                      <div className="pt-0.5">
                        <StatusIcon status={item.status} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              "text-sm",
                              item.status === "publicado"
                                ? "text-verde-newe line-through"
                                : "text-foreground",
                            )}
                          >
                            {item.title}
                          </span>
                          {item.hubDocCode && (
                            <Link
                              to="/documento/$code"
                              params={{ code: item.hubDocCode }}
                              className="inline-flex items-center gap-1 text-xs font-medium text-blue hover:underline"
                            >
                              {item.hubDocCode}
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          )}
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <span className="font-mono-caps text-[10px] text-muted-foreground">
                            {item.code}
                          </span>
                          <span
                            className={cn(
                              "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                              priorityColor[item.priority],
                            )}
                          >
                            {priorityLabel[item.priority]}
                          </span>
                          <span
                            className={cn(
                              "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                              typeColor[item.type],
                            )}
                          >
                            {item.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BacklogPage() {
  const global = getGlobalProgress();

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 md:px-8">
        {/* Header */}
        <div>
          <p className="font-mono-caps text-[11px] text-muted-foreground">
            Governança · KR3 — Políticas e Processos
          </p>
          <h1 className="mt-2 font-display text-3xl font-light tracking-tight md:text-4xl">
            Backlog de Governança
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Os {global.total} documentos que constroem o alicerce institucional da Hyndra e da
            Newe — políticas, procedimentos e fluxogramas essenciais para o bom funcionamento do
            grupo.
          </p>
        </div>

        {/* Global progress card */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono-caps text-[11px] text-muted-foreground">
                Progresso global · Meta Q4/2026
              </p>
              <p className="mt-1 font-display text-5xl font-light tracking-tight">{global.pct}%</p>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl font-light">
                {global.done}/{global.total}
              </p>
              <p className="text-xs text-muted-foreground">documentos publicados</p>
            </div>
          </div>
          <ProgressBar pct={global.pct} className="mt-4 h-3" />
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-verde-newe">
              <CheckCircle2 className="h-4 w-4" />
              {global.done} publicados
            </span>
            <span className="flex items-center gap-1.5 text-amber">
              <Clock className="h-4 w-4" />
              {global.inProgress} em aprovação
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Plus className="h-4 w-4" />
              {global.toCreate} a criar
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="font-mono-caps text-[11px]">Legenda</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-verde-newe" /> Publicado no Hub
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-amber" /> Em aprovação
          </span>
          <span className="flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5 text-muted-foreground" /> A criar
          </span>
        </div>

        {/* Area cards */}
        <div className="space-y-4">
          {backlogAreas.map((area) => (
            <AreaCard key={area.id} area={area} />
          ))}
        </div>

        {/* Footer note */}
        <p className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
          Hyndra Participações · Meta: {global.total} documentos publicados até Q4/2026 · OKR
          Políticas e Processos — KR3
        </p>
      </div>
    </AppShell>
  );
}
