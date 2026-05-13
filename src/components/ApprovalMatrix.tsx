import { useState } from "react";
import { cn } from "@/lib/utils";

type Tier = { range: string; approvers: string[] };
type Sector = { name: string; tiers: Tier[] };

const sectors: Sector[] = [
  {
    name: "Novos Negócios",
    tiers: [
      { range: "Até R$ 5.000,00", approvers: ["Gerente de Planejamento", "Gerente Executivo PPA"] },
      { range: "R$ 5.000,01 a R$ 50.000,00", approvers: ["Gerente de Planejamento", "Gerente Executivo PPA", "Superintendente"] },
      { range: "Acima de R$ 50.000,01", approvers: ["Gerente de Planejamento", "Gerente Executivo PPA", "Superintendente", "CEO"] },
    ],
  },
  {
    name: "Marketing",
    tiers: [
      { range: "Até R$ 5.000,00", approvers: ["Gerente de Planejamento", "Gerente Executivo Comercial"] },
      { range: "R$ 5.000,01 a R$ 50.000,00", approvers: ["Gerente de Planejamento", "Gerente Executivo Comercial", "Diretor Comercial"] },
      { range: "Acima de R$ 50.000,01", approvers: ["Gerente de Planejamento", "Gerente Executivo Comercial", "Diretor Comercial", "CEO"] },
    ],
  },
  {
    name: "Tecnologia",
    tiers: [
      { range: "Até R$ 5.000,00", approvers: ["Gerente de Planejamento", "Especialista de TI"] },
      { range: "R$ 5.000,01 a R$ 50.000,00", approvers: ["Gerente de Planejamento", "Especialista de TI", "Superintendente"] },
      { range: "Acima de R$ 50.000,01", approvers: ["Gerente de Planejamento", "Especialista de TI", "Superintendente", "CEO"] },
    ],
  },
  {
    name: "Custo com Obras",
    tiers: [
      { range: "Até R$ 5.000,00", approvers: ["Gerente de Planejamento", "Gerente de Obras"] },
      { range: "R$ 5.000,01 a R$ 50.000,00", approvers: ["Gerente de Planejamento", "Gerente de Obras", "Superintendente"] },
      { range: "Acima de R$ 50.000,01", approvers: ["Gerente de Planejamento", "Gerente de Obras", "Superintendente", "CEO"] },
    ],
  },
  {
    name: "Comercial",
    tiers: [
      { range: "Até R$ 5.000,00", approvers: ["Gerente de Planejamento", "Gerente Executivo Comercial"] },
      { range: "R$ 5.000,01 a R$ 50.000,00", approvers: ["Gerente de Planejamento", "Gerente Executivo Comercial", "Diretor Comercial"] },
      { range: "Acima de R$ 50.000,01", approvers: ["Gerente de Planejamento", "Gerente Executivo Comercial", "Diretor Comercial", "CEO"] },
    ],
  },
  {
    name: "Administração Financeira",
    tiers: [
      { range: "Até R$ 5.000,00", approvers: ["Gerente de Planejamento", "Coordenador de Suprimentos"] },
      { range: "R$ 5.000,01 a R$ 50.000,00", approvers: ["Gerente de Planejamento", "Coordenador de Suprimentos", "Superintendente"] },
      { range: "Acima de R$ 50.000,01", approvers: ["Gerente de Planejamento", "Coordenador de Suprimentos", "Superintendente", "CEO"] },
    ],
  },
];

export function ApprovalMatrix() {
  const [active, setActive] = useState(sectors[0].name);
  const sector = sectors.find((s) => s.name === active)!;

  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border bg-secondary/40 p-4">
        <div className="font-mono-caps text-muted-foreground">Matriz interativa de alçadas — MEGA</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {sectors.map((s) => (
            <button
              key={s.name}
              onClick={() => setActive(s.name)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                active === s.name
                  ? "border-navy bg-navy text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-navy/40",
              )}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
        {sector.tiers.map((t, i) => (
          <div key={i} className="flex flex-col p-5">
            <div className="font-mono-caps text-blue">Faixa {i + 1}</div>
            <div className="font-display mt-1 text-base text-navy">{t.range}</div>
            <ul className="mt-4 space-y-2">
              {t.approvers.map((a) => (
                <li key={a} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-navy" />
                  {a}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-4 text-xs text-muted-foreground">
              {t.approvers.length} aprovador(es) obrigatório(s)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
