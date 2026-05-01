import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { obra, disciplinas, pendencias, proximosPassos, formatBRL, formatPct } from "@/lib/data";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Target,
  Wallet,
  Activity,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function KPI({ label, value, hint, icon: Icon, trend, tone = "default" }: {
  label: string; value: string; hint?: string; icon: React.ComponentType<{ className?: string }>;
  trend?: { value: string; up?: boolean; bad?: boolean }; tone?: "default" | "warn" | "crit" | "ok";
}) {
  const toneCls = {
    default: "border-border",
    warn: "border-warning/40 bg-warning/5",
    crit: "border-critical/40 bg-critical/5",
    ok: "border-success/30 bg-success/5",
  }[tone];
  return (
    <div className={`rounded-lg border ${toneCls} bg-card p-5`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground font-medium">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </div>
        {trend && (
          <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${trend.bad ? "text-critical" : "text-success"}`}>
            {trend.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend.value}
          </span>
        )}
      </div>
      <div className="mt-3 text-2xl font-display font-semibold num">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

function Dashboard() {
  const criticos = disciplinas.filter((d) => d.status === "critico");
  const atencao = disciplinas.filter((d) => d.status === "atencao");
  const pendAbertas = pendencias.filter((p) => p.status !== "Resolvida");
  const pendCriticas = pendencias.filter((p) => p.prioridade === "P1" && p.status !== "Resolvida");
  const decisoes = pendencias.filter((p) => p.tipo === "Decisão" && p.status === "Aberta");
  const desvioCusto = ((obra.orcamentoTendencia - obra.orcamentoPrevisto) / obra.orcamentoPrevisto) * 100;

  return (
    <>
      <PageHeader
        title="Dashboard Central"
        subtitle={`${obra.nome} • Atualizado em 08/05/2026 às 18:42`}
        actions={
          <>
            <button className="h-9 px-3 text-sm rounded-md border border-border bg-card hover:bg-surface">Exportar</button>
            <button className="h-9 px-3 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90">Reunião semanal</button>
          </>
        }
      />

      {/* Status banner */}
      <div className="rounded-lg border border-border bg-card p-5 mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-md bg-warning/15 border border-warning/30 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-warning-foreground" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Status geral da obra</div>
            <div className="text-xl font-display font-semibold mt-0.5">Em atenção — 2 disciplinas críticas</div>
            <div className="text-sm text-muted-foreground mt-0.5">Hidráulica e suprimento de blocos cerâmicos pressionando o cronograma.</div>
          </div>
        </div>
        <div className="flex gap-6 lg:border-l lg:pl-6 border-border">
          <div>
            <div className="text-xs text-muted-foreground">Início</div>
            <div className="text-sm font-medium num">{obra.inicio}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Prazo previsto</div>
            <div className="text-sm font-medium num">{obra.prazoPrevisto}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Cliente</div>
            <div className="text-sm font-medium">{obra.cliente}</div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPI label="Avanço físico" value={formatPct(obra.avancoFisico)} hint={`Planejado: ${formatPct(obra.avancoPlanejado)}`} icon={Activity} trend={{ value: `-${(obra.avancoPlanejado - obra.avancoFisico).toFixed(1)} pp`, bad: true, up: false }} tone="warn" />
        <KPI label="Orçamento previsto" value={formatBRL(obra.orcamentoPrevisto)} hint={`Realizado: ${formatBRL(obra.realizado)}`} icon={Wallet} />
        <KPI label="Tendência de custo" value={formatBRL(obra.orcamentoTendencia)} hint={`Desvio: +${formatPct(desvioCusto)}`} icon={Target} trend={{ value: `+${formatPct(desvioCusto)}`, up: true, bad: true }} tone="crit" />
        <KPI label="Desvio de prazo" value={`+${obra.desvioPrazoDias} dias`} hint="vs. cronograma base" icon={Clock} trend={{ value: "+3 d na sem.", up: true, bad: true }} tone="warn" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Disciplinas */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-card">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-display font-semibold">Disciplinas em destaque</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{criticos.length} crítica(s) • {atencao.length} em atenção</p>
            </div>
            <Link to="/disciplinas" className="text-xs text-primary hover:underline inline-flex items-center gap-1">Ver todas <ArrowUpRight className="h-3 w-3" /></Link>
          </div>
          <div className="divide-y divide-border">
            {[...criticos, ...atencao].map((d) => (
              <div key={d.id} className="px-5 py-3.5 flex items-center gap-4">
                <StatusBadge status={d.status} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{d.nome}</div>
                  <div className="text-xs text-muted-foreground truncate">{d.proximoPasso}</div>
                </div>
                <div className="hidden sm:block text-right">
                  <div className="text-xs text-muted-foreground">Realizado</div>
                  <div className="text-sm font-medium num">{d.realizado}%</div>
                </div>
                <div className="hidden md:block text-right w-24">
                  <div className="text-xs text-muted-foreground">Produtiv.</div>
                  <div className={`text-sm font-medium num ${d.produtividade < 0.85 ? "text-critical" : d.produtividade < 1 ? "text-warning-foreground" : "text-success"}`}>{d.produtividade.toFixed(2)}x</div>
                </div>
                <div className="hidden md:block text-right w-20">
                  <div className="text-xs text-muted-foreground">Pend.</div>
                  <div className="text-sm font-medium num">{d.pendencias}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decisões */}
        <div className="rounded-lg border border-border bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-display font-semibold">Decisões necessárias</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{decisoes.length} aguardando o proprietário</p>
          </div>
          <div className="divide-y divide-border">
            {decisoes.map((d) => (
              <div key={d.id} className="px-5 py-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-muted-foreground">{d.id}</span>
                  <span className="text-[11px] text-critical font-medium">Prazo {d.prazo}</span>
                </div>
                <div className="text-sm font-medium mt-1">{d.descricao}</div>
                <div className="text-xs text-muted-foreground mt-1">{d.disciplina}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pendências + próximos passos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold">Pendências</h2>
            <Link to="/pendencias" className="text-xs text-primary hover:underline">Abrir fila</Link>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="rounded-md bg-surface p-3">
              <div className="text-xs text-muted-foreground">Abertas</div>
              <div className="text-2xl font-display font-semibold num mt-0.5">{pendAbertas.length}</div>
            </div>
            <div className="rounded-md bg-critical/5 border border-critical/20 p-3">
              <div className="text-xs text-critical">Críticas (P1)</div>
              <div className="text-2xl font-display font-semibold num mt-0.5 text-critical">{pendCriticas.length}</div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {pendCriticas.slice(0, 3).map((p) => (
              <div key={p.id} className="flex items-start gap-2 text-xs">
                <span className="font-mono text-muted-foreground shrink-0">{p.id}</span>
                <span className="line-clamp-2">{p.descricao}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-lg border border-border bg-card">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-display font-semibold">Próximos passos</h2>
            <span className="text-xs text-muted-foreground">Próximos 14 dias</span>
          </div>
          <div className="divide-y divide-border">
            {proximosPassos.map((p, i) => (
              <div key={i} className="px-5 py-3 flex items-center gap-4">
                <div className="w-12 text-center">
                  <div className="text-[11px] uppercase text-muted-foreground">Mai</div>
                  <div className="text-lg font-display font-semibold leading-none num">{p.data.split("/")[0]}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{p.texto}</div>
                  <div className="text-xs text-muted-foreground">{p.responsavel}</div>
                </div>
                {p.texto.startsWith("DECISÃO") ? (
                  <span className="text-[11px] uppercase tracking-wider px-2 py-0.5 rounded bg-accent/20 text-accent-foreground border border-accent/40 font-semibold">Decisão</span>
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
