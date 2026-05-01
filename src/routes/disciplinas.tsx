import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { disciplinas } from "@/lib/data";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/disciplinas")({
  component: Disciplinas,
});

function Disciplinas() {
  return (
    <>
      <PageHeader
        title="Painel por Disciplina"
        subtitle="Meta, realizado, produtividade e próximos passos por disciplina."
        actions={
          <div className="flex gap-2">
            <select className="h-9 px-3 text-sm rounded-md border border-border bg-card">
              <option>Todas as disciplinas</option>
              <option>Apenas críticas</option>
              <option>Apenas em atenção</option>
            </select>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {disciplinas.map((d) => {
          const pct = (d.realizado / d.meta) * 100;
          const prodCls =
            d.produtividade < 0.85 ? "text-critical" : d.produtividade < 1 ? "text-warning-foreground" : "text-success";
          return (
            <div key={d.id} className="rounded-lg border border-border bg-card overflow-hidden hover:shadow-sm transition-shadow">
              <div className="px-5 py-4 border-b border-border flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">{d.responsavel}</div>
                  <div className="font-display font-semibold text-base mt-0.5">{d.nome}</div>
                </div>
                <StatusBadge status={d.status} />
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground">Atingimento</span>
                    <span className="text-sm font-medium num">{pct.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${d.status === "critico" ? "bg-critical" : d.status === "atencao" ? "bg-warning" : "bg-success"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-[11px] text-muted-foreground">
                    <span className="num">Realizado: {d.realizado}</span>
                    <span className="num">Meta: {d.meta}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="rounded-md bg-surface p-3">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Produtividade</div>
                    <div className={`text-lg font-display font-semibold num ${prodCls}`}>{d.produtividade.toFixed(2)}x</div>
                  </div>
                  <div className="rounded-md bg-surface p-3">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Pendências</div>
                    <div className="text-lg font-display font-semibold num">{d.pendencias}</div>
                  </div>
                </div>

                <div className="border-t border-border pt-3">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Próximo passo</div>
                  <div className="text-sm flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span>{d.proximoPasso}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
