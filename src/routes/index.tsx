import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, GitPullRequestArrow, CheckCircle2, RefreshCw, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PolicyCard } from "@/components/PolicyCard";
import { documents, categories } from "@/data/documents";
import hyndraMark from "@/assets/hyndra-mark.png";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Dashboard — Hyndra Hub" },
      { name: "description", content: "Visão institucional consolidada do repositório de políticas e procedimentos da Hyndra Participações." },
    ],
  }),
});

function Stat({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: number | string;
  hint: string;
  icon: React.ElementType;
  tone?: "default" | "amber" | "blue" | "success";
}) {
  const toneCls = {
    default: "text-navy",
    amber: "text-amber",
    blue: "text-blue",
    success: "text-success",
  }[tone];
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono-caps text-muted-foreground">{label}</div>
          <div className={`font-display mt-2 text-4xl font-semibold ${toneCls}`}>{value}</div>
          <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
        </div>
        <div className={`rounded-md border border-border bg-background p-2 ${toneCls}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const total = documents.length;
  const aprovacao = documents.filter((d) => d.status === "Em Aprovação").length;
  const publicados = documents.filter((d) => d.status === "Publicado").length;
  const ativas = categories.filter((c) => c.active).length;

  const recent = [...documents].sort((a, b) => (a.status === "Publicado" ? -1 : 1)).slice(0, 6);

  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-card via-background to-secondary/40">
        <div className="hub-grid-bg absolute inset-0" aria-hidden />
        {/* Mark watermark */}
        <img
          src={hyndraMark}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-10 hidden h-[460px] w-auto select-none opacity-[0.045] md:block dark:invert"
        />
        {/* Verde Newe régua vertical */}
        <span aria-hidden className="absolute left-0 top-1/2 hidden h-40 w-[2px] -translate-y-1/2 bg-verde-newe md:block" />

        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-8">
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-px w-10 bg-foreground/40" />
              <span className="font-mono-caps text-muted-foreground">Hyndra Participações · 2026</span>
            </div>

            <h1 className="font-display mt-6 text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95] tracking-[-0.04em] text-foreground">
              HUB <span className="italic font-light text-foreground/55">Hyndra</span>
            </h1>

            <div className="mt-5 flex items-start gap-3">
              <span aria-hidden className="mt-2 h-6 w-[3px] shrink-0 bg-verde-newe" />
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Plataforma institucional de políticas, procedimentos e governança documental
                do Grupo Hyndra e suas empresas participadas — uma fonte única, viva e auditável.
              </p>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/documentos"
                className="group inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all hover:bg-graphite"
              >
                Explorar documentos
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/em-aprovacao"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card/60 px-5 py-2.5 text-sm font-medium text-foreground backdrop-blur transition-colors hover:border-foreground/40"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber" />
                Fila de aprovação · {aprovacao}
              </Link>
            </div>
          </div>

          {/* Meta side panel */}
          <aside className="md:col-span-4 md:border-l md:border-border md:pl-8">
            <div className="font-mono-caps text-muted-foreground">Edição</div>
            <div className="font-display mt-2 text-3xl text-foreground">v.2026.1</div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Última publicação institucional · Mai/2026
            </p>

            <dl className="mt-8 space-y-4 border-t border-border pt-6">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="font-mono-caps text-muted-foreground">Vigentes</dt>
                <dd className="font-display text-2xl text-foreground">{publicados}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="font-mono-caps text-muted-foreground">Em curso</dt>
                <dd className="font-display text-2xl text-foreground">{aprovacao}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="font-mono-caps text-muted-foreground">Domínios</dt>
                <dd className="font-display text-2xl text-foreground">{ativas}</dd>
              </div>
            </dl>
          </aside>
        </div>

        {/* Bottom marquee strip */}
        <div className="relative border-t border-border bg-card/60 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3">
            <span className="font-mono-caps text-muted-foreground">Hyndra Participações</span>
            <span aria-hidden className="hidden h-3 w-px bg-border md:block" />
            <span className="font-mono-caps text-muted-foreground">Newe Urbanismo Integrativo</span>
            <span aria-hidden className="hidden h-3 w-px bg-border md:block" />
            <span className="font-mono-caps text-muted-foreground">Governança · Cultura · Conformidade</span>
            <span aria-hidden className="hidden h-3 w-px bg-border md:block" />
            <span className="font-mono-caps text-verde-newe">● Publicação ativa</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-10 px-6 py-10">
        {/* Stats */}
        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Stat label="Documentos" value={total} hint="Total catalogado" icon={FileText} />
          <Stat label="Publicados" value={publicados} hint="Vigentes" icon={CheckCircle2} tone="success" />
          <Stat label="Em Aprovação" value={aprovacao} hint="Aguardando HEAD JURÍDICO E COMPLIANCE" icon={GitPullRequestArrow} tone="amber" />
          <Stat label="Categorias ativas" value={ativas} hint="P&C · Financeiro" icon={RefreshCw} tone="blue" />
        </section>

        {/* Recent */}
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <div className="font-mono-caps text-muted-foreground">Atividade recente</div>
              <h2 className="font-display mt-1 text-2xl text-navy">Atualizações institucionais</h2>
            </div>
            <Link to="/documentos" className="text-sm text-blue hover:underline">
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recent.map((d) => (
              <PolicyCard key={d.code} doc={d} />
            ))}
          </div>
        </section>

        {/* Categories */}
        <section>
          <div className="mb-4">
            <div className="font-mono-caps text-muted-foreground">Categorias</div>
            <h2 className="font-display mt-1 text-2xl text-navy">Domínios de governança</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => {
              const count = documents.filter((d) => d.category === c.name).length;
              const slug = slugifyCat(c.name);
              return (
                <Link
                  key={c.name}
                  to="/categoria/$slug"
                  params={{ slug }}
                  className="group flex flex-col rounded-lg border border-border bg-card p-5 transition-all hover:border-navy/40"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg text-foreground">{c.name}</h3>
                    <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                      {count}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
                  <div className="mt-4 border-t border-border pt-3 font-mono-caps text-muted-foreground">
                    {c.executive}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export function slugifyCat(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
