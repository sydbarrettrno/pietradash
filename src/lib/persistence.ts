import {
  demoData,
  type Diario,
  type Disciplina,
  type ItemControle,
  type Obra,
  type Pendencia,
  type PietraData,
  type StatusSemaforo,
} from "@/lib/data";

export const STORAGE_KEY = "pietra.dashboard.data.v1";

export type PersistenceMode = "local" | "supabase";

type SupabaseConfig = {
  url: string;
  anonKey: string;
};

type ObraRow = {
  id: string;
  nome: string;
  endereco: string;
  inicio: string;
  prazo_previsto: string;
  cliente: string;
  responsavel: string;
  avanco_planejado: number | string | null;
  desvio_prazo_dias: number | null;
  updated_at?: string | null;
};

type DisciplinaRow = {
  id: string;
  obra_id: string;
  nome: string;
  responsavel: string;
  meta: number | string | null;
  produtividade: number | string | null;
  proximo_passo: string;
  updated_at?: string | null;
};

type ItemControleRow = {
  id: string;
  obra_id: string;
  codigo: string;
  nome: string;
  disciplina_id: string;
  orcamento_previsto: number | string | null;
  tendencia_custo: number | string | null;
  status: StatusSemaforo;
  data_prevista: string;
  responsavel: string;
  avanco_fisico: number | string | null;
  updated_at?: string | null;
};

type PendenciaRow = {
  id: string;
  obra_id: string;
  tipo: Pendencia["tipo"];
  disciplina_id: string;
  descricao: string;
  responsavel: string;
  prazo: string;
  impacto: Pendencia["impacto"];
  status: Pendencia["status"];
  prioridade: Pendencia["prioridade"];
  updated_at?: string | null;
};

type DiarioRow = {
  id: string;
  obra_id: string;
  data: string;
  disciplina_id: string;
  item_controle_id: string;
  atividade: string;
  meta_dia: string;
  realizado_dia: string;
  equipe: number | null;
  hh: number | string | null;
  restricao: string;
  status_dia: StatusSemaforo;
  avanco_item: number | string | null;
  plano_seguinte: string;
  observacoes: string;
  updated_at?: string | null;
};

type SettingsRow = {
  id: string;
  active_obra_id: string | null;
  updated_at?: string | null;
};

function numberValue(value: number | string | null | undefined, fallback = 0) {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function dateValue(value: string) {
  return value ? value.slice(0, 10) : "";
}

export function getSupabaseConfig(): SupabaseConfig | null {
  const env = import.meta.env as Record<string, string | undefined>;
  const url = env.VITE_SUPABASE_URL?.replace(/\/$/, "");
  const anonKey = env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey || url.includes("seu-projeto") || anonKey.includes("sua-chave")) {
    return null;
  }

  return { url, anonKey };
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseConfig());
}

export function loadCachedData(): PietraData | null {
  if (typeof localStorage === "undefined") return null;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as PietraData;
  } catch {
    return null;
  }
}

export function saveCachedData(data: PietraData) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

async function supabaseRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error("Supabase não configurado.");
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Erro Supabase ${response.status}`);
  }

  if (response.status === 204) return null as T;

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (null as T);
}

function toObraRow(obra: Obra): ObraRow {
  return {
    id: obra.id,
    nome: obra.nome,
    endereco: obra.endereco,
    inicio: obra.inicio,
    prazo_previsto: obra.prazoPrevisto,
    cliente: obra.cliente,
    responsavel: obra.responsavel,
    avanco_planejado: obra.avancoPlanejado,
    desvio_prazo_dias: obra.desvioPrazoDias,
  };
}

function fromObraRow(row: ObraRow): Obra {
  return {
    id: row.id,
    nome: row.nome,
    endereco: row.endereco,
    inicio: dateValue(row.inicio),
    prazoPrevisto: dateValue(row.prazo_previsto),
    cliente: row.cliente,
    responsavel: row.responsavel,
    avancoPlanejado: numberValue(row.avanco_planejado),
    desvioPrazoDias: numberValue(row.desvio_prazo_dias),
  };
}

function toDisciplinaRow(disciplina: Disciplina): DisciplinaRow {
  return {
    id: disciplina.id,
    obra_id: disciplina.obraId,
    nome: disciplina.nome,
    responsavel: disciplina.responsavel,
    meta: disciplina.meta,
    produtividade: disciplina.produtividade,
    proximo_passo: disciplina.proximoPasso,
  };
}

function fromDisciplinaRow(row: DisciplinaRow): Disciplina {
  return {
    id: row.id,
    obraId: row.obra_id,
    nome: row.nome,
    responsavel: row.responsavel,
    meta: numberValue(row.meta, 100),
    produtividade: numberValue(row.produtividade, 1),
    proximoPasso: row.proximo_passo,
  };
}

function toItemControleRow(item: ItemControle): ItemControleRow {
  return {
    id: item.id,
    obra_id: item.obraId,
    codigo: item.codigo,
    nome: item.nome,
    disciplina_id: item.disciplinaId,
    orcamento_previsto: item.orcamentoPrevisto,
    tendencia_custo: item.tendenciaCusto,
    status: item.status,
    data_prevista: item.dataPrevista,
    responsavel: item.responsavel,
    avanco_fisico: item.avancoFisico,
  };
}

function fromItemControleRow(row: ItemControleRow): ItemControle {
  return {
    id: row.id,
    obraId: row.obra_id,
    codigo: row.codigo,
    nome: row.nome,
    disciplinaId: row.disciplina_id,
    orcamentoPrevisto: numberValue(row.orcamento_previsto),
    tendenciaCusto: numberValue(row.tendencia_custo),
    status: row.status,
    dataPrevista: dateValue(row.data_prevista),
    responsavel: row.responsavel,
    avancoFisico: numberValue(row.avanco_fisico),
  };
}

function toPendenciaRow(pendencia: Pendencia): PendenciaRow {
  return {
    id: pendencia.id,
    obra_id: pendencia.obraId,
    tipo: pendencia.tipo,
    disciplina_id: pendencia.disciplinaId,
    descricao: pendencia.descricao,
    responsavel: pendencia.responsavel,
    prazo: pendencia.prazo,
    impacto: pendencia.impacto,
    status: pendencia.status,
    prioridade: pendencia.prioridade,
  };
}

function fromPendenciaRow(row: PendenciaRow): Pendencia {
  return {
    id: row.id,
    obraId: row.obra_id,
    tipo: row.tipo,
    disciplinaId: row.disciplina_id,
    descricao: row.descricao,
    responsavel: row.responsavel,
    prazo: dateValue(row.prazo),
    impacto: row.impacto,
    status: row.status,
    prioridade: row.prioridade,
  };
}

function toDiarioRow(diario: Diario): DiarioRow {
  return {
    id: diario.id,
    obra_id: diario.obraId,
    data: diario.data,
    disciplina_id: diario.disciplinaId,
    item_controle_id: diario.itemControleId,
    atividade: diario.atividade,
    meta_dia: diario.metaDia,
    realizado_dia: diario.realizadoDia,
    equipe: diario.equipe,
    hh: diario.hh,
    restricao: diario.restricao,
    status_dia: diario.statusDia,
    avanco_item: diario.avancoItem,
    plano_seguinte: diario.planoSeguinte,
    observacoes: diario.observacoes,
  };
}

function fromDiarioRow(row: DiarioRow): Diario {
  return {
    id: row.id,
    obraId: row.obra_id,
    data: dateValue(row.data),
    disciplinaId: row.disciplina_id,
    itemControleId: row.item_controle_id,
    atividade: row.atividade,
    metaDia: row.meta_dia,
    realizadoDia: row.realizado_dia,
    equipe: numberValue(row.equipe),
    hh: numberValue(row.hh),
    restricao: row.restricao,
    statusDia: row.status_dia,
    avancoItem: numberValue(row.avanco_item),
    planoSeguinte: row.plano_seguinte,
    observacoes: row.observacoes,
  };
}

async function upsertRows(table: string, rows: unknown[]) {
  if (rows.length === 0) return;

  await supabaseRequest(`${table}?on_conflict=id`, {
    method: "POST",
    body: JSON.stringify(rows),
    headers: {
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
  });
}

async function deleteById(table: string, id: string) {
  await supabaseRequest(`${table}?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      Prefer: "return=minimal",
    },
  });
}

export async function loadRemoteData(): Promise<PietraData | null> {
  const [settingsRows, obrasRows, disciplinasRows, itensRows, pendenciasRows, diariosRows] =
    await Promise.all([
      supabaseRequest<SettingsRow[]>("pietra_settings?select=*"),
      supabaseRequest<ObraRow[]>("obras?select=*&order=nome.asc"),
      supabaseRequest<DisciplinaRow[]>("disciplinas?select=*&order=nome.asc"),
      supabaseRequest<ItemControleRow[]>("itens_controle?select=*&order=codigo.asc"),
      supabaseRequest<PendenciaRow[]>("pendencias?select=*&order=prazo.asc"),
      supabaseRequest<DiarioRow[]>("diarios?select=*&order=data.desc"),
    ]);

  const obras = obrasRows.map(fromObraRow);
  if (obras.length === 0) return null;

  const activeObraId =
    settingsRows[0]?.active_obra_id &&
    obras.some((obra) => obra.id === settingsRows[0].active_obra_id)
      ? settingsRows[0].active_obra_id
      : obras[0].id;
  const updatedAt =
    settingsRows[0]?.updated_at ??
    [...obrasRows, ...disciplinasRows, ...itensRows, ...pendenciasRows, ...diariosRows].find(
      (row) => row.updated_at,
    )?.updated_at ??
    demoData.updatedAt;

  return {
    activeObraId,
    obras,
    disciplinas: disciplinasRows.map(fromDisciplinaRow),
    itensControle: itensRows.map(fromItemControleRow),
    pendencias: pendenciasRows.map(fromPendenciaRow),
    diarios: diariosRows.map(fromDiarioRow),
    updatedAt,
  };
}

export async function seedRemoteIfEmpty(seedData: PietraData) {
  const remoteData = await loadRemoteData();
  if (remoteData) return remoteData;

  await replaceRemoteData(seedData);
  return seedData;
}

export async function replaceRemoteData(data: PietraData) {
  await supabaseRequest("diarios?id=not.is.null", {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  });
  await supabaseRequest("pendencias?id=not.is.null", {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  });
  await supabaseRequest("itens_controle?id=not.is.null", {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  });
  await supabaseRequest("disciplinas?id=not.is.null", {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  });
  await supabaseRequest("obras?id=not.is.null", {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  });

  await upsertRows("obras", data.obras.map(toObraRow));
  await upsertRows("disciplinas", data.disciplinas.map(toDisciplinaRow));
  await upsertRows("itens_controle", data.itensControle.map(toItemControleRow));
  await upsertRows("pendencias", data.pendencias.map(toPendenciaRow));
  await upsertRows("diarios", data.diarios.map(toDiarioRow));
  await saveRemoteActiveObra(data.activeObraId);
}

export async function saveRemoteActiveObra(obraId: string) {
  await upsertRows("pietra_settings", [{ id: "default", active_obra_id: obraId }]);
}

export async function saveRemoteObra(obra: Obra) {
  await upsertRows("obras", [toObraRow(obra)]);
}

export async function deleteRemoteObra(obraId: string) {
  await deleteById("obras", obraId);
}

export async function saveRemoteDisciplina(disciplina: Disciplina) {
  await upsertRows("disciplinas", [toDisciplinaRow(disciplina)]);
}

export async function deleteRemoteDisciplina(disciplinaId: string) {
  await deleteById("disciplinas", disciplinaId);
}

export async function saveRemoteItemControle(item: ItemControle) {
  await upsertRows("itens_controle", [toItemControleRow(item)]);
}

export async function deleteRemoteItemControle(itemId: string) {
  await deleteById("itens_controle", itemId);
}

export async function saveRemotePendencia(pendencia: Pendencia) {
  await upsertRows("pendencias", [toPendenciaRow(pendencia)]);
}

export async function deleteRemotePendencia(pendenciaId: string) {
  await deleteById("pendencias", pendenciaId);
}

export async function saveRemoteDiario(diario: Diario) {
  await upsertRows("diarios", [toDiarioRow(diario)]);
}

export async function deleteRemoteDiario(diarioId: string) {
  await deleteById("diarios", diarioId);
}
