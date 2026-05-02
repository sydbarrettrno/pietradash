import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Building2, Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { formatBRL, formatDateBR, formatPct, getObraMetricas, type Obra } from "@/lib/data";
import { createObraId, usePietraData } from "@/lib/store";

export const Route = createFileRoute("/obras")({
  component: Obras,
});

const inputCls =
  "w-full h-9 px-3 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/40";

function emptyObra(): Obra {
  return {
    id: createObraId(),
    nome: "",
    endereco: "",
    inicio: "2026-05-01",
    prazoPrevisto: "2027-12-31",
    cliente: "",
    responsavel: "",
    avancoPlanejado: 0,
    desvioPrazoDias: 0,
  };
}

function Obras() {
  const { data, activeObra, setActiveObra, saveObra, deleteObra } = usePietraData();
  const [editing, setEditing] = useState<Obra | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    saveObra(editing);
    setActiveObra(editing.id);
    setEditing(null);
  }

  return (
    <>
      <PageHeader
        title="Obras"
        subtitle="Cadastro das obras acompanhadas pelo Painel Pietra."
        actions={
          <button
            onClick={() => setEditing(emptyObra())}
            className="h-9 px-3 text-sm rounded-md bg-primary text-primary-foreground inline-flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" /> Nova obra
          </button>
        }
      />

      {editing && (
        <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Nome
              </span>
              <input
                required
                className={inputCls}
                value={editing.nome}
                onChange={(event) => setEditing({ ...editing, nome: event.target.value })}
              />
            </label>
            <label className="space-y-1 md:col-span-2">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Endereço
              </span>
              <input
                required
                className={inputCls}
                value={editing.endereco}
                onChange={(event) => setEditing({ ...editing, endereco: event.target.value })}
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Início
              </span>
              <input
                type="date"
                required
                className={inputCls}
                value={editing.inicio}
                onChange={(event) => setEditing({ ...editing, inicio: event.target.value })}
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Prazo previsto
              </span>
              <input
                type="date"
                required
                className={inputCls}
                value={editing.prazoPrevisto}
                onChange={(event) => setEditing({ ...editing, prazoPrevisto: event.target.value })}
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Cliente
              </span>
              <input
                required
                className={inputCls}
                value={editing.cliente}
                onChange={(event) => setEditing({ ...editing, cliente: event.target.value })}
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
                Avanço planejado (%)
              </span>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                required
                className={inputCls}
                value={editing.avancoPlanejado}
                onChange={(event) =>
                  setEditing({ ...editing, avancoPlanejado: Number(event.target.value) })
                }
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Desvio prazo (dias)
              </span>
              <input
                type="number"
                required
                className={inputCls}
                value={editing.desvioPrazoDias}
                onChange={(event) =>
                  setEditing({ ...editing, desvioPrazoDias: Number(event.target.value) })
                }
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
              Salvar obra
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {data.obras.map((obra) => {
          const metricas = getObraMetricas(data, obra.id);
          const isActive = obra.id === activeObra.id;

          return (
            <div
              key={obra.id}
              className={`rounded-lg border bg-card p-5 ${isActive ? "border-primary/40" : "border-border"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-display font-semibold">{obra.nome}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{obra.endereco}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {obra.cliente} - {obra.responsavel}
                    </div>
                  </div>
                </div>
                {isActive && (
                  <span className="rounded-md border border-success/20 bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                    Ativa
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
                <div className="rounded-md bg-surface p-3">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Orçamento
                  </div>
                  <div className="text-sm font-semibold num mt-1">
                    {formatBRL(metricas.orcamentoPrevisto)}
                  </div>
                </div>
                <div className="rounded-md bg-surface p-3">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Tendência
                  </div>
                  <div className="text-sm font-semibold num mt-1">
                    {formatBRL(metricas.orcamentoTendencia)}
                  </div>
                </div>
                <div className="rounded-md bg-surface p-3">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Avanço
                  </div>
                  <div className="text-sm font-semibold num mt-1">
                    {formatPct(metricas.avancoFisico)}
                  </div>
                </div>
                <div className="rounded-md bg-surface p-3">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Prazo
                  </div>
                  <div className="text-sm font-semibold num mt-1">
                    {formatDateBR(obra.prazoPrevisto)}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap justify-end gap-2">
                {!isActive && (
                  <button
                    onClick={() => setActiveObra(obra.id)}
                    className="h-8 px-3 text-xs rounded-md border border-border bg-card hover:bg-surface"
                  >
                    Ativar
                  </button>
                )}
                <button
                  onClick={() => setEditing(obra)}
                  className="h-8 px-3 text-xs rounded-md border border-border bg-card hover:bg-surface inline-flex items-center gap-1.5"
                >
                  <Pencil className="h-3.5 w-3.5" /> Editar
                </button>
                <button
                  disabled={data.obras.length <= 1}
                  onClick={() => deleteObra(obra.id)}
                  className="h-8 px-3 text-xs rounded-md border border-critical/30 text-critical hover:bg-critical/5 disabled:opacity-40 inline-flex items-center gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Excluir
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
