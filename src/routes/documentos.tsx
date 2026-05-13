import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PolicyCard } from "@/components/PolicyCard";
import { documents, categories, type DocStatus } from "@/data/documents";

export const Route = createFileRoute("/documentos")({
  component: AllDocs,
  head: () => ({
    meta: [
      { title: "Documentos — Hyndra Hub" },
      { name: "description", content: "Repositório completo de políticas, procedimentos e documentos corporativos da Hyndra." },
    ],
  }),
});

const statuses: DocStatus[] = ["Publicado", "Em Aprovação", "Em Revisão", "Arquivado"];

function AllDocs() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("Todos");
  const [status, setStatus] = useState<string>("Todos");

  const filtered = useMemo(() => {
    return documents.filter((d) => {
      if (cat !== "Todos" && d.category !== cat) return false;
      if (status !== "Todos" && d.status !== status) return false;
      if (q) {
        const t = q.toLowerCase();
        return (
          d.code.toLowerCase().includes(t) ||
          d.title.toLowerCase().includes(t) ||
          d.responsible.toLowerCase().includes(t)
        );
      }
      return true;
    });
  }, [q, cat, status]);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="font-mono-caps text-blue">Repositório</div>
        <h1 className="font-display mt-2 text-3xl text-navy md:text-4xl">Todos os documentos</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {documents.length} documentos catalogados nas categorias institucionais. Use os filtros para refinar a consulta.
        </p>

        {/* Filters */}
        <div className="mt-8 flex flex-col gap-3 rounded-lg border border-border bg-card p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por código, título ou área…"
              className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm focus:border-blue focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-blue focus:outline-none"
          >
            <option>Todos</option>
            {categories.map((c) => (
              <option key={c.name}>{c.name}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-blue focus:outline-none"
          >
            <option>Todos</option>
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
          <span>{filtered.length} resultado(s)</span>
          <Link to="/em-aprovacao" className="text-blue hover:underline">Ver fila de aprovação →</Link>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <PolicyCard key={d.code} doc={d} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-lg border border-dashed border-border bg-card p-12 text-center">
              <div className="font-display text-lg text-foreground">Nenhum documento encontrado</div>
              <p className="mt-1 text-sm text-muted-foreground">Refine os filtros ou limpe a busca.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
