import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { StatusDot } from "@/components/StatusBadge";
import { obra, disciplinas, pendencias, formatBRL, formatPct } from "@/lib/data";
import { TrendingUp, AlertCircle, Calendar, DollarSign } from "lucide-react";

export const Route = createFileRoute("/proprietario")({
  component: Proprietario,
});

function Proprietario() {
  const decisoes = pendencias.filter((p) => p.tipo === "Decisão" && p.status !== "Resolvida");
  const bloqueios = pendencias.filter((p) => p.prioridade === "P1" && p.status !== "Resolvida");
  const desvioCusto = ((obra.orcamentoTendencia - obra.orcamentoPrevisto) / obra.orcamentoPrevisto) * 100;

  return (
    <>
      <PageHeader title="Painel do Proprietário" subtitle="Visão executiva — apenas o que exige sua atenção." />

      {/* Hero status */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary via-primary to-[oklch(0.32_0.03_252)] text-primary-foreground p-8 mb-8">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-[0.2em] text-accent">Bella Pietra</div>
            <div className="mt-2 text-3xl font-display font-semibold tracking-tight">Obra em atenção</div>
            <p className="mt-2 text-sm text-primary-foreground/70 max-w-md">
              Avanço físico {formatPct(obra.avancoFisico)} contra {formatPct(obra.avancoPlanejado)} planejado.
              Tendência de custo +{desvioCusto.toFixed(1)}% e atraso de {obra.desvioPrazoDias} dias.
            </p>
          </div>
          <div className="border-l border-white/10 pl-6">
            <div className="text-xs uppercase tracking-wider text-primary-foreground/60">Avanço</div>
            <div className="text-3xl font-display font-semibold num mt-1">{formatPct(obra.avancoFisico)}</div>
            <div className="mt-2 h-1.5 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-accent" style={{ width: `${obra.avancoFisico}%` }} />
            </div>
          </div>
          <div className="border-l border-white/10 pl-6">
            <div className="text-xs uppercase tracking-wider text-primary-foreground/60">Tendência custo</div>
            <div className="text-3xl font-display font-semibold num mt-1">{formatBRL(obra.orcamentoTendencia)}</div>
            <div className="text-xs text-accent mt-2 inline-flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +{desvioCusto.toFixed(1)}% vs previsto
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {[
          { icon: Calendar, label: "Prazo", value: `+${obra.desvioPrazoDias} dias`, sub: `Entrega: ${obra.prazoPrevisto}`, tone: "warning" as const },
          { icon: DollarSign, label: "Custo", value: `+${desvioCusto.toFixed(1)}%`, sub: `Tendência: ${formatBRL(obra.orcamentoTendencia)}`, tone: "critical" as const },
          { icon: AlertCircle, label: "Bloqueios críticos", value: String(bloqueios.length), sub: `${decisoes.length} aguardando sua decisão`, tone: "critical" as const },
        ].map((k, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <k.icon className="h-3.5 w-3.5" />
              {k.label}
            </div>
            <div className={`mt-3 text-3xl font-display font-semibold num ${k.tone === "critical" ? "text-critical" : "text-warning-foreground"}`}>{k.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Semáforo */}
      <div className="rounded-lg border border-border bg-card mb-6">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-display font-semibold">Semáforo por disciplina</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Status executivo — clique para detalhes técnicos</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
          {disciplinas.map((d) => (
            <div key={d.id} className="bg-card p-4 hover:bg-surface transition-colors">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{d.nome}</div>
                <StatusDot status={d.status} />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Realizado</div>
              <div className="text-xl font-display font-semibold num">{d.realizado}%</div>
              <div className="mt-2 h-1 rounded-full bg-muted">
                <div className={`h-full rounded-full ${d.status === "critico" ? "bg-critical" : d.status === "atencao" ? "bg-warning" : "bg-success"}`} style={{ width: `${d.realizado}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decisões + bloqueios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-accent/40 bg-accent/5">
          <div className="px-6 py-4 border-b border-accent/30 flex items-center justify-between">
            <div>
              <h2 className="font-display font-semibold">Decisões pendentes</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Aguardando aprovação do proprietário</p>
            </div>
            <span className="px-2 py-1 rounded text-xs font-semibold bg-accent text-accent-foreground">{decisoes.length}</span>
          </div>
          <div className="divide-y divide-accent/20">
            {decisoes.map((d) => (
              <div key={d.id} className="px-6 py-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono text-muted-foreground">{d.id} • {d.disciplina}</span>
                  <span className="text-xs font-medium text-critical">Prazo {d.prazo}</span>
                </div>
                <div className="text-sm font-medium">{d.descricao}</div>
                <div className="mt-3 flex gap-2">
                  <button className="h-8 px-3 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90">Aprovar</button>
                  <button className="h-8 px-3 text-xs rounded-md border border-border bg-card hover:bg-surface">Solicitar info</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-display font-semibold">Principais bloqueios</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Itens com impacto direto em prazo ou custo</p>
          </div>
          <div className="divide-y divide-border">
            {bloqueios.map((b) => (
              <div key={b.id} className="px-6 py-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-critical/10 text-critical font-semibold border border-critical/20">{b.tipo}</span>
                  <span className="text-[11px] text-muted-foreground font-mono">{b.id}</span>
                </div>
                <div className="text-sm font-medium">{b.descricao}</div>
                <div className="text-xs text-muted-foreground mt-1">{b.disciplina} • Resp. {b.responsavel}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
