import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ApprovalTracker } from "@/components/ApprovalTracker";
import { StatusBadge } from "@/components/StatusBadge";
import { documents } from "@/data/documents";
import {
  loadSubmissions,
  getWorkflowPct,
  getCurrentApprover,
  type Submission,
} from "@/data/submissions";
import { ArrowUpRight, Clock, User } from "lucide-react";

export const Route = createFileRoute("/em-aprovacao")({
  component: ApprovalQueue,
  head: () => ({
    meta: [
      { title: "Em Aprovação — Hyndra Hub" },
      { name: "description", content: "Fila institucional de documentos aguardando aprovação na Hyndra." },
    ],
  }),
});

function ApprovalQueue() {
  const queue = documents.filter((d) => d.status === "Em Aprovação");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  useEffect(() => {
    setSubmissions(loadSubmissions().filter((s) => s.status === "em-andamento"));
  }, []);


  return (
    <AppShell>
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="font-mono-caps text-amber">Workflow institucional</div>
          <h1 className="font-display mt-2 text-4xl text-navy">Fila de Aprovação</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            {queue.length} documentos atualmente em fluxo de aprovação. Estágio atual: <strong className="text-foreground">HEAD JURÍDICO E COMPLIANCE — Pendente</strong>.
            Próximo passo: deliberação do Conselho.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="hidden grid-cols-12 gap-4 border-b border-border bg-secondary/50 px-5 py-3 font-mono-caps text-muted-foreground md:grid">
            <div className="col-span-5">Documento</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Aprovação</div>
            <div className="col-span-2 text-right">Estágio Atual</div>
          </div>

          <ul>
            {queue.map((d) => {
              const done = d.approvalChain.filter((s) => s.status === "done").length;
              const pct = Math.round((done / d.approvalChain.length) * 100);
              return (
                <li key={d.code} className="border-b border-border last:border-b-0">
                  <Link
                    to="/documento/$code"
                    params={{ code: d.code }}
                    className="group grid grid-cols-1 gap-4 px-5 py-4 transition-colors hover:bg-secondary/40 md:grid-cols-12 md:items-center"
                  >
                    <div className="col-span-5">
                      <div className="font-mono-caps text-muted-foreground">{d.code}</div>
                      <div className="mt-0.5 flex items-start gap-2">
                        <span className="font-display text-base text-foreground">{d.title}</span>
                        <ArrowUpRight className="mt-1 h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-navy" />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <StatusBadge status={d.status} />
                    </div>
                    <div className="col-span-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                          <div className="h-full bg-gradient-to-r from-navy to-blue" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="font-mono-caps w-8 text-right text-muted-foreground">{pct}%</span>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center gap-1.5 text-xs text-amber md:justify-end">
                      <Clock className="h-3.5 w-3.5" />
                      HEAD JURÍDICO E COMPLIANCE — Pendente
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {submissions.length > 0 && (
          <div className="mt-10">
            <div className="mb-4">
              <div className="font-mono-caps text-verde-newe" style={{ fontSize: 9 }}>
                Submetidos via upload
              </div>
              <h2 className="font-display mt-1 text-xl text-navy">Em workflow de aprovação</h2>
            </div>
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <ul>
                {submissions.map((s) => {
                  const approver = getCurrentApprover(s);
                  const pct = getWorkflowPct(s);
                  return (
                    <li
                      key={s.id}
                      className="border-b border-border px-5 py-4 last:border-b-0"
                    >
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-center">
                        <div className="md:col-span-6">
                          <div className="font-mono-caps text-muted-foreground" style={{ fontSize: 9 }}>
                            {s.code} · {s.area}
                          </div>
                          <div className="mt-0.5 font-display text-base text-foreground">{s.title}</div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span className="rounded bg-secondary px-2 py-0.5">{s.type}</span>
                            <span>por {s.responsible}</span>
                            <span>·</span>
                            <span>{new Date(s.submittedAt).toLocaleDateString("pt-BR")}</span>
                          </div>
                        </div>
                        <div className="md:col-span-6">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                              <div
                                className="h-full bg-gradient-to-r from-verde-newe to-blue"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="font-mono-caps w-8 text-right text-muted-foreground">
                              {pct}%
                            </span>
                          </div>
                          {approver && (
                            <div className="mt-2 flex items-center gap-1.5 text-xs text-amber">
                              <User className="h-3.5 w-3.5" />
                              Aguardando {approver.name} — {approver.role}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}


        <div className="mt-8 rounded-lg border border-border bg-card p-6">
          <div className="font-mono-caps text-muted-foreground">Estrutura padrão de aprovação</div>
          <h2 className="font-display mt-1 text-xl text-navy">Pipeline institucional</h2>
          <div className="mt-5">
            <ApprovalTracker chain={queue[0]?.approvalChain ?? []} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
