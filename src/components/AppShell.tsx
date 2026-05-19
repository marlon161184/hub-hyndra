import { Link, useRouterState } from "@tanstack/react-router";
import hyndraLogo from "@/assets/hyndra-logo.png";
import {
  Home,
  FolderOpen,
  Users,
  Scale,
  Wallet,
  Building2,
  ShieldCheck,
  GitPullRequestArrow,
  Settings2,
  Search,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const mainNav = [
  { to: "/", label: "Dashboard", icon: Home, exact: true },
  { to: "/documentos", label: "Todos os Documentos", icon: FolderOpen, exact: false },
] as const;

const categoryNav = [
  { slug: "pessoas-cultura", label: "Pessoas & Cultura", icon: Users, dim: false },
  { slug: "financeiro", label: "Financeiro", icon: Wallet, dim: false },
  { slug: "juridico", label: "Jurídico", icon: Scale, dim: true },
  { slug: "operacoes", label: "Operações", icon: Building2, dim: true },
  { slug: "compliance", label: "Compliance", icon: ShieldCheck, dim: true },
] as const;

const tailNav = [
  { to: "/em-aprovacao", label: "Em Aprovação", icon: GitPullRequestArrow, dim: false },
  { to: "/admin", label: "Administração", icon: Settings2, dim: true },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/") || pathname === to;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/90 px-4 backdrop-blur md:px-6">
        <button
          className="md:hidden rounded p-1.5 text-muted-foreground hover:bg-muted"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/" className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <span aria-hidden className="h-7 w-[2px] rounded-full bg-verde-newe" />
            <img src={hyndraLogo} alt="Hyndra Participações" className="h-6 w-auto dark:invert" />
          </div>
          <div className="hidden sm:flex flex-col leading-tight border-l border-border pl-3">
            <span className="font-display text-[13px] font-light tracking-tight">Hub</span>
            <span className="font-mono-caps text-[8px] text-muted-foreground">Plataforma Institucional</span>
          </div>
        </Link>

        <div className="ml-6 hidden flex-1 items-center md:flex">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Buscar por código, título, área…"
              className="w-full rounded-md border border-border bg-background py-1.5 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-blue focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden text-xs text-muted-foreground md:block">Hyndra Participações</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
            HP
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-14 left-0 z-20 w-64 shrink-0 overflow-y-auto border-r border-border bg-card transition-transform md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <nav className="flex flex-col gap-0.5 p-3">
            <div className="px-3 py-2 font-mono-caps text-muted-foreground">Navegação</div>
            {mainNav.map((item) => {
              const active = isActive(item.to, item.exact);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                    active ? "bg-navy text-primary-foreground border-l-2 border-verde-newe" : "text-foreground hover:bg-secondary",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1 truncate">{item.label}</span>
                </Link>
              );
            })}

            <div className="mt-4 px-3 py-2 font-mono-caps text-muted-foreground">Categorias</div>
            {categoryNav.map((item) => {
              const path = `/categoria/${item.slug}`;
              const active = isActive(path);
              return (
                <Link
                  key={item.slug}
                  to="/categoria/$slug"
                  params={{ slug: item.slug }}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-navy text-primary-foreground border-l-2 border-verde-newe"
                      : item.dim
                      ? "text-muted-foreground hover:bg-secondary"
                      : "text-foreground hover:bg-secondary",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1 truncate">{item.label}</span>
                </Link>
              );
            })}

            <div className="mt-4 px-3 py-2 font-mono-caps text-muted-foreground">Workflow</div>
            {tailNav.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-navy text-primary-foreground border-l-2 border-verde-newe"
                      : item.dim
                      ? "text-muted-foreground hover:bg-secondary"
                      : "text-foreground hover:bg-secondary",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1 truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>


          <div className="mx-3 mt-4 rounded-lg border border-border bg-amber-light/60 p-3">
            <div className="font-mono-caps text-amber">Aviso</div>
            <p className="mt-1 text-xs leading-relaxed text-foreground/80">
              10 documentos de Pessoas & Cultura aguardam aprovação do CEO.
            </p>
            <Link to="/em-aprovacao" className="mt-2 inline-block text-xs font-medium text-navy hover:underline">
              Ver fila de aprovação →
            </Link>
          </div>
        </aside>

        {/* Backdrop */}
        {open && (
          <div className="fixed inset-0 top-14 z-10 bg-foreground/20 md:hidden" onClick={() => setOpen(false)} />
        )}

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
