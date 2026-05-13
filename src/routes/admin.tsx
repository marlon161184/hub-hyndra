import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Settings2 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({
    meta: [
      { title: "Administração — Hyndra Hub" },
      { name: "description", content: "Painel administrativo do repositório institucional Hyndra." },
    ],
  }),
});

function Admin() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
          <Settings2 className="h-5 w-5" />
        </div>
        <div className="font-mono-caps mt-6 text-blue">Em construção</div>
        <h1 className="font-display mt-2 text-3xl text-navy">Administração</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Gestão de usuários, permissões e parâmetros institucionais será disponibilizada em fase posterior.
        </p>
        <Link to="/" className="mt-6 inline-block text-sm text-blue hover:underline">
          Voltar ao Dashboard
        </Link>
      </div>
    </AppShell>
  );
}
