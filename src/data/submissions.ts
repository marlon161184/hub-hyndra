export type SubmissionDocType = "Política" | "Procedimento" | "Fluxograma";
export type WorkflowStepStatus = "pending" | "current" | "done" | "rejected";

export type WorkflowStep = {
  id: string;
  name: string;
  role: string;
  email: string;
  status: WorkflowStepStatus;
  approvedAt?: string;
  notes?: string;
};

export type Submission = {
  id: string;
  title: string;
  code: string;
  type: SubmissionDocType;
  area: string;
  responsible: string;
  responsibleEmail: string;
  fileName: string;
  fileSize: number;
  submittedAt: string;
  currentStep: number;
  workflow: WorkflowStep[];
  status: "em-andamento" | "aprovado" | "rejeitado";
  notes: string;
  convertedSections?: import("@/data/documents").DocSection[];
  convertedSummary?: string;
};

export function buildWorkflow(type: SubmissionDocType): WorkflowStep[] {
  const giovanni: WorkflowStep = {
    id: "giovanni",
    name: "Giovanni Sampaio",
    role: "Head de Governança",
    email: "giovanni.sampaio@hyndraparticipacoes.com.br",
    status: "current",
  };
  const gustavo: WorkflowStep = {
    id: "gustavo",
    name: "Gustavo Garcia",
    role: "DPO",
    email: "gustavo.garcia@hyndraparticipacoes.com.br",
    status: "pending",
  };
  const dilson: WorkflowStep = {
    id: "dilson",
    name: "Dilson Athia",
    role: "CEO",
    email: "dilson.athia@hyndraparticipacoes.com.br",
    status: "pending",
  };
  return type === "Política" ? [giovanni, gustavo, dilson] : [giovanni, gustavo];
}

export function getCurrentApprover(s: Submission): WorkflowStep | null {
  return s.workflow.find((w) => w.status === "current") ?? null;
}

export function getWorkflowPct(s: Submission): number {
  const done = s.workflow.filter((w) => w.status === "done").length;
  return Math.round((done / s.workflow.length) * 100);
}

const KEY = "hyndra-hub-submissions";

export function loadSubmissions(): Submission[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveSubmissions(list: Submission[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function addSubmission(s: Submission) {
  const list = loadSubmissions();
  list.unshift(s);
  saveSubmissions(list);
}

export function generateCode(type: SubmissionDocType, area: string): string {
  const p = type === "Política" ? "POL" : type === "Procedimento" ? "PROC" : "FLX";
  return `${area.slice(0, 3).toUpperCase()}-${p}-${String(Math.floor(Math.random() * 900) + 100)}`;
}

/** Aprova o estágio atual e avança para o próximo aprovador. */
export function approveCurrentStep(s: Submission, notes?: string): Submission {
  const workflow = s.workflow.map((w) => ({ ...w }));
  const idx = workflow.findIndex((w) => w.status === "current");
  if (idx === -1) return s;
  workflow[idx].status = "done";
  workflow[idx].approvedAt = new Date().toISOString();
  if (notes) workflow[idx].notes = notes;
  const next = workflow[idx + 1];
  if (next) {
    next.status = "current";
    return { ...s, workflow, currentStep: idx + 1, status: "em-andamento" };
  }
  return { ...s, workflow, currentStep: idx, status: "aprovado" };
}

/** Rejeita o estágio atual e encerra o workflow. */
export function rejectCurrentStep(s: Submission, notes?: string): Submission {
  const workflow = s.workflow.map((w) => ({ ...w }));
  const idx = workflow.findIndex((w) => w.status === "current");
  if (idx === -1) return s;
  workflow[idx].status = "rejected";
  workflow[idx].approvedAt = new Date().toISOString();
  if (notes) workflow[idx].notes = notes;
  return { ...s, workflow, status: "rejeitado" };
}

/** Aplica uma atualização a uma submissão por id e persiste. */
export function updateSubmission(updated: Submission) {
  const list = loadSubmissions().map((s) => (s.id === updated.id ? updated : s));
  saveSubmissions(list);
}
