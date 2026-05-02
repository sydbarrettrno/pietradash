import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import {
  formatDateBR,
  getDiariosDaObra,
  getDisciplinasDaObra,
  getDisciplinaNome,
  getItemControleLabel,
  getItensDaObra,
  type Diario as DiarioRegistro,
  type StatusSemaforo,
} from "@/lib/data";
import { createDiarioId, usePietraData } from "@/lib/store";

export const Route = createFileRoute("/diario")({
  component: Diario,
});

const inputCls =
  "w-full h-9 px-3 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/40";
const textareaCls =
  "w-full px-3 py-2 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/40";
const statusOptions: { value: StatusSemaforo; label: string }[] = [
  { value: "ok", label: "No prazo" },
  { value: "atencao", label: "Atenção" },
  { value: "critico", label: "Crítico" },
];

function emptyDiario(obraId: string, disciplinaId: string, itemControleId: string): DiarioRegistro {
  return {
    id: createDiarioId(),
    obraId,
    data: "2026-05-08",
    disciplinaId,
    itemControleId,
    atividade: "",
    metaDia: "",
    realizadoDia: "",
    equipe: 0,
    hh: 0,
    restricao: "Sem restrição",
    statusDia: "ok",
    avancoItem: 0,
    planoSeguinte: "",
    observacoes: "",
  };
}

function Diario() {
  const { data, activeObra, saveDiario, deleteDiario } = usePietraData();
  const disciplinas = getDisciplinasDaObra(data);
  const itensControle = getItensDaObra(data);
  const diarios = getDiariosDaObra(data).sort((a, b) => b.data.localeCompare(a.data));
  const [editing, setEditing] = useState<DiarioRegistro | null>(null);
  const itensDaDisciplina = useMemo(() => {
    if (!editing) return itensControle;
    return itensControle.filter((item) => item.disciplinaId === editing.disciplinaId);
  }, [editing, itensControle]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    saveDiario(editing);
    setEditing(null);
  }

  function handleDisciplinaChange(disciplinaId: string) {
    if (!editing) return;
    const firstItem = itensControle.find((item) => item.disciplinaId === disciplinaId);
    setEditing({
      ...editing,
      disciplinaId,
      itemControleId: firstItem?.id ?? "",
      avancoItem: firstItem?.avancoFisico ?? 0,
    });
  }

  function startNew() {
    const disciplina = disciplinas[0];
    const item = disciplina
      ? itensControle.find((candidate) => candidate.disciplinaId === disciplina.id)
      : undefined;
    if (!disciplina || !item) return;
    setEditing(emptyDiario(activeObra.id, disciplina.id, item.id));
  }

  return (
    <>
      <PageHeader
        title="Diário de Campo"
        subtitle="Registro diário de produção, restrições, plano seguinte e avanço operacional."
        actions={
          <button
            onClick={startNew}
            disabled={disciplinas.length === 0 || itensControle.length === 0}
            className="h-9 px-3 text-sm rounded-md bg-primary text-primary-foreground inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> Novo registro
          </button>
        }
      />

      {editing && (
        <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Data
              </span>
              <input
                type="date"
                required
                value={editing.data}
                onChange={(event) => setEditing({ ...editing, data: event.target.value })}
                className={inputCls}
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Disciplina
              </span>
              <select
                className={inputCls}
                value={editing.disciplinaId}
                onChange={(event) => handleDisciplinaChange(event.target.value)}
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
                Item de Controle
              </span>
              <select
                required
                className={inputCls}
                value={editing.itemControleId}
                onChange={(event) => {
                  const item = itensControle.find(
                    (candidate) => candidate.id === event.target.value,
                  );
                  setEditing({
                    ...editing,
                    itemControleId: event.target.value,
                    avancoItem: item?.avancoFisico ?? editing.avancoItem,
                  });
                }}
              >
                {itensDaDisciplina.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.codigo} - {item.nome}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 md:col-span-3">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Atividade
              </span>
              <input
                required
                className={inputCls}
                value={editing.atividade}
                onChange={(event) => setEditing({ ...editing, atividade: event.target.value })}
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Meta do dia
              </span>
              <input
                required
                className={inputCls}
                value={editing.metaDia}
                onChange={(event) => setEditing({ ...editing, metaDia: event.target.value })}
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Realizado do dia
              </span>
              <input
                required
                className={inputCls}
                value={editing.realizadoDia}
                onChange={(event) => setEditing({ ...editing, realizadoDia: event.target.value })}
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Status do dia
              </span>
              <select
                className={inputCls}
                value={editing.statusDia}
                onChange={(event) =>
                  setEditing({ ...editing, statusDia: event.target.value as StatusSemaforo })
                }
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Equipe
              </span>
              <input
                type="number"
                min="0"
                required
                className={inputCls}
                value={editing.equipe}
                onChange={(event) => setEditing({ ...editing, equipe: Number(event.target.value) })}
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                HH
              </span>
              <input
                type="number"
                min="0"
                required
                className={inputCls}
                value={editing.hh}
                onChange={(event) => setEditing({ ...editing, hh: Number(event.target.value) })}
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Avanço do item (%)
              </span>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                required
                className={inputCls}
                value={editing.avancoItem}
                onChange={(event) =>
                  setEditing({ ...editing, avancoItem: Number(event.target.value) })
                }
              />
            </label>
            <label className="space-y-1 md:col-span-3">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Restrição
              </span>
              <input
                className={inputCls}
                value={editing.restricao}
                onChange={(event) => setEditing({ ...editing, restricao: event.target.value })}
              />
            </label>
            <label className="space-y-1 md:col-span-3">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Plano do dia seguinte
              </span>
              <textarea
                rows={2}
                className={textareaCls}
                value={editing.planoSeguinte}
                onChange={(event) => setEditing({ ...editing, planoSeguinte: event.target.value })}
              />
            </label>
            <label className="space-y-1 md:col-span-3">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Observações
              </span>
              <textarea
                rows={2}
                className={textareaCls}
                value={editing.observacoes}
                onChange={(event) => setEditing({ ...editing, observacoes: event.target.value })}
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
              Salvar registro
            </button>
          </div>
        </form>
      )}

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-display font-semibold">Registros recentes</h2>
          <span className="text-xs text-muted-foreground">{diarios.length} registros</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-2.5">Data</th>
                <th className="text-left font-medium px-4 py-2.5">Disciplina</th>
                <th className="text-left font-medium px-4 py-2.5">Item</th>
                <th className="text-left font-medium px-4 py-2.5">Atividade</th>
                <th className="text-left font-medium px-4 py-2.5">Meta / Realizado</th>
                <th className="text-left font-medium px-4 py-2.5">Equipe</th>
                <th className="text-left font-medium px-4 py-2.5">HH</th>
                <th className="text-left font-medium px-4 py-2.5">Avanço</th>
                <th className="text-left font-medium px-4 py-2.5">Status</th>
                <th className="text-right font-medium px-4 py-2.5">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {diarios.map((registro) => (
                <tr key={registro.id} className="hover:bg-surface/60">
                  <td className="px-4 py-3 num whitespace-nowrap">{formatDateBR(registro.data)}</td>
                  <td className="px-4 py-3">{getDisciplinaNome(data, registro.disciplinaId)}</td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {getItemControleLabel(data, registro.itemControleId)}
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate" title={registro.atividade}>
                    {registro.atividade}
                  </td>
                  <td className="px-4 py-3 num text-xs">
                    {registro.metaDia} / {registro.realizadoDia}
                  </td>
                  <td className="px-4 py-3 num">{registro.equipe}</td>
                  <td className="px-4 py-3 num">{registro.hh}</td>
                  <td className="px-4 py-3 num">{registro.avancoItem}%</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={registro.statusDia} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => setEditing(registro)}
                        className="h-8 w-8 rounded-md border border-border hover:bg-surface inline-flex items-center justify-center"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deleteDiario(registro.id)}
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
