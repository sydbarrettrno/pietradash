export const PIETRA_OWNER_NAME = "Eng. Anibal Nisgoski";
export const PIETRA_OWNER_ROLE = "Engenheiro responsável";
export const PIETRA_OWNER_INITIALS = "AN";
export const PIETRA_CREDIT = "Desenvolvido por Eng. Anibal Nisgoski - 2026";

export type StatusSemaforo = "ok" | "atencao" | "critico";

export type Obra = {
  id: string;
  nome: string;
  endereco: string;
  inicio: string;
  prazoPrevisto: string;
  cliente: string;
  responsavel: string;
  avancoPlanejado: number;
  desvioPrazoDias: number;
};

export type Disciplina = {
  id: string;
  obraId: string;
  nome: string;
  responsavel: string;
  meta: number;
  produtividade: number;
  proximoPasso: string;
};

export type TipoPendencia = "Restrição" | "RFI" | "Mudança" | "Risco" | "Issue" | "Decisão";
export type ImpactoPendencia = "Alto" | "Médio" | "Baixo";
export type StatusPendencia = "Aberta" | "Em análise" | "Resolvida";
export type PrioridadePendencia = "P1" | "P2" | "P3";

export type Pendencia = {
  id: string;
  obraId: string;
  tipo: TipoPendencia;
  disciplinaId: string;
  descricao: string;
  responsavel: string;
  prazo: string;
  impacto: ImpactoPendencia;
  status: StatusPendencia;
  prioridade: PrioridadePendencia;
};

export type ItemControle = {
  id: string;
  obraId: string;
  codigo: string;
  nome: string;
  disciplinaId: string;
  orcamentoPrevisto: number;
  tendenciaCusto: number;
  status: StatusSemaforo;
  dataPrevista: string;
  responsavel: string;
  avancoFisico: number;
};

export type Diario = {
  id: string;
  obraId: string;
  data: string;
  disciplinaId: string;
  itemControleId: string;
  atividade: string;
  metaDia: string;
  realizadoDia: string;
  equipe: number;
  hh: number;
  restricao: string;
  statusDia: StatusSemaforo;
  avancoItem: number;
  planoSeguinte: string;
  observacoes: string;
};

export type PietraData = {
  activeObraId: string;
  obras: Obra[];
  disciplinas: Disciplina[];
  itensControle: ItemControle[];
  pendencias: Pendencia[];
  diarios: Diario[];
  updatedAt: string;
};

export type DisciplinaResumo = Disciplina & {
  realizado: number;
  pendencias: number;
  pendenciasCriticas: number;
  status: StatusSemaforo;
  itens: ItemControle[];
  bloqueios: Pendencia[];
  diariosRecentes: Diario[];
  producao: {
    registros: number;
    equipe: number;
    hh: number;
  };
};

export type ObraMetricas = {
  orcamentoPrevisto: number;
  orcamentoTendencia: number;
  realizado: number;
  desvioCustoValor: number;
  desvioCusto: number;
  avancoFisico: number;
  avancoPlanejado: number;
  desvioPrazoDias: number;
  pendenciasAbertas: number;
  pendenciasCriticas: number;
  decisoesPendentes: number;
  statusGeral: StatusSemaforo;
};

const obraId = "obra-bella-pietra";

export const demoData: PietraData = {
  activeObraId: obraId,
  updatedAt: "2026-05-08T18:42:00.000Z",
  obras: [
    {
      id: obraId,
      nome: "Bella Pietra",
      endereco: "Rua das Acácias, 1240 - Jardim Europa",
      inicio: "2025-03-10",
      prazoPrevisto: "2027-02-28",
      cliente: "Pietra Empreendimentos",
      responsavel: PIETRA_OWNER_NAME,
      avancoPlanejado: 42.1,
      desvioPrazoDias: 12,
    },
  ],
  disciplinas: [
    {
      id: "disc-estrut",
      obraId,
      nome: "Estrutura",
      responsavel: "Eng. R. Lima",
      meta: 100,
      produtividade: 1.04,
      proximoPasso: "Concretagem laje cobertura - 18/05",
    },
    {
      id: "disc-alven",
      obraId,
      nome: "Alvenaria",
      responsavel: "Mestre Jorge",
      meta: 100,
      produtividade: 0.88,
      proximoPasso: "Liberar pavimentos 5 e 6",
    },
    {
      id: "disc-hid",
      obraId,
      nome: "Instalações Hidráulicas",
      responsavel: "Eng. C. Souza",
      meta: 100,
      produtividade: 0.76,
      proximoPasso: "Decisão sobre fornecedor PEX",
    },
    {
      id: "disc-ele",
      obraId,
      nome: "Instalações Elétricas",
      responsavel: "Eng. P. Tavares",
      meta: 100,
      produtividade: 0.91,
      proximoPasso: "Aprovar projeto de SPDA revisado",
    },
    {
      id: "disc-fachada",
      obraId,
      nome: "Fachada",
      responsavel: "Arq. L. Ferri",
      meta: 100,
      produtividade: 1,
      proximoPasso: "Mock-up de revestimento - 22/05",
    },
    {
      id: "disc-acab",
      obraId,
      nome: "Acabamentos",
      responsavel: "Mestre Aldo",
      meta: 100,
      produtividade: 1,
      proximoPasso: "Início após alvenaria do pavimento 4",
    },
    {
      id: "disc-imperm",
      obraId,
      nome: "Impermeabilização",
      responsavel: "Eng. R. Lima",
      meta: 100,
      produtividade: 0.83,
      proximoPasso: "Teste de estanqueidade pavimento 3",
    },
    {
      id: "disc-elev",
      obraId,
      nome: "Elevadores",
      responsavel: "Atlas Schindler",
      meta: 100,
      produtividade: 1,
      proximoPasso: "Entrega de guias - 02/06",
    },
  ],
  itensControle: [
    {
      id: "item-ic-101",
      obraId,
      codigo: "IC-1.01",
      nome: "Fundação - Estacas hélice contínua",
      disciplinaId: "disc-estrut",
      orcamentoPrevisto: 2_180_000,
      tendenciaCusto: 2_175_000,
      status: "ok",
      dataPrevista: "2025-06-15",
      responsavel: "Eng. R. Lima",
      avancoFisico: 100,
    },
    {
      id: "item-ic-102",
      obraId,
      codigo: "IC-1.02",
      nome: "Estrutura - Pavimentos subsolo a 4",
      disciplinaId: "disc-estrut",
      orcamentoPrevisto: 6_420_000,
      tendenciaCusto: 6_510_000,
      status: "ok",
      dataPrevista: "2026-04-30",
      responsavel: "Eng. R. Lima",
      avancoFisico: 92,
    },
    {
      id: "item-ic-103",
      obraId,
      codigo: "IC-1.03",
      nome: "Estrutura - Pavimentos 5 a cobertura",
      disciplinaId: "disc-estrut",
      orcamentoPrevisto: 4_180_000,
      tendenciaCusto: 4_180_000,
      status: "ok",
      dataPrevista: "2026-08-10",
      responsavel: "Eng. R. Lima",
      avancoFisico: 35,
    },
    {
      id: "item-ic-201",
      obraId,
      codigo: "IC-2.01",
      nome: "Alvenaria de vedação - Torre",
      disciplinaId: "disc-alven",
      orcamentoPrevisto: 1_950_000,
      tendenciaCusto: 2_020_000,
      status: "atencao",
      dataPrevista: "2026-09-20",
      responsavel: "Mestre Jorge",
      avancoFisico: 71,
    },
    {
      id: "item-ic-301",
      obraId,
      codigo: "IC-3.01",
      nome: "Hidráulica - Prumadas e shafts",
      disciplinaId: "disc-hid",
      orcamentoPrevisto: 2_320_000,
      tendenciaCusto: 2_540_000,
      status: "critico",
      dataPrevista: "2026-11-05",
      responsavel: "Eng. C. Souza",
      avancoFisico: 48,
    },
    {
      id: "item-ic-302",
      obraId,
      codigo: "IC-3.02",
      nome: "Hidráulica - Reservatórios e bombeamento",
      disciplinaId: "disc-hid",
      orcamentoPrevisto: 980_000,
      tendenciaCusto: 990_000,
      status: "atencao",
      dataPrevista: "2026-07-30",
      responsavel: "Eng. C. Souza",
      avancoFisico: 55,
    },
    {
      id: "item-ic-401",
      obraId,
      codigo: "IC-4.01",
      nome: "Elétrica - Infraestrutura e quadros",
      disciplinaId: "disc-ele",
      orcamentoPrevisto: 2_640_000,
      tendenciaCusto: 2_720_000,
      status: "atencao",
      dataPrevista: "2026-10-20",
      responsavel: "Eng. P. Tavares",
      avancoFisico: 55,
    },
    {
      id: "item-ic-501",
      obraId,
      codigo: "IC-5.01",
      nome: "Fachada - Revestimento e ACM",
      disciplinaId: "disc-fachada",
      orcamentoPrevisto: 3_850_000,
      tendenciaCusto: 4_120_000,
      status: "ok",
      dataPrevista: "2026-12-15",
      responsavel: "Arq. L. Ferri",
      avancoFisico: 18,
    },
    {
      id: "item-ic-601",
      obraId,
      codigo: "IC-6.01",
      nome: "Impermeabilização geral",
      disciplinaId: "disc-imperm",
      orcamentoPrevisto: 720_000,
      tendenciaCusto: 740_000,
      status: "atencao",
      dataPrevista: "2026-09-10",
      responsavel: "Eng. R. Lima",
      avancoFisico: 62,
    },
    {
      id: "item-ic-701",
      obraId,
      codigo: "IC-7.01",
      nome: "Acabamentos internos - Apartamentos",
      disciplinaId: "disc-acab",
      orcamentoPrevisto: 8_650_000,
      tendenciaCusto: 8_820_000,
      status: "ok",
      dataPrevista: "2027-01-30",
      responsavel: "Mestre Aldo",
      avancoFisico: 9,
    },
    {
      id: "item-ic-702",
      obraId,
      codigo: "IC-7.02",
      nome: "Acabamentos áreas comuns",
      disciplinaId: "disc-acab",
      orcamentoPrevisto: 2_180_000,
      tendenciaCusto: 2_180_000,
      status: "ok",
      dataPrevista: "2027-02-15",
      responsavel: "Mestre Aldo",
      avancoFisico: 5,
    },
    {
      id: "item-ic-801",
      obraId,
      codigo: "IC-8.01",
      nome: "Elevadores - Fornecimento e montagem",
      disciplinaId: "disc-elev",
      orcamentoPrevisto: 1_420_000,
      tendenciaCusto: 1_420_000,
      status: "ok",
      dataPrevista: "2026-12-20",
      responsavel: "Atlas Schindler",
      avancoFisico: 25,
    },
  ],
  pendencias: [
    {
      id: "PD-0042",
      obraId,
      tipo: "Decisão",
      disciplinaId: "disc-hid",
      descricao: "Definir fornecedor de tubulação PEX (3 propostas em análise)",
      responsavel: "Proprietário",
      prazo: "2026-05-16",
      impacto: "Alto",
      status: "Aberta",
      prioridade: "P1",
    },
    {
      id: "PD-0041",
      obraId,
      tipo: "RFI",
      disciplinaId: "disc-estrut",
      descricao: "Detalhamento de armadura no balanço da varanda - eixo C/4",
      responsavel: "Projetista estrutural",
      prazo: "2026-05-12",
      impacto: "Médio",
      status: "Em análise",
      prioridade: "P2",
    },
    {
      id: "PD-0040",
      obraId,
      tipo: "Mudança",
      disciplinaId: "disc-fachada",
      descricao: "Substituição de revestimento cerâmico por painel ACM nos pavimentos 6-8",
      responsavel: "Arq. L. Ferri",
      prazo: "2026-05-20",
      impacto: "Alto",
      status: "Aberta",
      prioridade: "P1",
    },
    {
      id: "PD-0039",
      obraId,
      tipo: "Restrição",
      disciplinaId: "disc-alven",
      descricao: "Falta de bloco cerâmico 14x19x29 - pedido em atraso",
      responsavel: "Suprimentos",
      prazo: "2026-05-10",
      impacto: "Alto",
      status: "Aberta",
      prioridade: "P1",
    },
    {
      id: "PD-0038",
      obraId,
      tipo: "Risco",
      disciplinaId: "disc-ele",
      descricao: "Concessionária pode atrasar entrada de energia definitiva em 30 dias",
      responsavel: "Eng. P. Tavares",
      prazo: "2026-06-30",
      impacto: "Alto",
      status: "Em análise",
      prioridade: "P2",
    },
    {
      id: "PD-0037",
      obraId,
      tipo: "Issue",
      disciplinaId: "disc-imperm",
      descricao: "Vazamento detectado no reservatório inferior após teste",
      responsavel: "Eng. R. Lima",
      prazo: "2026-05-09",
      impacto: "Médio",
      status: "Em análise",
      prioridade: "P2",
    },
    {
      id: "PD-0036",
      obraId,
      tipo: "Decisão",
      disciplinaId: "disc-acab",
      descricao: "Aprovação do padrão de porcelanato das áreas comuns",
      responsavel: "Proprietário",
      prazo: "2026-05-25",
      impacto: "Médio",
      status: "Aberta",
      prioridade: "P2",
    },
    {
      id: "PD-0035",
      obraId,
      tipo: "RFI",
      disciplinaId: "disc-hid",
      descricao: "Posicionamento de prumadas de gás - pavimento técnico",
      responsavel: "Projetista hidráulico",
      prazo: "2026-05-14",
      impacto: "Baixo",
      status: "Em análise",
      prioridade: "P3",
    },
    {
      id: "PD-0034",
      obraId,
      tipo: "Restrição",
      disciplinaId: "disc-elev",
      descricao: "Espera entrega das guias do elevador social",
      responsavel: "Atlas Schindler",
      prazo: "2026-06-02",
      impacto: "Médio",
      status: "Aberta",
      prioridade: "P2",
    },
    {
      id: "PD-0033",
      obraId,
      tipo: "Mudança",
      disciplinaId: "disc-ele",
      descricao: "Inclusão de carregadores veiculares na garagem (12 vagas)",
      responsavel: "Eng. P. Tavares",
      prazo: "2026-05-28",
      impacto: "Médio",
      status: "Em análise",
      prioridade: "P2",
    },
  ],
  diarios: [
    {
      id: "DC-220",
      obraId,
      data: "2026-05-08",
      disciplinaId: "disc-estrut",
      itemControleId: "item-ic-103",
      atividade: "Armação de pilares pavimento 6",
      metaDia: "8 pilares",
      realizadoDia: "7 pilares",
      equipe: 12,
      hh: 96,
      restricao: "Atraso na entrega de aço CA-50",
      statusDia: "atencao",
      avancoItem: 35,
      planoSeguinte: "Concretagem dos 7 pilares e armação de laje",
      observacoes: "Chuva forte às 15h interrompeu serviço por 1h.",
    },
    {
      id: "DC-219",
      obraId,
      data: "2026-05-07",
      disciplinaId: "disc-alven",
      itemControleId: "item-ic-201",
      atividade: "Elevação alvenaria pavimento 4",
      metaDia: "180 m²",
      realizadoDia: "142 m²",
      equipe: 8,
      hh: 64,
      restricao: "Falta de blocos 14x19x29",
      statusDia: "critico",
      avancoItem: 71,
      planoSeguinte: "Aguardar entrega de blocos prevista para 09/05",
      observacoes: "Suprimentos acionado com prioridade.",
    },
    {
      id: "DC-218",
      obraId,
      data: "2026-05-07",
      disciplinaId: "disc-hid",
      itemControleId: "item-ic-301",
      atividade: "Prumada AF eixo D",
      metaDia: "1 prumada completa",
      realizadoDia: "1 prumada",
      equipe: 4,
      hh: 32,
      restricao: "Sem restrição",
      statusDia: "ok",
      avancoItem: 48,
      planoSeguinte: "Prumada AQ eixo D",
      observacoes: "Sem ocorrências.",
    },
    {
      id: "DC-217",
      obraId,
      data: "2026-05-06",
      disciplinaId: "disc-ele",
      itemControleId: "item-ic-401",
      atividade: "Eletrodutos laje pavimento 5",
      metaDia: "1 laje completa",
      realizadoDia: "0,8 laje",
      equipe: 6,
      hh: 48,
      restricao: "Interferência com hidráulica",
      statusDia: "atencao",
      avancoItem: 55,
      planoSeguinte: "Concluir trecho restante e iniciar pavimento 6",
      observacoes: "Reunião de compatibilização agendada.",
    },
    {
      id: "DC-216",
      obraId,
      data: "2026-05-06",
      disciplinaId: "disc-imperm",
      itemControleId: "item-ic-601",
      atividade: "Manta asfáltica reservatório inferior",
      metaDia: "120 m²",
      realizadoDia: "120 m²",
      equipe: 3,
      hh: 24,
      restricao: "Sem restrição",
      statusDia: "ok",
      avancoItem: 62,
      planoSeguinte: "Teste de estanqueidade após 72h",
      observacoes: "Aplicação conforme especificação.",
    },
  ],
};

export function getActiveObra(data: PietraData) {
  return data.obras.find((obra) => obra.id === data.activeObraId) ?? data.obras[0];
}

export function getDisciplinasDaObra(data: PietraData, obraId = data.activeObraId) {
  return data.disciplinas.filter((disciplina) => disciplina.obraId === obraId);
}

export function getItensDaObra(data: PietraData, obraId = data.activeObraId) {
  return data.itensControle.filter((item) => item.obraId === obraId);
}

export function getPendenciasDaObra(data: PietraData, obraId = data.activeObraId) {
  return data.pendencias.filter((pendencia) => pendencia.obraId === obraId);
}

export function getDiariosDaObra(data: PietraData, obraId = data.activeObraId) {
  return data.diarios.filter((diario) => diario.obraId === obraId);
}

export function getDisciplinaNome(data: PietraData, disciplinaId: string) {
  return (
    data.disciplinas.find((disciplina) => disciplina.id === disciplinaId)?.nome ?? "Sem disciplina"
  );
}

export function getItemControle(data: PietraData, itemControleId: string) {
  return data.itensControle.find((item) => item.id === itemControleId);
}

export function getItemControleLabel(data: PietraData, itemControleId: string) {
  const item = getItemControle(data, itemControleId);
  return item ? `${item.codigo} - ${item.nome}` : "Sem item de controle";
}

export function getDisciplinaResumos(
  data: PietraData,
  obraId = data.activeObraId,
): DisciplinaResumo[] {
  const itens = getItensDaObra(data, obraId);
  const pendencias = getPendenciasDaObra(data, obraId);
  const diarios = getDiariosDaObra(data, obraId);

  return getDisciplinasDaObra(data, obraId).map((disciplina) => {
    const itensDisciplina = itens.filter((item) => item.disciplinaId === disciplina.id);
    const pendenciasDisciplina = pendencias.filter(
      (pendencia) => pendencia.disciplinaId === disciplina.id,
    );
    const pendenciasAbertas = pendenciasDisciplina.filter(
      (pendencia) => pendencia.status !== "Resolvida",
    );
    const pendenciasCriticas = pendenciasAbertas.filter(
      (pendencia) => pendencia.prioridade === "P1",
    );
    const diariosRecentes = diarios
      .filter((diario) => diario.disciplinaId === disciplina.id)
      .sort((a, b) => b.data.localeCompare(a.data));

    const base = itensDisciplina.reduce((sum, item) => sum + item.orcamentoPrevisto, 0);
    const realizado =
      base > 0
        ? itensDisciplina.reduce(
            (sum, item) => sum + item.avancoFisico * item.orcamentoPrevisto,
            0,
          ) / base
        : 0;

    const hasCritico =
      pendenciasCriticas.length > 0 ||
      itensDisciplina.some((item) => item.status === "critico") ||
      diariosRecentes.slice(0, 3).some((diario) => diario.statusDia === "critico") ||
      disciplina.produtividade < 0.85;
    const hasAtencao =
      pendenciasAbertas.length > 0 ||
      itensDisciplina.some((item) => item.status === "atencao") ||
      diariosRecentes.slice(0, 3).some((diario) => diario.statusDia === "atencao") ||
      disciplina.produtividade < 1;

    return {
      ...disciplina,
      realizado,
      pendencias: pendenciasAbertas.length,
      pendenciasCriticas: pendenciasCriticas.length,
      status: hasCritico ? "critico" : hasAtencao ? "atencao" : "ok",
      itens: itensDisciplina,
      bloqueios: pendenciasAbertas,
      diariosRecentes,
      producao: {
        registros: diariosRecentes.length,
        equipe: diariosRecentes.slice(0, 5).reduce((sum, diario) => sum + diario.equipe, 0),
        hh: diariosRecentes.slice(0, 5).reduce((sum, diario) => sum + diario.hh, 0),
      },
    };
  });
}

export function getObraMetricas(data: PietraData, obraId = data.activeObraId): ObraMetricas {
  const obra = data.obras.find((item) => item.id === obraId) ?? getActiveObra(data);
  const itens = getItensDaObra(data, obraId);
  const pendencias = getPendenciasDaObra(data, obraId);
  const disciplinaResumos = getDisciplinaResumos(data, obraId);
  const orcamentoPrevisto = itens.reduce((sum, item) => sum + item.orcamentoPrevisto, 0);
  const orcamentoTendencia = itens.reduce((sum, item) => sum + item.tendenciaCusto, 0);
  const realizado = itens.reduce(
    (sum, item) => sum + item.orcamentoPrevisto * (item.avancoFisico / 100),
    0,
  );
  const avancoFisico = orcamentoPrevisto > 0 ? (realizado / orcamentoPrevisto) * 100 : 0;
  const desvioCustoValor = orcamentoTendencia - orcamentoPrevisto;
  const desvioCusto = orcamentoPrevisto > 0 ? (desvioCustoValor / orcamentoPrevisto) * 100 : 0;
  const pendenciasAbertas = pendencias.filter((pendencia) => pendencia.status !== "Resolvida");
  const pendenciasCriticas = pendenciasAbertas.filter((pendencia) => pendencia.prioridade === "P1");
  const decisoesPendentes = pendenciasAbertas.filter((pendencia) => pendencia.tipo === "Decisão");
  const statusGeral =
    pendenciasCriticas.length >= 3 ||
    disciplinaResumos.some((disciplina) => disciplina.status === "critico")
      ? "critico"
      : pendenciasAbertas.length > 0 || desvioCusto > 0 || obra.desvioPrazoDias > 0
        ? "atencao"
        : "ok";

  return {
    orcamentoPrevisto,
    orcamentoTendencia,
    realizado,
    desvioCustoValor,
    desvioCusto,
    avancoFisico,
    avancoPlanejado: obra.avancoPlanejado,
    desvioPrazoDias: obra.desvioPrazoDias,
    pendenciasAbertas: pendenciasAbertas.length,
    pendenciasCriticas: pendenciasCriticas.length,
    decisoesPendentes: decisoesPendentes.length,
    statusGeral,
  };
}

export function getProximosPassos(data: PietraData, obraId = data.activeObraId) {
  const pendencias = getPendenciasDaObra(data, obraId)
    .filter((pendencia) => pendencia.status !== "Resolvida")
    .sort((a, b) => a.prazo.localeCompare(b.prazo))
    .slice(0, 5)
    .map((pendencia) => ({
      data: formatShortDate(pendencia.prazo),
      texto:
        pendencia.tipo === "Decisão"
          ? `DECISÃO: ${pendencia.descricao}`
          : `${pendencia.tipo}: ${pendencia.descricao}`,
      responsavel: pendencia.responsavel,
      decisao: pendencia.tipo === "Decisão",
    }));

  return pendencias;
}

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export function formatPct(value: number) {
  return `${value.toFixed(1)}%`;
}

export function formatDateBR(value: string) {
  if (!value) return "";
  const [year, month, day] = value.slice(0, 10).split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

export function formatShortDate(value: string) {
  if (!value) return "";
  const [, month, day] = value.slice(0, 10).split("-");
  if (!month || !day) return value;
  return `${day}/${month}`;
}

export function clampPct(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
}
