import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { StatusDot } from "@/components/StatusBadge";
import {
  formatBRL,
  formatDateBR,
  formatPct,
  getDisciplinaNome,
  getDisciplinaResumos,
  getObraMetricas,
  getPendenciasDaObra,
} from "@/lib/data";
import { usePietraData } from "@/lib/store";

export const Route = createFileRoute("/proprietario")({
  component: Proprietario,
});

function Proprietario() {
  const { data, activeObra, savePendencia } = usePietraData();
  const metricas = getObraMetricas(data);
  const disciplinas = getDisciplinaResumos(data);
  const pendencias = getPendenciasDaObra(data);
  const decisoes = pendencias.filter(
    (pendencia) => pendencia.tipo === "Decisão" && pendencia.status !== "Resolvida",
  );
  const bloqueios = pendencias.filter(
    (pendencia) => pendencia.prioridade === "P1" && pendencia.status !== "Resolvida",
  );
  const statusTexto =
    metricas.statusGeral === "critico"
      ? "Obra crítica"
      : metricas.statusGeral === "atencao"
        ? "Obra em atenção"
        : "Obra no prazo";

  return (
    <>
      <PageHeader
        title="Painel do Proprietário"
        subtitle="Visão executiva de exceções, decisões e tendência."
      />

      <div className="relative overflow-hidden rounded-xl bg-primary text-primary-foreground p-8 mb-8">
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-[0.2em] text-accent">{activeObra.nome}</div>
            <div className="mt-2 text-3xl font-display font-semibold tracking-tight">
              {statusTexto}
            </div>
            <p className="mt-2 text-sm text-primary-foreground/70 max-w-md">
              Avanço físico {formatPct(metricas.avancoFisico)} contra{" "}
              {formatPct(metricas.avancoPlanejado)} planejado. Tendência de custo{" "}
              {metricas.desvioCusto >= 0 ? "+" : ""}
              {metricas.desvioCusto.toFixed(1)}% e atraso de {metricas.desvioPrazoDias} dias.
            </p>
          </div>
          <div className="border-l border-white/10 pl-6">
            <div className="text-xs uppercase tracking-wider text-primary-foreground/60">
              Avanço
            </div>
            <div className="text-3xl font-display font-semibold num mt-1">
              {formatPct(metricas.avancoFisico)}
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${metricas.avancoFisico}%` }}
              />
            </div>
          </div>
          <div className="border-l border-white/10 pl-6">
            <div className="text-xs uppercase tracking-wider text-primary-foreground/60">
              Tendência custo
            </div>
            <div className="text-3xl font-display font-semibold num mt-1">
              {formatBRL(metricas.orcamentoTendencia)}
            </div>
            <div className="text-xs text-accent mt-2 inline-flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> {metricas.desvioCusto >= 0 ? "+" : ""}
              {metricas.desvioCusto.toFixed(1)}% vs previsto
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {[
          {
            icon: Calendar,
            label: "Prazo",
            value: `+${metricas.desvioPrazoDias} dias`,
            sub: `Entrega: ${formatDateBR(activeObra.prazoPrevisto)}`,
            tone: "warning" as const,
          },
          {
            icon: DollarSign,
            label: "Custo",
            value: `${metricas.desvioCusto >= 0 ? "+" : ""}${metricas.desvioCusto.toFixed(1)}%`,
            sub: `Tendência: ${formatBRL(metricas.orcamentoTendencia)}`,
            tone: "critical" as const,
          },
          {
            icon: AlertCircle,
            label: "Bloqueios críticos",
            value: String(bloqueios.length),
            sub: `${decisoes.length} decisão(ões) pendente(s)`,
            tone: "critical" as const,
          },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <kpi.icon className="h-3.5 w-3.5" />
              {kpi.label}
            </div>
            <div
              className={`mt-3 text-3xl font-display font-semibold num ${kpi.tone === "critical" ? "text-critical" : "text-warning-foreground"}`}
            >
              {kpi.value}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card mb-6">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-display font-semibold">Semáforo por disciplina</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Status executivo com avanço, bloqueios e produção recente.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
          {disciplinas.map((disciplina) => (
            <div key={disciplina.id} className="bg-card p-4 hover:bg-surface transition-colors">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{disciplina.nome}</div>
                <StatusDot status={disciplina.status} />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Avanço</div>
              <div className="text-xl font-display font-semibold num">
                {disciplina.realizado.toFixed(0)}%
              </div>
              <div className="mt-2 h-1 rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${
                    disciplina.status === "critico"
                      ? "bg-critical"
                      : disciplina.status === "atencao"
                        ? "bg-warning"
                        : "bg-success"
                  }`}
                  style={{ width: `${disciplina.realizado}%` }}
                />
              </div>
              <div className="mt-2 text-[11px] text-muted-foreground">
                {disciplina.pendencias} pendência(s) - {disciplina.producao.hh} HH recentes
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-accent/40 bg-accent/5">
          <div className="px-6 py-4 border-b border-accent/30 flex items-center justify-between">
            <div>
              <h2 className="font-display font-semibold">Decisões pendentes</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Aguardando encaminhamento do proprietário
              </p>
            </div>
            <span className="px-2 py-1 rounded text-xs font-semibold bg-accent text-accent-foreground">
              {decisoes.length}
            </span>
          </div>
          <div className="divide-y divide-accent/20">
            {decisoes.map((decisao) => (
              <div key={decisao.id} className="px-6 py-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {decisao.id} - {getDisciplinaNome(data, decisao.disciplinaId)}
                  </span>
                  <span className="text-xs font-medium text-critical">
                    Prazo {formatDateBR(decisao.prazo)}
                  </span>
                </div>
                <div className="text-sm font-medium">{decisao.descricao}</div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => savePendencia({ ...decisao, status: "Resolvida" })}
                    className="h-8 px-3 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={() => savePendencia({ ...decisao, status: "Em análise" })}
                    className="h-8 px-3 text-xs rounded-md border border-border bg-card hover:bg-surface"
                  >
                    Solicitar info
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-display font-semibold">Principais bloqueios</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Itens com impacto direto em prazo ou custo
            </p>
          </div>
          <div className="divide-y divide-border">
            {bloqueios.map((bloqueio) => (
              <div key={bloqueio.id} className="px-6 py-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-critical/10 text-critical font-semibold border border-critical/20">
                    {bloqueio.tipo}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono">{bloqueio.id}</span>
                </div>
                <div className="text-sm font-medium">{bloqueio.descricao}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {getDisciplinaNome(data, bloqueio.disciplinaId)} - Resp. {bloqueio.responsavel}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
