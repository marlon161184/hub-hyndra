import { useState } from "react";
import { cn } from "@/lib/utils";
import { Maximize2, Minimize2 } from "lucide-react";

type Slide = { n: number; title: string; subtitle?: string; body: string; tone?: "cover" | "phase" | "content" | "close" };

const slides: Slide[] = [
  { n: 1, title: "Newe Urbanismo · Hyndra Participações", subtitle: "Processo de Admissão", body: "SOP v1.0 · 2026", tone: "cover" },
  { n: 2, title: "Índice", body: "Visão geral · Partes interessadas · Fases 1 a 6 · Formulários · Prazos", tone: "content" },
  { n: 3, title: "Visão Geral", body: "6 fases em sequência linear: Abertura → Seleção → Avaliação → Offer → Pré-admissão → Onboarding.", tone: "content" },
  { n: 4, title: "Partes Interessadas", body: "8 stakeholders: Gestor, P&C, CEO, T.I, Suprimentos, Jurídico, Saúde Ocupacional e Volpi.", tone: "content" },
  { n: 5, title: "Fase 1", subtitle: "Abertura e Aprovação da Vaga", body: "", tone: "phase" },
  { n: 6, title: "Fase 1 — Etapas 1.1 a 1.4", body: "Solicitação · Análise P&C · Verificação de orçamento · Verificação de JD · Decisão CEO.", tone: "content" },
  { n: 7, title: "Fase 2", subtitle: "Recrutamento e Seleção", body: "", tone: "phase" },
  { n: 8, title: "Fase 2 — Etapas 2.1 a 2.4", body: "Hunting · Triagem · Validação de perfil · Entrevista do gestor. Loops retornam ao hunting.", tone: "content" },
  { n: 9, title: "Fase 3", subtitle: "Avaliação Aprofundada", body: "", tone: "phase" },
  { n: 10, title: "Fase 3 — Etapas 3.1 a 3.4", body: "Cadastro · Assessment (DISC vs Hogan) · Diligências · Teste técnico. Pontos de encerramento.", tone: "content" },
  { n: 11, title: "Fase 4", subtitle: "Offer", body: "", tone: "phase" },
  { n: 12, title: "Fase 4 — Cards 4.1 a 4.3", body: "Estudo de remuneração (3-5d) · Apresentação da offer (3d) · Negociação (2d).", tone: "content" },
  { n: 13, title: "Fase 5", subtitle: "Pré-Admissão e Preparação", body: "", tone: "phase" },
  { n: 14, title: "Fase 5 — Acionamento paralelo", body: "T.I + Suprimentos + (Jurídico/PJ ou Saúde Ocupacional/CLT) + Volpi.", tone: "content" },
  { n: 15, title: "Fase 6", subtitle: "Dia 1 e Onboarding", body: "", tone: "phase" },
  { n: 16, title: "Fase 6 — Cards 6.1 a 6.4", body: "Termo de Ativo · Onboarding sistemas · Onboarding institucional · Onboarding funcional.", tone: "content" },
  { n: 17, title: "Formulários Vinculados", body: "Job Requisition (F1) · Job Description (F1) · Cadastro Básico (F3) · Checklist CLT (F5).", tone: "content" },
  { n: 18, title: "Prazos por Nível", body: "Operacional 20-35d · Tático 25-45d · Estratégico 35-60d.", tone: "content" },
  { n: 19, title: "Encerramento", subtitle: "Marlon Silva — Pessoas & Cultura", body: "Uso interno · Revisão anual.", tone: "close" },
];

export function SlideViewer() {
  const [current, setCurrent] = useState(0);
  const [present, setPresent] = useState(false);

  if (present) {
    const s = slides[current];
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-deep p-8">
        <button
          onClick={() => setPresent(false)}
          className="absolute right-6 top-6 rounded-md border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20"
        >
          <Minimize2 className="h-4 w-4" />
        </button>
        <div className="aspect-video w-full max-w-5xl rounded-xl bg-gradient-to-br from-navy to-blue p-12 text-white shadow-2xl">
          <div className="font-mono-caps text-white/60">Slide {s.n} / 19</div>
          <h2 className="font-display mt-6 text-5xl leading-tight">{s.title}</h2>
          {s.subtitle && <div className="font-display mt-2 text-2xl text-white/80">{s.subtitle}</div>}
          <p className="mt-8 text-lg text-white/90">{s.body}</p>
        </div>
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            className="rounded-md bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
          >
            Anterior
          </button>
          <button
            onClick={() => setCurrent((c) => Math.min(slides.length - 1, c + 1))}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-navy hover:bg-white/90"
          >
            Próximo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="not-prose my-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="font-mono-caps text-muted-foreground">19 slides · DECK-ADM-001</div>
        <button
          onClick={() => setPresent(true)}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:border-navy/40"
        >
          <Maximize2 className="h-3.5 w-3.5" /> Modo apresentação
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {slides.map((s, i) => (
          <button
            key={s.n}
            onClick={() => {
              setCurrent(i);
              setPresent(true);
            }}
            className={cn(
              "group flex aspect-[4/3] flex-col items-start rounded-lg border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md",
              s.tone === "cover" && "border-navy/40 bg-gradient-to-br from-navy to-blue text-white",
              s.tone === "phase" && "border-blue/40 bg-blue-light/60 text-navy",
              s.tone === "content" && "border-border bg-card",
              s.tone === "close" && "border-amber/40 bg-amber-light/60",
            )}
          >
            <div className={cn("font-mono-caps", s.tone === "cover" ? "text-white/70" : "text-muted-foreground")}>
              Slide {s.n}
            </div>
            <div className="font-display mt-2 line-clamp-2 text-base leading-tight">{s.title}</div>
            {s.subtitle && (
              <div className="font-display mt-0.5 line-clamp-1 text-xs opacity-80">{s.subtitle}</div>
            )}
            <p className={cn("mt-auto line-clamp-3 text-xs", s.tone === "cover" ? "text-white/80" : "text-muted-foreground")}>
              {s.body}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
