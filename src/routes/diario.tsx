import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { diarios, disciplinas, itensControle } from "@/lib/data";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/diario")({
  component: Diario,
});

function Field({ label, children, span = 1 }: { label: string; children: React.ReactNode; span?: 1 | 2 | 3 }) {
  return (
    <div className={`md:col-span-${span}`}>
      <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

const inputCls = "w-full h-9 px-3 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/40";
const textareaCls = "w-full px-3 py-2 text-sm rounded-md border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring/40";

function Diario() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <PageHeader
        title="Diário de Campo"
        subtitle="Registro diário de atividades, restrições e plano do dia seguinte."
        actions={
          <button onClick={() => setOpen((o) => !o)} className="h-9 px-3 text-sm rounded-md bg-primary text-primary-foreground inline-flex items-center gap-1.5">
            <Plus className="h-4 w-4" /> Novo registro
          </button>
        }
      />

      {open && (
        <form className="rounded-lg border border-border bg-card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Data"><input type="date" defaultValue="2026-05-08" className={inputCls} /></Field>
            <Field label="Disciplina">
              <select className={inputCls}>
                {disciplinas.map((d) => <option key={d.id}>{d.nome}</option>)}
              </select>
            </Field>
            <Field label="Item de Controle">
              <select className={inputCls}>
                {itensControle.map((i) => <option key={i.codigo}>{i.codigo} — {i.nome}</option>)}
              </select>
            </Field>

            <Field label="Atividade" span={3}>
              <input className={inputCls} placeholder="Ex.: Concretagem laje pavto 6" />
            </Field>

            <Field label="Meta do dia"><input className={inputCls} placeholder="Ex.: 1 laje completa" /></Field>
            <Field label="Realizado do dia"><input className={inputCls} placeholder="Ex.: 0,8 laje" /></Field>
            <Field label="Status do dia">
              <select className={inputCls}>
                <option>No prazo</option><option>Atenção</option><option>Crítico</option>
              </select>
            </Field>

            <Field label="Equipe (pessoas)"><input type="number" className={inputCls} placeholder="12" /></Field>
            <Field label="HH (homem-hora)"><input type="number" className={inputCls} placeholder="96" /></Field>
            <Field label="Restrição">
              <input className={inputCls} placeholder="Ex.: Falta de material, chuva..." />
            </Field>

            <Field label="Plano do dia seguinte" span={3}>
              <textarea rows={2} className={textareaCls} placeholder="O que será executado amanhã" />
            </Field>
            <Field label="Observações" span={3}>
              <textarea rows={2} className={textareaCls} placeholder="Ocorrências relevantes do dia" />
            </Field>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button type="button" onClick={() => setOpen(false)} className="h-9 px-4 text-sm rounded-md border border-border bg-card hover:bg-surface">Cancelar</button>
            <button type="submit" className="h-9 px-4 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90">Salvar registro</button>
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
                <th className="text-left font-medium px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {diarios.map((d) => (
                <tr key={d.id} className="hover:bg-surface/60">
                  <td className="px-4 py-3 num whitespace-nowrap">{d.data}</td>
                  <td className="px-4 py-3">{d.disciplina}</td>
                  <td className="px-4 py-3 font-mono text-xs">{d.itemControle}</td>
                  <td className="px-4 py-3 max-w-xs truncate" title={d.atividade}>{d.atividade}</td>
                  <td className="px-4 py-3 num text-xs">{d.metaDia} / {d.realizadoDia}</td>
                  <td className="px-4 py-3 num">{d.equipe}</td>
                  <td className="px-4 py-3 num">{d.hh}</td>
                  <td className="px-4 py-3"><StatusBadge status={d.statusDia} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
