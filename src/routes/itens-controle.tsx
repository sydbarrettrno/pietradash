import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Minus, Pencil, Plus, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import {
  formatBRL,
  formatDateBR,
  getDisciplinasDaObra,
  getDisciplinaNome,
  getItensDaObra,
  type ItemControle,
  type StatusSemaforo,
} from "@/lib/data";
import { createItemControleId, usePietraData } from "@/lib/store";

export const Route = createFileRoute("/itens-controle")({
  component: ItensControle,
});

const inputCls =
  "w-full h-9 px-3 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/40";
const statusOptions: { value: StatusSemaforo; label: string }[] = [
  { value: "ok", label: "No prazo" },
  { value: "atencao", label: "Atenção" },
  { value: "critico", label: "Crítico" },
];

function emptyItem(obraId: string, disciplinaId: string, count: number): ItemControle {
  return {
    id: createItemControleId(),
    obraId,
    codigo: `IC-${count + 1}.01`,
    nome: "",
    disciplinaId,
    orcamentoPrevisto: 0,
    tendenciaCusto: 0,
    status: "ok",
    dataPrevista: "2026-12-31",
    responsavel: "",
    avancoFisico: 0,
  };
}

function ItensControle() {
  const { data, activeObra, saveItemControle, deleteItemControle } = usePietraData();
  const disciplinas = getDisciplinasDaObra(data);
  const itensControle = getItensDaObra(data);
  const [editing, setEditing] = useState<ItemControle | null>(null);
  const totalOrc = itensControle.reduce((sum, item) => sum + item.orcamentoPrevisto, 0);
  const totalTend = itensControle.reduce((sum, item) => sum + item.tendenciaCusto, 0);
  const desvio = totalOrc > 0 ? ((totalTend - totalOrc) / totalOrc) * 100 : 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    saveItemControle(editing);
    setEditing(null);
  }

  return (
    <>
      <PageHeader
        title="Itens de Controle da Obra"
        subtitle="Cadastro de orçamento, tendência, prazo, responsável e avanço físico."
        actions={
          <button
            onClick={() =>
              setEditing(emptyItem(activeObra.id, disciplinas[0]?.id ?? "", itensControle.length))
            }
            disabled={disciplinas.length === 0}
            className="h-9 px-3 text-sm rounded-md bg-primary text-primary-foreground inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> Novo item
          </button>
        }
      />

      {editing && (
        <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Código
              </span>
              <input
                required
                className={inputCls}
                value={editing.codigo}
                onChange={(event) => setEditing({ ...editing, codigo: event.target.value })}
              />
            </label>
            <label className="space-y-1 md:col-span-2">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Item
              </span>
              <input
                required
                className={inputCls}
                value={editing.nome}
                onChange={(event) => setEditing({ ...editing, nome: event.target.value })}
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Disciplina
              </span>
              <select
                required
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
                Orçamento previsto
              </span>
              <input
                type="number"
                min="0"
                required
                className={inputCls}
                value={editing.orcamentoPrevisto}
                onChange={(event) =>
                  setEditing({ ...editing, orcamentoPrevisto: Number(event.target.value) })
                }
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Tendência
              </span>
              <input
                type="number"
                min="0"
                required
                className={inputCls}
                value={editing.tendenciaCusto}
                onChange={(event) =>
                  setEditing({ ...editing, tendenciaCusto: Number(event.target.value) })
                }
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Avanço (%)
              </span>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                required
                className={inputCls}
                value={editing.avancoFisico}
                onChange={(event) =>
                  setEditing({ ...editing, avancoFisico: Number(event.target.value) })
                }
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Status
              </span>
              <select
                className={inputCls}
                value={editing.status}
                onChange={(event) =>
                  setEditing({ ...editing, status: event.target.value as StatusSemaforo })
                }
              >
                {statusOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Data prevista
              </span>
              <input
                type="date"
                required
                className={inputCls}
                value={editing.dataPrevista}
                onChange={(event) => setEditing({ ...editing, dataPrevista: event.target.value })}
              />
            </label>
            <label className="space-y-1 md:col-span-3">
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
              Salvar item
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Total de itens
          </div>
          <div className="text-2xl font-display font-semibold num mt-1">{itensControle.length}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Orçamento previsto
          </div>
          <div className="text-2xl font-display font-semibold num mt-1">{formatBRL(totalOrc)}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Tendência</div>
          <div className="text-2xl font-display font-semibold num mt-1">{formatBRL(totalTend)}</div>
        </div>
        <div
          className={`rounded-lg border p-4 ${desvio > 0 ? "border-critical/30 bg-critical/5" : "border-success/30 bg-success/5"}`}
        >
          <div
            className={`text-xs uppercase tracking-wider ${desvio > 0 ? "text-critical" : "text-success"}`}
          >
            Desvio
          </div>
          <div
            className={`text-2xl font-display font-semibold num mt-1 ${desvio > 0 ? "text-critical" : "text-success"}`}
          >
            {desvio >= 0 ? "+" : ""}
            {desvio.toFixed(2)}%
          </div>
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
                <th className="text-right font-medium px-4 py-2.5">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {itensControle.map((item) => {
                const dv = item.tendenciaCusto - item.orcamentoPrevisto;
                const Icon = dv > 0 ? TrendingUp : dv < 0 ? TrendingDown : Minus;
                const dvCls =
                  dv > 0 ? "text-critical" : dv < 0 ? "text-success" : "text-muted-foreground";

                return (
                  <tr key={item.id} className="hover:bg-surface/60">
                    <td className="px-4 py-3 font-mono text-xs">{item.codigo}</td>
                    <td className="px-4 py-3 font-medium max-w-xs">{item.nome}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {getDisciplinaNome(data, item.disciplinaId)}
                    </td>
                    <td className="px-4 py-3 text-right num">
                      {formatBRL(item.orcamentoPrevisto)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="num">{formatBRL(item.tendenciaCusto)}</div>
                      <div
                        className={`text-[11px] num inline-flex items-center gap-0.5 justify-end ${dvCls}`}
                      >
                        <Icon className="h-3 w-3" />
                        {dv === 0 ? "-" : `${dv > 0 ? "+" : ""}${formatBRL(dv)}`}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full ${item.status === "critico" ? "bg-critical" : item.status === "atencao" ? "bg-warning" : "bg-success"}`}
                            style={{ width: `${item.avancoFisico}%` }}
                          />
                        </div>
                        <span className="text-xs num w-9 text-right">{item.avancoFisico}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 num text-xs whitespace-nowrap">
                      {formatDateBR(item.dataPrevista)}
                    </td>
                    <td className="px-4 py-3 text-xs">{item.responsavel}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setEditing(item)}
                          className="h-8 w-8 rounded-md border border-border hover:bg-surface inline-flex items-center justify-center"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => deleteItemControle(item.id)}
                          className="h-8 w-8 rounded-md border border-critical/30 text-critical hover:bg-critical/5 inline-flex items-center justify-center"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
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
