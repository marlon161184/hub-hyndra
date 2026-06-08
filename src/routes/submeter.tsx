import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  buildWorkflow,
  generateCode,
  addSubmission,
  type SubmissionDocType,
} from "@/data/submissions";
import { sendGmailNotification, buildNotificationEmail } from "@/lib/gmail-notify";
import { convertDocument, extractText, type ConversionResult } from "@/lib/claude-converter";
import type { DocBlock } from "@/data/documents";

export const Route = createFileRoute("/submeter")({
  component: SubmeterPage,
  head: () => ({ meta: [{ title: "Submeter Documento — Hyndra Hub" }] }),
});

const AREAS = [
  "Pessoas & Cultura",
  "Financeiro / Controladoria",
  "Comercial e Marketing",
  "Produto",
  "Projetos e Aprovação",
  "Jurídico / Compliance",
  "TI / Dados",
];
const DOC_TYPES: SubmissionDocType[] = ["Política", "Procedimento", "Fluxograma"];

function workflowSteps(type: SubmissionDocType | "") {
  if (!type) return null;
  return type === "Política"
    ? [
        "Head de Área (você)",
        "Giovanni Sampaio — Governança",
        "Gustavo Garcia — DPO",
        "Dilson Athia — CEO",
      ]
    : [
        "Head de Área (você — aprovação implícita)",
        "Giovanni Sampaio — Governança",
        "Gustavo Garcia — DPO",
      ];
}

function PreviewBlock({ block }: { block: DocBlock }) {
  if (block.kind === "p")
    return <p className="text-sm leading-relaxed text-foreground/90">{block.text}</p>;
  if (block.kind === "subheading")
    return <h4 className="font-display text-base font-semibold text-navy">{block.text}</h4>;
  if (block.kind === "list")
    return block.ordered ? (
      <ol className="list-decimal space-y-1 pl-5 text-sm text-foreground/90">
        {block.items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ol>
    ) : (
      <ul className="list-disc space-y-1 pl-5 text-sm text-foreground/90">
        {block.items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    );
  if (block.kind === "table")
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              {block.headers.map((h, i) => (
                <th key={i} className="px-3 py-2 text-left font-medium text-foreground">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, i) => (
              <tr key={i} className="border-b border-border last:border-b-0">
                {row.map((c, j) => (
                  <td key={j} className="px-3 py-2 align-top text-foreground/90">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {block.caption && (
          <p className="mt-1 text-xs text-muted-foreground">{block.caption}</p>
        )}
      </div>
    );
  if (block.kind === "info")
    return (
      <div className="rounded-md border-l-2 border-blue bg-blue/5 px-4 py-3 text-sm text-foreground/90">
        {block.text}
      </div>
    );
  if (block.kind === "warning")
    return (
      <div className="flex gap-2 rounded-md border-l-2 border-amber bg-amber-light/40 px-4 py-3 text-sm text-foreground/90">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
        <span>{block.text}</span>
      </div>
    );
  return null;
}

function SectionPreview({
  section,
}: {
  section: { id: string; title: string; blocks: DocBlock[] };
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-3 text-left"
      >
        <span className="font-display text-base text-navy">{section.title}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="space-y-3 pb-4">
          {section.blocks.map((b, i) => (
            <PreviewBlock key={i} block={b} />
          ))}
        </div>
      )}
    </div>
  );
}

type Step = "form" | "converting" | "review" | "submitting" | "success" | "error";
type Form = {
  title: string;
  type: SubmissionDocType | "";
  area: string;
  responsible: string;
  responsibleEmail: string;
  notes: string;
};
const EMPTY: Form = {
  title: "",
  type: "",
  area: "",
  responsible: "",
  responsibleEmail: "",
  notes: "",
};

function SubmeterPage() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [conversion, setConversion] = useState<ConversionResult | null>(null);
  const [errMsg, setErrMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set =
    (k: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleFile = (f: File) => {
    const ok = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    if (!ok.includes(f.type)) {
      setErrMsg("Formato não suportado. Use PDF ou DOCX.");
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setErrMsg("Arquivo muito grande. Máximo 20MB.");
      return;
    }
    setErrMsg("");
    setFile(f);
  };

  const valid = !!(
    form.title &&
    form.type &&
    form.area &&
    form.responsible &&
    form.responsibleEmail &&
    file
  );

  const handleConvert = async () => {
    if (!valid || !form.type || !file) return;
    setStep("converting");
    setErrMsg("");
    try {
      const text = await extractText(file);
      if (text.trim().length < 50) throw new Error("Não foi possível extrair texto do arquivo.");
      const result = await convertDocument(text, file.name, form.type as SubmissionDocType, form.area);
      setConversion(result);
      setStep("review");
    } catch (e: any) {
      setErrMsg(e?.message ?? "Erro na conversão.");
      setStep("error");
    }
  };

  const handleSubmit = async () => {
    if (!form.type || !file || !conversion) return;
    setStep("submitting");
    try {
      const code = generateCode(form.type as SubmissionDocType, form.area);
      const workflow = buildWorkflow(form.type as SubmissionDocType);
      const first = workflow[0];
      addSubmission({
        id: crypto.randomUUID(),
        title: conversion.title || form.title,
        code,
        type: form.type as SubmissionDocType,
        area: form.area,
        responsible: form.responsible,
        responsibleEmail: form.responsibleEmail,
        fileName: file.name,
        fileSize: file.size,
        submittedAt: new Date().toISOString(),
        currentStep: 0,
        workflow,
        status: "em-andamento",
        notes: form.notes,
        convertedSections: conversion.sections,
        convertedSummary: conversion.summary,
      });
      const email = buildNotificationEmail({
        to: first.email,
        approverName: first.name,
        submitterName: form.responsible,
        docTitle: conversion.title || form.title,
        docCode: code,
        docType: form.type,
        area: form.area,
        hubUrl: `${window.location.origin}/em-aprovacao`,
      });
      await sendGmailNotification(email);
      setStep("success");
      setForm(EMPTY);
      setFile(null);
      setConversion(null);
    } catch {
      setStep("error");
      setErrMsg("Erro ao submeter. Tente novamente.");
    }
  };

  // --- SUCCESS ---
  if (step === "success")
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl px-6 py-16">
          <div className="rounded-lg border border-verde-newe/40 bg-verde-newe/5 p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-verde-newe/15">
              <CheckCircle2 className="h-7 w-7 text-verde-newe" />
            </div>
            <div className="font-mono-caps mt-5 text-verde-newe" style={{ fontSize: 9 }}>
              Documento submetido
            </div>
            <h1 className="font-display mt-1 text-2xl text-navy">Workflow iniciado</h1>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              O documento foi convertido para o padrão Hyndra e uma notificação foi enviada para
              Giovanni Sampaio.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => setStep("form")}
                className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:opacity-90"
              >
                Submeter outro documento
              </button>
              <Link
                to="/em-aprovacao"
                className="text-sm font-medium text-navy hover:underline"
              >
                Ver fila de aprovação →
              </Link>
            </div>
          </div>
        </div>
      </AppShell>
    );

  // --- REVIEW ---
  if (step === "review" && conversion)
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-6 py-10">
          <div className="mb-6">
            <div className="font-mono-caps text-verde-newe" style={{ fontSize: 9 }}>
              Etapa 2 de 2 — Revisão
            </div>
            <h1 className="font-display mt-1 text-3xl text-navy">Revisar documento convertido</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Confira o conteúdo na identidade visual padrão do Hub antes de submeter para aprovação.
            </p>
          </div>

          <div className="mb-6 rounded-lg border border-border bg-card p-5">
            <div className="font-mono-caps text-muted-foreground" style={{ fontSize: 9 }}>
              Documento convertido
            </div>
            <h2 className="font-display mt-1 text-xl text-navy">{conversion.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{conversion.summary}</p>
            <div className="font-mono-caps mt-3 text-muted-foreground" style={{ fontSize: 9 }}>
              {conversion.sections.length} seções ·{" "}
              {conversion.sections.flatMap((s) => s.blocks).length} blocos
            </div>
          </div>

          <div className="mb-6 overflow-hidden rounded-lg border border-border bg-card">
            <div className="border-b border-border bg-secondary/40 px-5 py-3">
              <span className="font-mono-caps text-muted-foreground" style={{ fontSize: 9 }}>
                Preview — identidade visual Hyndra Hub
              </span>
            </div>
            <div className="px-5">
              {conversion.sections.map((s) => (
                <SectionPreview key={s.id} section={s} />
              ))}
            </div>
          </div>

          {form.type && (
            <div className="mb-6 rounded-lg border border-border bg-card p-5">
              <div className="font-mono-caps mb-3 text-muted-foreground" style={{ fontSize: 9 }}>
                Workflow — {form.type.toUpperCase()}
              </div>
              <div className="space-y-2">
                {workflowSteps(form.type)?.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium ${
                        i === 1
                          ? "border-verde-newe/40 bg-verde-newe/10 text-verde-newe"
                          : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span
                      className={`text-sm ${i === 1 ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {s}
                    </span>
                    {i === 1 && (
                      <span className="font-mono-caps rounded bg-verde-newe/10 px-2 py-0.5 text-verde-newe" style={{ fontSize: 8 }}>
                        Próximo
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleSubmit}
              disabled={step === "submitting"}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:opacity-90 disabled:opacity-40"
            >
              {step === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submetendo…
                </>
              ) : (
                "Confirmar e iniciar workflow de aprovação →"
              )}
            </button>
            <button
              onClick={() => {
                setStep("form");
                setConversion(null);
              }}
              className="w-full rounded-md border border-border px-5 py-2.5 text-sm text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
            >
              ← Voltar e editar
            </button>
          </div>
        </div>
      </AppShell>
    );

  // --- FORM (step 1) ---
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-8">
          <div className="font-mono-caps text-verde-newe" style={{ fontSize: 9 }}>
            Etapa 1 de 2
          </div>
          <h1 className="font-display mt-1 text-3xl text-navy">Submeter Documento</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Faça upload do documento. O Hub converte automaticamente para o padrão visual Hyndra
            antes de iniciar o workflow de aprovação.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="font-mono-caps mb-1.5 block text-muted-foreground" style={{ fontSize: 9 }}>
              Título do Documento *
            </label>
            <input
              value={form.title}
              onChange={set("title")}
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-verde-newe focus:outline-none"
              placeholder="Ex.: Política de Segurança da Informação"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="font-mono-caps mb-1.5 block text-muted-foreground" style={{ fontSize: 9 }}>
                Tipo *
              </label>
              <select
                value={form.type}
                onChange={set("type")}
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-verde-newe focus:outline-none"
              >
                <option value="">Selecione…</option>
                {DOC_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-mono-caps mb-1.5 block text-muted-foreground" style={{ fontSize: 9 }}>
                Área *
              </label>
              <select
                value={form.area}
                onChange={set("area")}
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-verde-newe focus:outline-none"
              >
                <option value="">Selecione…</option>
                {AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="font-mono-caps mb-1.5 block text-muted-foreground" style={{ fontSize: 9 }}>
                Responsável *
              </label>
              <input
                value={form.responsible}
                onChange={set("responsible")}
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-verde-newe focus:outline-none"
                placeholder="Nome completo"
              />
            </div>
            <div>
              <label className="font-mono-caps mb-1.5 block text-muted-foreground" style={{ fontSize: 9 }}>
                E-mail *
              </label>
              <input
                type="email"
                value={form.responsibleEmail}
                onChange={set("responsibleEmail")}
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-verde-newe focus:outline-none"
                placeholder="nome@hyndraparticipacoes.com.br"
              />
            </div>
          </div>

          <div>
            <label className="font-mono-caps mb-1.5 block text-muted-foreground" style={{ fontSize: 9 }}>
              Arquivo (PDF ou DOCX, máx. 20MB) *
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                const f = e.dataTransfer.files[0];
                if (f) handleFile(f);
              }}
              onClick={() => fileRef.current?.click()}
              className={`cursor-pointer rounded-md border-2 border-dashed px-6 py-8 text-center transition-colors ${
                drag
                  ? "border-verde-newe bg-verde-newe/5"
                  : file
                  ? "border-verde-newe/40 bg-verde-newe/5"
                  : "border-border hover:border-foreground/30"
              }`}
            >
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="h-6 w-6 text-verde-newe" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                  <p className="mt-2 text-sm text-foreground">Arraste ou clique para selecionar</p>
                  <p className="font-mono-caps mt-1 text-muted-foreground" style={{ fontSize: 9 }}>
                    PDF · DOCX · até 20MB
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.docx,.doc"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </div>

          <div>
            <label className="font-mono-caps mb-1.5 block text-muted-foreground" style={{ fontSize: 9 }}>
              Observações (opcional)
            </label>
            <textarea
              value={form.notes}
              onChange={set("notes")}
              rows={3}
              className="w-full resize-none rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:border-verde-newe focus:outline-none"
              placeholder="Notas para os aprovadores…"
            />
          </div>

          {form.type && (
            <div className="rounded-md border border-border bg-card p-4">
              <div className="font-mono-caps mb-3 text-muted-foreground" style={{ fontSize: 9 }}>
                Workflow — {form.type.toUpperCase()}
              </div>
              <div className="space-y-2">
                {workflowSteps(form.type)?.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium ${
                        i === 0
                          ? "border-verde-newe/40 bg-verde-newe/10 text-verde-newe"
                          : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span className={`text-sm ${i === 0 ? "text-foreground" : "text-muted-foreground"}`}>
                      {s}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {errMsg && (
            <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3">
              <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
              <p className="text-sm text-destructive">{errMsg}</p>
            </div>
          )}

          <button
            onClick={handleConvert}
            disabled={!valid || step === "converting"}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {step === "converting" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Convertendo para padrão Hyndra…
              </>
            ) : (
              "Converter e revisar documento →"
            )}
          </button>
          <p className="text-center font-mono-caps text-muted-foreground" style={{ fontSize: 9 }}>
            O documento será convertido para o padrão visual do Hub antes de ir para aprovação.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
