import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import {
  formatDateBR,
  getDisciplinasDaObra,
  getDisciplinaNome,
  getPendenciasDaObra,
  type ImpactoPendencia,
  type Pendencia,
  type PrioridadePendencia,
  type StatusPendencia,
  type TipoPendencia,
} from "@/lib/data";
import { createPendenciaId, usePietraData } from "@/lib/store";

export const Route = createFileRoute("/pendencias")({
  component: Pendencias,
});

const tipos = ["Todos", "Restrição", "RFI", "Mudança", "Risco", "Issue", "Decisão"] as const;
const tiposForm: TipoPendencia[] = ["Restrição", "RFI", "Mudança", "Risco", "Issue", "Decisão"];
const impactos: ImpactoPendencia[] = ["Alto", "Médio", "Baixo"];
const prioridades: PrioridadePendencia[] = ["P1", "P2", "P3"];
const statusList: StatusPendencia[] = ["Aberta", "Em análise", "Resolvida"];
const inputCls =
  "w-full h-9 px-3 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/40";
const textareaCls =
  "w-full px-3 py-2 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/40";

const tipoCls: Record<TipoPendencia, string> = {
  Decisão: "bg-accent/15 text-accent-foreground border-accent/30",
  RFI: "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400",
  Mudança: "bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400",
  Restrição: "bg-warning/15 text-warning-foreground border-warning/30",
  Risco: "bg-orange-500/10 text-orange-700 border-orange-500/20 dark:text-orange-400",
  Issue: "bg-critical/10 text-critical border-critical/20",
};

const prioCls: Record<PrioridadePendencia, string> = {
  P1: "bg-critical text-critical-foreground",
  P2: "bg-warning text-warning-foreground",
  P3: "bg-muted text-muted-foreground",
};

const statusCls: Record<StatusPendencia, string> = {
  Aberta: "text-critical",
  "Em análise": "text-warning-foreground",
  Resolvida: "text-success",
};

function emptyPendencia(obraId: string, disciplinaId: string): Pendencia {
  return {
    id: createPendenciaId(),
    obraId,
    tipo: "Restrição",
    disciplinaId,
    descricao: "",
    responsavel: "",
    prazo: "2026-05-31",
    impacto: "Médio",
    status: "Aberta",
    prioridade: "P2",
  };
}

function Pendencias() {
  const { data, activeObra, savePendencia, deletePendencia } = usePietraData();
  const disciplinas = getDisciplinasDaObra(data);
  const pendencias = getPendenciasDaObra(data);
  const [filtro, setFiltro] = useState<(typeof tipos)[number]>("Todos");
  const [editing, setEditing] = useState<Pendencia | null>(null);
  const list =
    filtro === "Todos" ? pendencias : pendencias.filter((pendencia) => pendencia.tipo === filtro);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    savePendencia(editing);
    setEditing(null);
  }

  return (
    <>
      <PageHeader
        title="Pendências"
        subtitle="Fila única de restrições, RFIs, mudanças, riscos, issues e decisões."
        actions={
          <button
            onClick={() => setEditing(emptyPendencia(activeObra.id, disciplinas[0]?.id ?? ""))}
            disabled={disciplinas.length === 0}
            className="h-9 px-3 text-sm rounded-md bg-primary text-primary-foreground inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> Nova pendência
          </button>
        }
      />

      {editing && (
        <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                ID
              </span>
              <input
                required
                className={inputCls}
                value={editing.id}
                onChange={(event) => setEditing({ ...editing, id: event.target.value })}
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Tipo
              </span>
              <select
                className={inputCls}
                value={editing.tipo}
                onChange={(event) =>
                  setEditing({ ...editing, tipo: event.target.value as TipoPendencia })
                }
              >
                {tiposForm.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Disciplina
              </span>
              <select
                className={inputCls}
                value={editing.disciplinaId}
                onChange={(event) => setEditing({ ...editing, disciplinaId: event.target.value })}
              >
                {disciplinas.map((disciplina) => (
                  <option key={disciplina.id} value={disciplina.id}>
                    {disciplina.nome}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Prazo
              </span>
              <input
                type="date"
                required
                className={inputCls}
                value={editing.prazo}
                onChange={(event) => setEditing({ ...editing, prazo: event.target.value })}
              />
            </label>
            <label className="space-y-1 md:col-span-4">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Descrição
              </span>
              <textarea
                required
                rows={2}
                className={textareaCls}
                value={editing.descricao}
                onChange={(event) => setEditing({ ...editing, descricao: event.target.value })}
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Responsável
              </span>
              <input
                required
                className={inputCls}
                value={editing.responsavel}
                onChange={(event) => setEditing({ ...editing, responsavel: event.target.value })}
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Impacto
              </span>
              <select
                className={inputCls}
                value={editing.impacto}
                onChange={(event) =>
                  setEditing({ ...editing, impacto: event.target.value as ImpactoPendencia })
                }
              >
                {impactos.map((impacto) => (
                  <option key={impacto} value={impacto}>
                    {impacto}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Prioridade
              </span>
              <select
                className={inputCls}
                value={editing.prioridade}
                onChange={(event) =>
                  setEditing({ ...editing, prioridade: event.target.value as PrioridadePendencia })
                }
              >
                {prioridades.map((prioridade) => (
                  <option key={prioridade} value={prioridade}>
                    {prioridade}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Status
              </span>
              <select
                className={inputCls}
                value={editing.status}
                onChange={(event) =>
                  setEditing({ ...editing, status: event.target.value as StatusPendencia })
                }
              >
                {statusList.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="h-9 px-4 text-sm rounded-md border border-border bg-card hover:bg-surface"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="h-9 px-4 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Salvar pendência
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap gap-2 mb-5">
        {tipos.map((tipo) => (
          <button
            key={tipo}
            onClick={() => setFiltro(tipo)}
            className={`h-8 px-3 text-xs rounded-md border transition-colors ${
              filtro === tipo
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border hover:bg-surface"
            }`}
          >
            {tipo}
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
                <th className="text-right font-medium px-4 py-2.5">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map((pendencia) => (
                <tr key={pendencia.id} className="hover:bg-surface/60">
                  <td className="px-4 py-3 font-mono text-xs">{pendencia.id}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${tipoCls[pendencia.tipo]}`}
                    >
                      {pendencia.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {getDisciplinaNome(data, pendencia.disciplinaId)}
                  </td>
                  <td className="px-4 py-3 max-w-md">
                    <div className="font-medium">{pendencia.descricao}</div>
                  </td>
                  <td className="px-4 py-3 text-xs">{pendencia.responsavel}</td>
                  <td className="px-4 py-3 num text-xs">{formatDateBR(pendencia.prazo)}</td>
                  <td className="px-4 py-3 text-xs">{pendencia.impacto}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-5 rounded text-[11px] font-bold ${prioCls[pendencia.prioridade]}`}
                    >
                      {pendencia.prioridade}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-xs font-medium ${statusCls[pendencia.status]}`}>
                    {pendencia.status}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => setEditing(pendencia)}
                        className="h-8 w-8 rounded-md border border-border hover:bg-surface inline-flex items-center justify-center"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deletePendencia(pendencia.id)}
                        className="h-8 w-8 rounded-md border border-critical/30 text-critical hover:bg-critical/5 inline-flex items-center justify-center"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
