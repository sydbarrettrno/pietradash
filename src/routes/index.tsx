import { createFileRoute, Link } from "@tanstack/react-router";
import type { ComponentType } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import {
  formatBRL,
  formatDateBR,
  formatPct,
  getDisciplinaNome,
  getDisciplinaResumos,
  getObraMetricas,
  getPendenciasDaObra,
  getProximosPassos,
} from "@/lib/data";
import { usePietraData } from "@/lib/store";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function KPI({
  label,
  value,
  hint,
  icon: Icon,
  trend,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: ComponentType<{ className?: string }>;
  trend?: { value: string; up?: boolean; bad?: boolean };
  tone?: "default" | "warn" | "crit" | "ok";
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
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-medium ${trend.bad ? "text-critical" : "text-success"}`}
          >
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
  const { data, activeObra } = usePietraData();
  const metricas = getObraMetricas(data);
  const disciplinas = getDisciplinaResumos(data);
  const pendencias = getPendenciasDaObra(data);
  const proximosPassos = getProximosPassos(data);
  const criticos = disciplinas.filter((disciplina) => disciplina.status === "critico");
  const atencao = disciplinas.filter((disciplina) => disciplina.status === "atencao");
  const pendCriticas = pendencias.filter(
    (pendencia) => pendencia.prioridade === "P1" && pendencia.status !== "Resolvida",
  );
  const decisoes = pendencias.filter(
    (pendencia) => pendencia.tipo === "Decisão" && pendencia.status !== "Resolvida",
  );
  const statusTexto =
    metricas.statusGeral === "critico"
      ? "Crítico"
      : metricas.statusGeral === "atencao"
        ? "Em atenção"
        : "No prazo";
  const avancoDelta = metricas.avancoPlanejado - metricas.avancoFisico;

  return (
    <>
      <PageHeader
        title="Dashboard Central"
        subtitle={`${activeObra.nome} - Atualizado em ${formatDateBR(data.updatedAt)}`}
        actions={
          <>
            <button className="h-9 px-3 text-sm rounded-md border border-border bg-card hover:bg-surface">
              Exportar
            </button>
            <button className="h-9 px-3 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
              Reunião semanal
            </button>
          </>
        }
      />

      <div className="rounded-lg border border-border bg-card p-5 mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-md bg-warning/15 border border-warning/30 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-warning-foreground" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Status geral da obra
            </div>
            <div className="text-xl font-display font-semibold mt-0.5">
              {statusTexto} - {criticos.length} disciplina(s) crítica(s)
            </div>
            <div className="text-sm text-muted-foreground mt-0.5">
              {metricas.pendenciasCriticas} pendência(s) crítica(s), tendência de custo{" "}
              {formatBRL(metricas.desvioCustoValor)} e atraso de {metricas.desvioPrazoDias} dias.
            </div>
          </div>
        </div>
        <div className="flex gap-6 lg:border-l lg:pl-6 border-border">
          <div>
            <div className="text-xs text-muted-foreground">Início</div>
            <div className="text-sm font-medium num">{formatDateBR(activeObra.inicio)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Prazo previsto</div>
            <div className="text-sm font-medium num">{formatDateBR(activeObra.prazoPrevisto)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Cliente</div>
            <div className="text-sm font-medium">{activeObra.cliente}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPI
          label="Avanço físico"
          value={formatPct(metricas.avancoFisico)}
          hint={`Planejado: ${formatPct(metricas.avancoPlanejado)}`}
          icon={Activity}
          trend={{
            value: `${avancoDelta > 0 ? "-" : "+"}${Math.abs(avancoDelta).toFixed(1)} pp`,
            bad: avancoDelta > 0,
            up: avancoDelta <= 0,
          }}
          tone={avancoDelta > 0 ? "warn" : "ok"}
        />
        <KPI
          label="Orçamento previsto"
          value={formatBRL(metricas.orcamentoPrevisto)}
          hint={`Realizado estimado: ${formatBRL(metricas.realizado)}`}
          icon={Wallet}
        />
        <KPI
          label="Tendência de custo"
          value={formatBRL(metricas.orcamentoTendencia)}
          hint={`Desvio: ${metricas.desvioCusto >= 0 ? "+" : ""}${formatPct(metricas.desvioCusto)}`}
          icon={Target}
          trend={{
            value: `${metricas.desvioCusto >= 0 ? "+" : ""}${formatPct(metricas.desvioCusto)}`,
            up: metricas.desvioCusto >= 0,
            bad: metricas.desvioCusto > 0,
          }}
          tone={metricas.desvioCusto > 0 ? "crit" : "ok"}
        />
        <KPI
          label="Pendências críticas"
          value={String(metricas.pendenciasCriticas)}
          hint={`${metricas.pendenciasAbertas} pendências abertas`}
          icon={Clock}
          trend={{
            value: `+${metricas.desvioPrazoDias} dias`,
            up: true,
            bad: metricas.desvioPrazoDias > 0,
          }}
          tone={metricas.pendenciasCriticas > 0 ? "warn" : "ok"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-lg border border-border bg-card">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-display font-semibold">Disciplinas em destaque</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {criticos.length} crítica(s) - {atencao.length} em atenção
              </p>
            </div>
            <Link
              to="/disciplinas"
              className="text-xs text-primary hover:underline inline-flex items-center gap-1"
            >
              Ver todas <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {[...criticos, ...atencao].map((disciplina) => (
              <div key={disciplina.id} className="px-5 py-3.5 flex items-center gap-4">
                <StatusBadge status={disciplina.status} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{disciplina.nome}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {disciplina.proximoPasso}
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <div className="text-xs text-muted-foreground">Avanço</div>
                  <div className="text-sm font-medium num">{disciplina.realizado.toFixed(0)}%</div>
                </div>
                <div className="hidden md:block text-right w-24">
                  <div className="text-xs text-muted-foreground">Produtiv.</div>
                  <div
                    className={`text-sm font-medium num ${
                      disciplina.produtividade < 0.85
                        ? "text-critical"
                        : disciplina.produtividade < 1
                          ? "text-warning-foreground"
                          : "text-success"
                    }`}
                  >
                    {disciplina.produtividade.toFixed(2)}x
                  </div>
                </div>
                <div className="hidden md:block text-right w-20">
                  <div className="text-xs text-muted-foreground">Pend.</div>
                  <div className="text-sm font-medium num">{disciplina.pendencias}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-display font-semibold">Decisões necessárias</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {decisoes.length} aguardando encaminhamento
            </p>
          </div>
          <div className="divide-y divide-border">
            {decisoes.map((decisao) => (
              <div key={decisao.id} className="px-5 py-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-muted-foreground">{decisao.id}</span>
                  <span className="text-[11px] text-critical font-medium">
                    Prazo {formatDateBR(decisao.prazo)}
                  </span>
                </div>
                <div className="text-sm font-medium mt-1">{decisao.descricao}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {getDisciplinaNome(data, decisao.disciplinaId)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold">Pendências</h2>
            <Link to="/pendencias" className="text-xs text-primary hover:underline">
              Abrir fila
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="rounded-md bg-surface p-3">
              <div className="text-xs text-muted-foreground">Abertas</div>
              <div className="text-2xl font-display font-semibold num mt-0.5">
                {metricas.pendenciasAbertas}
              </div>
            </div>
            <div className="rounded-md bg-critical/5 border border-critical/20 p-3">
              <div className="text-xs text-critical">Críticas (P1)</div>
              <div className="text-2xl font-display font-semibold num mt-0.5 text-critical">
                {metricas.pendenciasCriticas}
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {pendCriticas.slice(0, 3).map((pendencia) => (
              <div key={pendencia.id} className="flex items-start gap-2 text-xs">
                <span className="font-mono text-muted-foreground shrink-0">{pendencia.id}</span>
                <span className="line-clamp-2">{pendencia.descricao}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-lg border border-border bg-card">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-display font-semibold">Próximos passos</h2>
            <span className="text-xs text-muted-foreground">Pendências ordenadas por prazo</span>
          </div>
          <div className="divide-y divide-border">
            {proximosPassos.map((passo, index) => (
              <div key={`${passo.data}-${index}`} className="px-5 py-3 flex items-center gap-4">
                <div className="w-12 text-center">
                  <div className="text-[11px] uppercase text-muted-foreground">Mai</div>
                  <div className="text-lg font-display font-semibold leading-none num">
                    {passo.data.split("/")[0]}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{passo.texto}</div>
                  <div className="text-xs text-muted-foreground">{passo.responsavel}</div>
                </div>
                {passo.decisao ? (
                  <span className="text-[11px] uppercase tracking-wider px-2 py-0.5 rounded bg-accent/20 text-accent-foreground border border-accent/40 font-semibold">
                    Decisão
                  </span>
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
