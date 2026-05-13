import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PolicyCard } from "@/components/PolicyCard";
import { ApprovalTracker } from "@/components/ApprovalTracker";
import { documents, categories, type DocCategory } from "@/data/documents";
import { slugifyCat } from "./index";

export const Route = createFileRoute("/categoria/$slug")({
  component: CategoryPage,
  head: ({ params }) => {
    const cat = categories.find((c) => slugifyCat(c.name) === params.slug);
    const title = cat ? `${cat.name} — Hyndra Hub` : "Categoria — Hyndra Hub";
    return {
      meta: [
        { title },
        { name: "description", content: cat?.description ?? "Categoria institucional Hyndra." },
      ],
    };
  },
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const cat = categories.find((c) => slugifyCat(c.name) === slug);

  if (!cat) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h1 className="font-display text-3xl text-navy">Categoria não encontrada</h1>
          <Link to="/documentos" className="mt-4 inline-block text-blue hover:underline">
            Voltar ao repositório
          </Link>
        </div>
      </AppShell>
    );
  }

  const docs = documents.filter((d) => d.category === (cat.name as DocCategory));
  const published = docs.filter((d) => d.status === "Publicado").length;
  const pending = docs.filter((d) => d.status === "Em Aprovação").length;

  return (
    <AppShell>
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="font-mono-caps text-blue">Categoria</div>
          <h1 className="font-display mt-2 text-4xl text-navy">{cat.name}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{cat.description}</p>

          <div className="mt-6 grid grid-cols-3 gap-4 md:max-w-lg">
            <Metric label="Documentos" value={docs.length} />
            <Metric label="Publicados" value={published} />
            <Metric label="Em Aprovação" value={pending} />
          </div>

          <div className="mt-6 flex items-center gap-3 text-xs">
            <span className="font-mono-caps text-muted-foreground">Executivo Responsável</span>
            <span className="rounded-full border border-border bg-secondary px-2.5 py-0.5 font-medium text-secondary-foreground">
              {cat.executive}
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {docs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card p-16 text-center">
            <div className="font-display text-xl text-foreground">Categoria em estruturação</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Documentos desta categoria serão incorporados nas próximas fases do programa de governança.
            </p>
          </div>
        ) : (
          <>
            {pending > 0 && (
              <div className="mb-6 rounded-lg border border-amber/40 bg-amber-light/60 p-5">
                <div className="font-mono-caps text-amber">Status do bloco</div>
                <div className="font-display mt-1 text-lg text-foreground">
                  {pending} documentos aguardam aprovação do CEO
                </div>
                <div className="mt-4">
                  <ApprovalTracker chain={docs[0].approvalChain} compact />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {docs.map((d) => (
                <PolicyCard key={d.code} doc={d} />
              ))}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <div className="font-mono-caps text-muted-foreground">{label}</div>
      <div className="font-display mt-1 text-2xl text-navy">{value}</div>
    </div>
  );
}
