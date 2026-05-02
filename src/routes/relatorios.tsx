import { createFileRoute } from "@tanstack/react-router";
import { Activity, AlertCircle, BarChart3, Download, FileText, PieChart } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import {
  formatBRL,
  formatDateBR,
  formatPct,
  getDisciplinaResumos,
  getObraMetricas,
} from "@/lib/data";
import { usePietraData } from "@/lib/store";

export const Route = createFileRoute("/relatorios")({
  component: Relatorios,
});

const relatorios = [
  {
    icon: BarChart3,
    titulo: "Relatório semanal de obra",
    desc: "Avanço físico, financeiro, restrições e plano da semana",
    periodo: "Semana 19/2026",
  },
  {
    icon: PieChart,
    titulo: "Relatório mensal ao proprietário",
    desc: "Visão executiva consolidada com semáforo e decisões",
    periodo: "Abril/2026",
  },
  {
    icon: Activity,
    titulo: "Curva S - Físico x Financeiro",
    desc: "Acompanhamento da curva planejada vs realizada",
    periodo: "Acumulado",
  },
  {
    icon: AlertCircle,
    titulo: "Relatório de pendências",
    desc: "Status de RFIs, decisões, riscos e mudanças",
    periodo: "Atual",
  },
  {
    icon: FileText,
    titulo: "Diário de obra consolidado",
    desc: "Registros de campo agrupados por disciplina",
    periodo: "Últimos 30 dias",
  },
  {
    icon: BarChart3,
    titulo: "Tendência por item de controle",
    desc: "Desvios projetados de orçamento por item",
    periodo: "Atual",
  },
];

function Relatorios() {
  const { data, activeObra } = usePietraData();
  const metricas = getObraMetricas(data);
  const disciplinas = getDisciplinaResumos(data);

  return (
    <>
      <PageHeader
        title="Relatórios"
        subtitle="Documentos prontos para apresentação ao proprietário e à diretoria."
      />

      <div className="rounded-lg border border-border bg-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-semibold">Snapshot atual</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Dados consolidados de {activeObra.nome} - {formatDateBR(data.updatedAt)}
            </p>
          </div>
          <button className="h-9 px-3 text-sm rounded-md bg-primary text-primary-foreground inline-flex items-center gap-1.5">
            <Download className="h-4 w-4" /> Exportar PDF
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-border rounded-md overflow-hidden">
          {[
            { l: "Avanço físico", v: formatPct(metricas.avancoFisico) },
            { l: "Avanço planejado", v: formatPct(metricas.avancoPlanejado) },
            { l: "Orçamento", v: formatBRL(metricas.orcamentoPrevisto) },
            { l: "Tendência", v: formatBRL(metricas.orcamentoTendencia) },
            { l: "Pendências abertas", v: String(metricas.pendenciasAbertas) },
          ].map((item) => (
            <div key={item.l} className="bg-card p-4">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {item.l}
              </div>
              <div className="text-lg font-display font-semibold num mt-1">{item.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 mb-6">
        <h2 className="font-display font-semibold mb-4">Avanço por disciplina</h2>
        <div className="space-y-3">
          {disciplinas.map((disciplina) => (
            <div key={disciplina.id} className="flex items-center gap-4">
              <div className="w-44 text-sm">{disciplina.nome}</div>
              <div className="flex-1 h-6 rounded bg-muted relative overflow-hidden">
                <div
                  className={`h-full ${disciplina.status === "critico" ? "bg-critical" : disciplina.status === "atencao" ? "bg-warning" : "bg-success"}`}
                  style={{ width: `${disciplina.realizado}%` }}
                />
                <span className="absolute inset-y-0 right-2 flex items-center text-[11px] font-medium num text-foreground/80">
                  {disciplina.realizado.toFixed(0)}%
                </span>
              </div>
              <div
                className={`w-16 text-right text-xs num ${
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
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relatorios.map((relatorio) => (
          <div
            key={relatorio.titulo}
            className="rounded-lg border border-border bg-card p-5 hover:shadow-sm transition-shadow flex items-start gap-4"
          >
            <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <relatorio.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display font-semibold">{relatorio.titulo}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{relatorio.desc}</div>
              <div className="text-[11px] uppercase tracking-wider text-accent mt-2">
                {relatorio.periodo}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <button className="h-8 px-3 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
                PDF
              </button>
              <button className="h-8 px-3 text-xs rounded-md border border-border bg-card hover:bg-surface">
                Excel
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
