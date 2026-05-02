import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight, Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { formatPct, getDisciplinaResumos, type Disciplina } from "@/lib/data";
import { createDisciplinaId, usePietraData } from "@/lib/store";

export const Route = createFileRoute("/disciplinas")({
  component: Disciplinas,
});

const inputCls =
  "w-full h-9 px-3 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/40";

const filtros = [
  { value: "todas", label: "Todas as disciplinas" },
  { value: "critico", label: "Apenas críticas" },
  { value: "atencao", label: "Apenas em atenção" },
  { value: "ok", label: "No prazo" },
] as const;

function emptyDisciplina(obraId: string): Disciplina {
  return {
    id: createDisciplinaId(),
    obraId,
    nome: "",
    responsavel: "",
    meta: 100,
    produtividade: 1,
    proximoPasso: "",
  };
}

function Disciplinas() {
  const { data, activeObra, saveDisciplina, deleteDisciplina } = usePietraData();
  const [filtro, setFiltro] = useState<(typeof filtros)[number]["value"]>("todas");
  const [editing, setEditing] = useState<Disciplina | null>(null);
  const disciplinas = getDisciplinaResumos(data).filter(
    (disciplina) => filtro === "todas" || disciplina.status === filtro,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    saveDisciplina(editing);
    setEditing(null);
  }

  return (
    <>
      <PageHeader
        title="Painel por Disciplina"
        subtitle="Produção, bloqueios, avanço e pendências por disciplina."
        actions={
          <div className="flex gap-2">
            <select
              value={filtro}
              onChange={(event) => setFiltro(event.target.value as typeof filtro)}
              className="h-9 px-3 text-sm rounded-md border border-border bg-card"
            >
              {filtros.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => setEditing(emptyDisciplina(activeObra.id))}
              className="h-9 px-3 text-sm rounded-md bg-primary text-primary-foreground inline-flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Nova disciplina
            </button>
          </div>
        }
      />

      {editing && (
        <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Disciplina
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
                Meta (%)
              </span>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                required
                className={inputCls}
                value={editing.meta}
                onChange={(event) => setEditing({ ...editing, meta: Number(event.target.value) })}
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Produtividade
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                className={inputCls}
                value={editing.produtividade}
                onChange={(event) =>
                  setEditing({ ...editing, produtividade: Number(event.target.value) })
                }
              />
            </label>
            <label className="space-y-1 md:col-span-4">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Próximo passo
              </span>
              <input
                required
                className={inputCls}
                value={editing.proximoPasso}
                onChange={(event) => setEditing({ ...editing, proximoPasso: event.target.value })}
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
              Salvar disciplina
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {disciplinas.map((disciplina) => {
          const pct = disciplina.meta > 0 ? (disciplina.realizado / disciplina.meta) * 100 : 0;
          const prodCls =
            disciplina.produtividade < 0.85
              ? "text-critical"
              : disciplina.produtividade < 1
                ? "text-warning-foreground"
                : "text-success";

          return (
            <div
              key={disciplina.id}
              className="rounded-lg border border-border bg-card overflow-hidden hover:shadow-sm transition-shadow"
            >
              <div className="px-5 py-4 border-b border-border flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">{disciplina.responsavel}</div>
                  <div className="font-display font-semibold text-base mt-0.5">
                    {disciplina.nome}
                  </div>
                </div>
                <StatusBadge status={disciplina.status} />
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground">Atingimento</span>
                    <span className="text-sm font-medium num">{formatPct(pct)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        disciplina.status === "critico"
                          ? "bg-critical"
                          : disciplina.status === "atencao"
                            ? "bg-warning"
                            : "bg-success"
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-[11px] text-muted-foreground">
                    <span className="num">Avanço: {disciplina.realizado.toFixed(0)}%</span>
                    <span className="num">Meta: {disciplina.meta}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-1">
                  <div className="rounded-md bg-surface p-3">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Produtiv.
                    </div>
                    <div className={`text-lg font-display font-semibold num ${prodCls}`}>
                      {disciplina.produtividade.toFixed(2)}x
                    </div>
                  </div>
                  <div className="rounded-md bg-surface p-3">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Pend.
                    </div>
                    <div className="text-lg font-display font-semibold num">
                      {disciplina.pendencias}
                    </div>
                  </div>
                  <div className="rounded-md bg-surface p-3">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      HH
                    </div>
                    <div className="text-lg font-display font-semibold num">
                      {disciplina.producao.hh}
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-3">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                    Próximo passo
                  </div>
                  <div className="text-sm flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span>{disciplina.proximoPasso}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setEditing(disciplina)}
                    className="h-8 px-3 text-xs rounded-md border border-border bg-card hover:bg-surface inline-flex items-center gap-1.5"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Editar
                  </button>
                  <button
                    onClick={() => deleteDisciplina(disciplina.id)}
                    className="h-8 px-3 text-xs rounded-md border border-critical/30 text-critical hover:bg-critical/5 inline-flex items-center gap-1.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Excluir
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
