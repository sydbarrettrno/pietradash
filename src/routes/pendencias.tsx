import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { pendencias, type Pendencia } from "@/lib/data";

export const Route = createFileRoute("/pendencias")({
  component: Pendencias,
});

const tipos = ["Todos", "Restrição", "RFI", "Mudança", "Risco", "Issue", "Decisão"] as const;

const tipoCls: Record<Pendencia["tipo"], string> = {
  Decisão: "bg-accent/15 text-accent-foreground border-accent/30",
  RFI: "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400",
  Mudança: "bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400",
  Restrição: "bg-warning/15 text-warning-foreground border-warning/30",
  Risco: "bg-orange-500/10 text-orange-700 border-orange-500/20 dark:text-orange-400",
  Issue: "bg-critical/10 text-critical border-critical/20",
};

const prioCls: Record<Pendencia["prioridade"], string> = {
  P1: "bg-critical text-critical-foreground",
  P2: "bg-warning text-warning-foreground",
  P3: "bg-muted text-muted-foreground",
};

const statusCls: Record<Pendencia["status"], string> = {
  Aberta: "text-critical",
  "Em análise": "text-warning-foreground",
  Resolvida: "text-success",
};

function Pendencias() {
  const [filtro, setFiltro] = useState<(typeof tipos)[number]>("Todos");
  const list = filtro === "Todos" ? pendencias : pendencias.filter((p) => p.tipo === filtro);

  return (
    <>
      <PageHeader
        title="Pendências"
        subtitle="Fila única — restrições, RFIs, mudanças, riscos, issues e decisões."
        actions={<button className="h-9 px-3 text-sm rounded-md bg-primary text-primary-foreground">Nova pendência</button>}
      />

      <div className="flex flex-wrap gap-2 mb-5">
        {tipos.map((t) => (
          <button
            key={t}
            onClick={() => setFiltro(t)}
            className={`h-8 px-3 text-xs rounded-md border transition-colors ${
              filtro === t ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-surface"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-2.5">ID</th>
                <th className="text-left font-medium px-4 py-2.5">Tipo</th>
                <th className="text-left font-medium px-4 py-2.5">Disciplina</th>
                <th className="text-left font-medium px-4 py-2.5">Descrição</th>
                <th className="text-left font-medium px-4 py-2.5">Responsável</th>
                <th className="text-left font-medium px-4 py-2.5">Prazo</th>
                <th className="text-left font-medium px-4 py-2.5">Impacto</th>
                <th className="text-left font-medium px-4 py-2.5">Prio.</th>
                <th className="text-left font-medium px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map((p) => (
                <tr key={p.id} className="hover:bg-surface/60">
                  <td className="px-4 py-3 font-mono text-xs">{p.id}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${tipoCls[p.tipo]}`}>{p.tipo}</span>
                  </td>
                  <td className="px-4 py-3 text-xs">{p.disciplina}</td>
                  <td className="px-4 py-3 max-w-md">
                    <div className="font-medium">{p.descricao}</div>
                  </td>
                  <td className="px-4 py-3 text-xs">{p.responsavel}</td>
                  <td className="px-4 py-3 num text-xs">{p.prazo}</td>
                  <td className="px-4 py-3 text-xs">{p.impacto}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center justify-center w-7 h-5 rounded text-[11px] font-bold ${prioCls[p.prioridade]}`}>{p.prioridade}</span>
                  </td>
                  <td className={`px-4 py-3 text-xs font-medium ${statusCls[p.status]}`}>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
