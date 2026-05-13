import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download, FileText, AlertTriangle, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ApprovalTracker } from "@/components/ApprovalTracker";
import { StatusBadge } from "@/components/StatusBadge";
import { getDocByCode, documents } from "@/data/documents";

export const Route = createFileRoute("/documento/$code")({
  component: DocDetail,
  head: ({ params }) => {
    const d = getDocByCode(params.code);
    return {
      meta: [
        { title: d ? `${d.code} — ${d.title} | Hyndra Hub` : "Documento — Hyndra Hub" },
        { name: "description", content: d?.summary ?? "Documento institucional Hyndra." },
      ],
    };
  },
});

function DocDetail() {
  const { code } = Route.useParams();
  const doc = getDocByCode(code);

  if (!doc) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h1 className="font-display text-3xl text-navy">Documento não encontrado</h1>
          <Link to="/documentos" className="mt-4 inline-block text-blue hover:underline">
            Voltar ao repositório
          </Link>
        </div>
      </AppShell>
    );
  }

  const related = (doc.related ?? [])
    .map((c) => documents.find((d) => d.code === c))
    .filter(Boolean);

  return (
    <AppShell>
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <Link to="/documentos" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-navy">
            <ArrowLeft className="h-3.5 w-3.5" /> Repositório
          </Link>

          <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono-caps rounded border border-border bg-background px-2 py-0.5 text-navy">
                  {doc.code}
                </span>
                <span className="font-mono-caps text-muted-foreground">{doc.category}</span>
                <span className="font-mono-caps text-muted-foreground">· {doc.type}</span>
              </div>
              <h1 className="font-display mt-3 text-3xl leading-tight text-navy md:text-4xl">{doc.title}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{doc.summary}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <StatusBadge status={doc.status} />
                <span className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs">{doc.version}</span>
              </div>
            </div>

            <div className="flex shrink-0 gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-sm hover:border-navy/40">
                <Download className="h-3.5 w-3.5" /> PDF
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-md bg-navy px-3 py-2 text-sm text-primary-foreground hover:bg-navy-deep">
                <FileText className="h-3.5 w-3.5" /> DOCX
              </button>
            </div>
          </div>

          {/* Approval banner */}
          <div className="mt-8 rounded-lg border border-amber/40 bg-amber-light/50 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-mono-caps text-amber">Em aprovação</div>
                <div className="font-display mt-0.5 text-base text-foreground">Aguardando deliberação do CEO</div>
              </div>
              <div className="hidden text-right text-xs text-muted-foreground md:block">
                Próxima etapa: Conselho Deliberativo
              </div>
            </div>
            <div className="mt-4">
              <ApprovalTracker chain={doc.approvalChain} />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[220px_1fr_240px]">
        {/* TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <div className="font-mono-caps text-muted-foreground">Sumário</div>
            <nav className="mt-3 flex flex-col gap-1.5 border-l border-border pl-3">
              {doc.sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="text-sm text-muted-foreground transition-colors hover:text-navy">
                  {s.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Body */}
        <article className="min-w-0">
          {doc.sections.map((s) => (
            <section key={s.id} id={s.id} className="mb-10 scroll-mt-20">
              <h2 className="font-display text-2xl text-navy">{s.title}</h2>
              <div className="mt-3 space-y-3 text-[15px] leading-[1.75] text-foreground/90">
                {s.body.split("\n\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {s.highlight && (
                <div className="mt-5 flex gap-3 rounded-md border-l-4 border-blue bg-blue-light/60 p-4">
                  <Sparkles className="h-4 w-4 shrink-0 text-blue" />
                  <p className="text-sm leading-relaxed text-foreground">{s.highlight}</p>
                </div>
              )}
              {s.warning && (
                <div className="mt-5 flex gap-3 rounded-md border-l-4 border-amber bg-amber-light/70 p-4">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber" />
                  <p className="text-sm leading-relaxed text-foreground">{s.warning}</p>
                </div>
              )}
            </section>
          ))}
        </article>

        {/* Metadata sidebar */}
        <aside className="space-y-5">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="font-mono-caps text-muted-foreground">Metadados</div>
            <dl className="mt-3 space-y-3 text-sm">
              <Meta label="Código" value={doc.code} />
              <Meta label="Versão" value={doc.version} />
              <Meta label="Escopo" value={doc.scope} />
              <Meta label="Responsável" value={doc.responsible} />
              <Meta label="Elaboração" value={doc.elaboration} />
              <Meta label="Aprovação" value={doc.approvalAuthority} />
              <Meta label="Atualizado" value={doc.updatedAt} />
              <Meta label="Vigência" value={doc.year.toString()} />
            </dl>
          </div>

          {related.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="font-mono-caps text-muted-foreground">Documentos relacionados</div>
              <ul className="mt-3 space-y-2">
                {related.map((r) => (
                  <li key={r!.code}>
                    <Link
                      to="/documento/$code"
                      params={{ code: r!.code }}
                      className="group block rounded border border-border bg-background p-3 transition-colors hover:border-navy/40"
                    >
                      <div className="font-mono-caps text-muted-foreground">{r!.code}</div>
                      <div className="mt-0.5 text-sm text-foreground group-hover:text-navy">{r!.title}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="font-mono-caps text-muted-foreground">Histórico</div>
            <ol className="relative mt-3 space-y-3 border-l border-border pl-4">
              {doc.approvalChain.map((s) => (
                <li key={s.name} className="relative">
                  <span
                    className={`absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border ${
                      s.status === "done"
                        ? "border-success bg-success"
                        : s.status === "current"
                        ? "border-amber bg-amber"
                        : "border-border bg-card"
                    }`}
                  />
                  <div className="text-sm font-medium text-foreground">{s.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {s.status === "done" ? s.date : s.status === "current" ? "Em análise" : "Pendente"}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono-caps text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-foreground">{value}</dd>
    </div>
  );
}
