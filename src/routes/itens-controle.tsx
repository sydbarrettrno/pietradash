import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { itensControle, formatBRL } from "@/lib/data";
import { Plus, TrendingUp, TrendingDown, Minus } from "lucide-react";

export const Route = createFileRoute("/itens-controle")({
  component: ItensControle,
});

function ItensControle() {
  const totalOrc = itensControle.reduce((s, i) => s + i.orcamento, 0);
  const totalTend = itensControle.reduce((s, i) => s + i.tendencia, 0);
  const desvio = ((totalTend - totalOrc) / totalOrc) * 100;

  return (
    <>
      <PageHeader
        title="Itens de Controle da Obra"
        subtitle="Cadastro completo da EAP — orçamento, tendência, prazo e responsável."
        actions={
          <button className="h-9 px-3 text-sm rounded-md bg-primary text-primary-foreground inline-flex items-center gap-1.5">
            <Plus className="h-4 w-4" /> Novo item
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Total de itens</div>
          <div className="text-2xl font-display font-semibold num mt-1">{itensControle.length}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Orçamento previsto</div>
          <div className="text-2xl font-display font-semibold num mt-1">{formatBRL(totalOrc)}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Tendência</div>
          <div className="text-2xl font-display font-semibold num mt-1">{formatBRL(totalTend)}</div>
        </div>
        <div className="rounded-lg border border-critical/30 bg-critical/5 p-4">
          <div className="text-xs uppercase tracking-wider text-critical">Desvio</div>
          <div className="text-2xl font-display font-semibold num mt-1 text-critical">+{desvio.toFixed(2)}%</div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-2.5">Código</th>
                <th className="text-left font-medium px-4 py-2.5">Item</th>
                <th className="text-left font-medium px-4 py-2.5">Disciplina</th>
                <th className="text-right font-medium px-4 py-2.5">Orçamento</th>
                <th className="text-right font-medium px-4 py-2.5">Tendência</th>
                <th className="text-left font-medium px-4 py-2.5 w-32">Avanço</th>
                <th className="text-left font-medium px-4 py-2.5">Prevista</th>
                <th className="text-left font-medium px-4 py-2.5">Responsável</th>
                <th className="text-left font-medium px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {itensControle.map((it) => {
                const dv = it.tendencia - it.orcamento;
                const Icon = dv > 0 ? TrendingUp : dv < 0 ? TrendingDown : Minus;
                const dvCls = dv > 0 ? "text-critical" : dv < 0 ? "text-success" : "text-muted-foreground";
                return (
                  <tr key={it.codigo} className="hover:bg-surface/60">
                    <td className="px-4 py-3 font-mono text-xs">{it.codigo}</td>
                    <td className="px-4 py-3 font-medium max-w-xs">{it.nome}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{it.disciplina}</td>
                    <td className="px-4 py-3 text-right num">{formatBRL(it.orcamento)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="num">{formatBRL(it.tendencia)}</div>
                      <div className={`text-[11px] num inline-flex items-center gap-0.5 justify-end ${dvCls}`}>
                        <Icon className="h-3 w-3" />
                        {dv === 0 ? "—" : `${dv > 0 ? "+" : ""}${formatBRL(dv)}`}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full ${it.status === "critico" ? "bg-critical" : it.status === "atencao" ? "bg-warning" : "bg-success"}`} style={{ width: `${it.avanco}%` }} />
                        </div>
                        <span className="text-xs num w-9 text-right">{it.avanco}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 num text-xs whitespace-nowrap">{it.dataPrevista}</td>
                    <td className="px-4 py-3 text-xs">{it.responsavel}</td>
                    <td className="px-4 py-3"><StatusBadge status={it.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
