import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bell,
  Briefcase,
  Building2,
  ClipboardList,
  FileBarChart2,
  LayoutDashboard,
  Layers,
  ListChecks,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePietraData } from "@/lib/store";
import {
  PIETRA_CREDIT,
  PIETRA_OWNER_INITIALS,
  PIETRA_OWNER_NAME,
  PIETRA_OWNER_ROLE,
} from "@/lib/data";

const nav = [
  { to: "/", label: "Dashboard Central", icon: LayoutDashboard },
  { to: "/obras", label: "Obras", icon: Building2 },
  { to: "/proprietario", label: "Painel do Proprietário", icon: Briefcase },
  { to: "/disciplinas", label: "Painel por Disciplina", icon: Layers },
  { to: "/diario", label: "Diário de Campo", icon: ClipboardList },
  { to: "/pendencias", label: "Pendências", icon: AlertTriangle },
  { to: "/itens-controle", label: "Itens de Controle da Obra", icon: ListChecks },
  { to: "/relatorios", label: "Relatórios", icon: FileBarChart2 },
] as const;

export function AppShell() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { data, activeObra, setActiveObra, resetDemoData, persistenceMode, syncError } =
    usePietraData();

  return (
    <div className="min-h-screen flex bg-surface">
      <aside className="hidden lg:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="px-5 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-md bg-accent flex items-center justify-center">
              <Building2 className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <div className="font-display font-semibold text-base text-white tracking-tight">
                Painel Pietra
              </div>
              <div className="text-[11px] uppercase tracking-wider text-sidebar-foreground/60">
                Gestão de Obra
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {nav.map((item) => {
            const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-white border-l-2 border-accent -ml-px"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-white",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-sidebar-border space-y-3">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-sidebar-foreground/50 mb-1">
              Obra ativa
            </div>
            <select
              value={activeObra.id}
              onChange={(event) => setActiveObra(event.target.value)}
              className="w-full h-9 rounded-md border border-sidebar-border bg-sidebar-accent px-2 text-sm text-white"
            >
              {data.obras.map((obra) => (
                <option key={obra.id} value={obra.id}>
                  {obra.nome}
                </option>
              ))}
            </select>
            <div className="text-xs text-sidebar-foreground/60 mt-2">{activeObra.endereco}</div>
          </div>
          <div className="rounded-md border border-sidebar-border bg-sidebar-accent/50 px-2 py-2">
            <div className="text-[11px] uppercase tracking-wider text-sidebar-foreground/50">
              Fonte dos dados
            </div>
            <div className="mt-0.5 text-xs text-sidebar-foreground/80">
              {persistenceMode === "supabase" ? "Supabase conectado" : "Demo local"}
            </div>
            {syncError && (
              <div className="mt-1 line-clamp-2 text-[11px] text-warning">Fallback local ativo</div>
            )}
          </div>
          {persistenceMode === "local" && (
            <button
              type="button"
              onClick={resetDemoData}
              className="h-8 w-full rounded-md border border-sidebar-border text-xs text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white"
            >
              Restaurar demo
            </button>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-card flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-10">
          <div className="flex-1 max-w-md relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Buscar item de controle, pendência, disciplina..."
              className="w-full h-9 pl-9 pr-3 text-sm rounded-md bg-surface border border-border focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="relative h-9 w-9 rounded-md hover:bg-surface flex items-center justify-center">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-critical" />
            </button>
            <div className="flex items-center gap-2.5 pl-3 border-l border-border">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                {PIETRA_OWNER_INITIALS}
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="text-xs font-medium">{PIETRA_OWNER_NAME}</div>
                <div className="text-[11px] text-muted-foreground">{PIETRA_OWNER_ROLE}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-8 py-6 max-w-[1500px] w-full mx-auto">
          <Outlet />
        </main>
        <footer className="px-4 lg:px-8 pb-5">
          <div className="max-w-[1500px] w-full mx-auto border-t border-border pt-4 text-center text-xs text-muted-foreground">
            {PIETRA_CREDIT}
          </div>
        </footer>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
