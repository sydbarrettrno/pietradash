import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { obra, disciplinas, itensControle, pendencias, formatBRL, formatPct } from "@/lib/data";
import { FileText, Download, BarChart3, PieChart, Activity, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/relatorios")({
  component: Relatorios,
});

const relatorios = [
  { icon: BarChart3, titulo: "Relatório semanal de obra", desc: "Avanço físico, financeiro, restrições e plano da semana", periodo: "Semana 19/2026" },
  { icon: PieChart, titulo: "Relatório mensal ao proprietário", desc: "Visão executiva consolidada com semáforo e decisões", periodo: "Abril/2026" },
  { icon: Activity, titulo: "Curva S — Físico × Financeiro", desc: "Acompanhamento da curva planejada vs realizada", periodo: "Acumulado" },
  { icon: AlertCircle, titulo: "Relatório de pendências", desc: "Status de RFIs, decisões, riscos e mudanças", periodo: "Atual" },
  { icon: FileText, titulo: "Diário de obra consolidado", desc: "Registros de campo agrupados por disciplina", periodo: "Últimos 30 dias" },
  { icon: BarChart3, titulo: "Tendência por item de controle", desc: "Desvios projetados de orçamento por item da EAP", periodo: "Atual" },
];

function Relatorios() {
  const totalOrc = itensControle.reduce((s, i) => s + i.orcamento, 0);
  const totalTend = itensControle.reduce((s, i) => s + i.tendencia, 0);

  return (
    <>
      <PageHeader title="Relatórios" subtitle="Documentos prontos para apresentação ao proprietário e à diretoria." />

      {/* Snapshot */}
      <div className="rounded-lg border border-border bg-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-semibold">Snapshot atual</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Dados consolidados de {obra.nome} — 08/05/2026</p>
          </div>
          <button className="h-9 px-3 text-sm rounded-md bg-primary text-primary-foreground inline-flex items-center gap-1.5">
            <Download className="h-4 w-4" /> Exportar PDF
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-border rounded-md overflow-hidden">
          {[
            { l: "Avanço físico", v: formatPct(obra.avancoFisico) },
            { l: "Avanço planejado", v: formatPct(obra.avancoPlanejado) },
            { l: "Orçamento", v: formatBRL(totalOrc) },
            { l: "Tendência", v: formatBRL(totalTend) },
            { l: "Pendências abertas", v: String(pendencias.filter((p) => p.status !== "Resolvida").length) },
          ].map((k) => (
            <div key={k.l} className="bg-card p-4">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{k.l}</div>
              <div className="text-lg font-display font-semibold num mt-1">{k.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Distribuição por disciplina */}
      <div className="rounded-lg border border-border bg-card p-6 mb-6">
        <h2 className="font-display font-semibold mb-4">Avanço por disciplina</h2>
        <div className="space-y-3">
          {disciplinas.map((d) => (
            <div key={d.id} className="flex items-center gap-4">
              <div className="w-44 text-sm">{d.nome}</div>
              <div className="flex-1 h-6 rounded bg-muted relative overflow-hidden">
                <div
                  className={`h-full ${d.status === "critico" ? "bg-critical" : d.status === "atencao" ? "bg-warning" : "bg-success"}`}
                  style={{ width: `${d.realizado}%` }}
                />
                <span className="absolute inset-y-0 right-2 flex items-center text-[11px] font-medium num text-foreground/80">{d.realizado}%</span>
              </div>
              <div className={`w-16 text-right text-xs num ${d.produtividade < 0.85 ? "text-critical" : d.produtividade < 1 ? "text-warning-foreground" : "text-success"}`}>
                {d.produtividade.toFixed(2)}x
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de relatórios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relatorios.map((r, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-5 hover:shadow-sm transition-shadow flex items-start gap-4">
            <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <r.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display font-semibold">{r.titulo}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{r.desc}</div>
              <div className="text-[11px] uppercase tracking-wider text-accent mt-2">{r.periodo}</div>
            </div>
            <div className="flex flex-col gap-1.5">
              <button className="h-8 px-3 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90">PDF</button>
              <button className="h-8 px-3 text-xs rounded-md border border-border bg-card hover:bg-surface">Excel</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
