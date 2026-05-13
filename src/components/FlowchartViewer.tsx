import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";

type Node =
  | { kind: "process"; label: string; lane?: string; tip?: string }
  | { kind: "decision"; label: string; tip?: string }
  | { kind: "loop"; label: string }
  | { kind: "end-neg"; label: string }
  | { kind: "end-pos"; label: string }
  | { kind: "sync"; label: string };

type Phase = { id: string; label: string; nodes: Node[] };

const phases: Phase[] = [
  {
    id: "f1",
    label: "Fase 1 — Abertura e Aprovação da Vaga",
    nodes: [
      { kind: "process", lane: "Gestor", label: "Solicita abertura de vaga" },
      { kind: "process", lane: "P&C", label: "Analisa a demanda" },
      { kind: "decision", label: "Demanda pertinente?", tip: "NÃO → devolução ao gestor (fim) | SIM → segue" },
      { kind: "decision", label: "Tem orçamento aprovado?", tip: "NÃO → solicita CEO" },
      { kind: "decision", label: "CEO aprova?", tip: "NÃO → processo encerrado" },
      { kind: "decision", label: "Cargo tem JD?", tip: "NÃO → gestor preenche JD" },
    ],
  },
  {
    id: "f2",
    label: "Fase 2 — Recrutamento e Seleção",
    nodes: [
      { kind: "process", lane: "P&C", label: "Hunting ativo" },
      { kind: "process", lane: "P&C", label: "Triagem de candidatos" },
      { kind: "decision", label: "Perfil aprovado por P&C?" },
      { kind: "loop", label: "loop → novo candidato ao hunting" },
      { kind: "process", lane: "Gestor", label: "Valida perfil" },
      { kind: "process", lane: "Gestor", label: "Entrevista" },
      { kind: "decision", label: "Aprovado na entrevista?" },
    ],
  },
  {
    id: "f3",
    label: "Fase 3 — Avaliação Aprofundada",
    nodes: [
      { kind: "process", lane: "P&C", label: "Cadastro básico do candidato" },
      { kind: "process", lane: "P&C", label: "Assessment — DISC ou Hogan" },
      { kind: "process", lane: "P&C", label: "Diligências" },
      { kind: "decision", label: "Aprovado nas diligências?" },
      { kind: "end-neg", label: "Processo encerrado" },
      { kind: "process", lane: "P&C", label: "Teste técnico (quando aplicável)" },
      { kind: "decision", label: "Aprovado no teste técnico?" },
    ],
  },
  {
    id: "f4",
    label: "Fase 4 — Offer",
    nodes: [
      { kind: "process", lane: "P&C", label: "Estudo de remuneração — aprovação interna" },
      { kind: "process", lane: "P&C", label: "Apresentação da offer ao candidato" },
      { kind: "decision", label: "Candidato aceita?", tip: "NÃO → P&C avalia pleito" },
    ],
  },
  {
    id: "f5",
    label: "Fase 5 — Pré-Admissão e Preparação",
    nodes: [
      { kind: "process", lane: "T.I", label: "Acessos, e-mail e equipamentos" },
      { kind: "process", lane: "Suprimentos", label: "Carro, equipamentos e benefícios" },
      { kind: "decision", label: "Regime CLT ou PJ?" },
      { kind: "process", lane: "Jurídico", label: "PJ — orienta CNPJ/MEI e contrato" },
      { kind: "process", lane: "Saúde Ocup.", label: "CLT — Exame admissional" },
      { kind: "decision", label: "Apto no exame?" },
      { kind: "end-neg", label: "Não admitido" },
      { kind: "process", lane: "Volpi", label: "Recebe docs + laudo" },
      { kind: "sync", label: "Sync — pré-boarding concluído" },
    ],
  },
  {
    id: "f6",
    label: "Fase 6 — Dia 1 e Onboarding",
    nodes: [
      { kind: "process", lane: "T.I", label: "Entrega de equipamentos + Termo de Ativo" },
      { kind: "process", lane: "T.I", label: "Onboarding de sistemas e acessos" },
      { kind: "process", lane: "P&C", label: "Onboarding institucional — cultura, valores, buddy" },
      { kind: "process", lane: "Gestor", label: "Onboarding funcional — time, rotina, entregas" },
      { kind: "end-pos", label: "Colaborador integrado" },
    ],
  },
];

function NodeCard({ node }: { node: Node }) {
  const lane = "lane" in node ? node.lane : undefined;
  const base = "relative rounded-md border px-3 py-2.5 text-sm transition-all hover:-translate-y-0.5 hover:shadow-md";
  const tip = "tip" in node ? node.tip : undefined;
  const cls = {
    process: "border-navy/30 bg-card text-foreground",
    decision: "rotate-0 border-amber/50 bg-amber-light/60 text-foreground",
    loop: "border-dashed border-border bg-secondary/60 text-muted-foreground italic",
    "end-neg": "border-destructive/40 bg-destructive/10 text-destructive",
    "end-pos": "border-success/40 bg-success-light text-success",
    sync: "border-blue/40 bg-blue-light/70 text-navy",
  }[node.kind];

  return (
    <div className={cn(base, cls)} title={tip}>
      {lane && <div className="font-mono-caps text-[9px] text-blue">{lane}</div>}
      {node.kind === "decision" && <span className="mr-1 text-amber">◆</span>}
      <span>{node.label}</span>
      {tip && <div className="mt-1 text-[10px] text-muted-foreground">{tip}</div>}
    </div>
  );
}

export function FlowchartViewer() {
  const [open, setOpen] = useState<Record<string, boolean>>(
    Object.fromEntries(phases.map((p) => [p.id, true])),
  );

  const toggle = (id: string) => setOpen((o) => ({ ...o, [id]: !o[id] }));
  const expandAll = () => setOpen(Object.fromEntries(phases.map((p) => [p.id, true])));
  const collapseAll = () => setOpen(Object.fromEntries(phases.map((p) => [p.id, false])));

  return (
    <div className="not-prose my-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {phases.map((p, i) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:border-navy/40 hover:text-navy"
            >
              F{i + 1}
            </a>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={expandAll} className="rounded-md border border-border bg-card px-2.5 py-1 text-xs hover:border-navy/40">
            Expandir tudo
          </button>
          <button onClick={collapseAll} className="rounded-md border border-border bg-card px-2.5 py-1 text-xs hover:border-navy/40">
            Colapsar tudo
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {phases.map((p) => (
          <section key={p.id} id={p.id} className="overflow-hidden rounded-lg border border-border bg-card">
            <button
              onClick={() => toggle(p.id)}
              className="flex w-full items-center justify-between border-b-2 border-navy bg-navy/5 px-4 py-3 text-left transition-colors hover:bg-navy/10"
            >
              <div className="font-mono-caps text-navy">{p.label}</div>
              {open[p.id] ? <ChevronDown className="h-4 w-4 text-navy" /> : <ChevronRight className="h-4 w-4 text-navy" />}
            </button>
            {open[p.id] && (
              <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2 lg:grid-cols-3">
                {p.nodes.map((n, i) => (
                  <NodeCard key={i} node={n} />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
