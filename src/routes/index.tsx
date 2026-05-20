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
      <section className="relative border-b border-border bg-card">
        <div className="hub-grid-bg absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-6 py-12 md:py-16">
          <div className="font-mono-caps text-blue">Hyndra Participações · 2026</div>
          <h1 className="font-display mt-3 text-4xl leading-tight text-navy md:text-5xl">
            Repositório Institucional<br />
            <span className="text-foreground/70">de Políticas & Procedimentos</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Fonte única e autoritativa de governança documental para a Hyndra e suas empresas participadas.
            Consulte, acompanhe aprovações e mantenha-se alinhado à cultura institucional.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/documentos"
              className="inline-flex items-center gap-2 rounded-md bg-navy px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-navy-deep"
            >
              Explorar documentos <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/em-aprovacao"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-navy/40"
            >
              Fila de aprovação · {aprovacao}
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-10 px-6 py-10">
        {/* Stats */}
        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Stat label="Documentos" value={total} hint="Total catalogado" icon={FileText} />
          <Stat label="Publicados" value={publicados} hint="Vigentes" icon={CheckCircle2} tone="success" />
          <Stat label="Em Aprovação" value={aprovacao} hint="Aguardando CEO" icon={GitPullRequestArrow} tone="amber" />
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
