// Mock dataset — Obra Bella Pietra
export type StatusSemaforo = "ok" | "atencao" | "critico";

export const obra = {
  nome: "Bella Pietra",
  endereco: "Rua das Acácias, 1240 — Jardim Europa",
  inicio: "10/03/2025",
  prazoPrevisto: "28/02/2027",
  cliente: "Pietra Empreendimentos",
  responsavel: "Eng. Marcos Andrade",
  orcamentoPrevisto: 42_800_000,
  orcamentoTendencia: 43_650_000,
  realizado: 18_120_000,
  avancoFisico: 38.4,
  avancoPlanejado: 42.1,
  desvioPrazoDias: 12,
  desvioCusto: 1.98,
};

export type Disciplina = {
  id: string;
  nome: string;
  responsavel: string;
  meta: number;
  realizado: number;
  produtividade: number;
  pendencias: number;
  status: StatusSemaforo;
  proximoPasso: string;
};

export const disciplinas: Disciplina[] = [
  { id: "estrut", nome: "Estrutura", responsavel: "Eng. R. Lima", meta: 100, realizado: 92, produtividade: 1.04, pendencias: 2, status: "ok", proximoPasso: "Concretagem laje cobertura — 18/05" },
  { id: "alven", nome: "Alvenaria", responsavel: "Mestre Jorge", meta: 100, realizado: 71, produtividade: 0.88, pendencias: 4, status: "atencao", proximoPasso: "Liberar pavto 5 e 6" },
  { id: "instal-h", nome: "Instalações Hidráulicas", responsavel: "Eng. C. Souza", meta: 100, realizado: 48, produtividade: 0.76, pendencias: 6, status: "critico", proximoPasso: "Decisão sobre fornecedor PEX" },
  { id: "instal-e", nome: "Instalações Elétricas", responsavel: "Eng. P. Tavares", meta: 100, realizado: 55, produtividade: 0.91, pendencias: 3, status: "atencao", proximoPasso: "Aprovar projeto de SPDA revisado" },
  { id: "fachada", nome: "Fachada", responsavel: "Arq. L. Ferri", meta: 100, realizado: 18, produtividade: 1.0, pendencias: 1, status: "ok", proximoPasso: "Mock-up de revestimento — 22/05" },
  { id: "acabam", nome: "Acabamentos", responsavel: "Mestre Aldo", meta: 100, realizado: 9, produtividade: 1.0, pendencias: 0, status: "ok", proximoPasso: "Início após alvenaria pavto 4" },
  { id: "impermz", nome: "Impermeabilização", responsavel: "Eng. R. Lima", meta: 100, realizado: 62, produtividade: 0.83, pendencias: 2, status: "atencao", proximoPasso: "Teste de estanqueidade pavto 3" },
  { id: "elevador", nome: "Elevadores", responsavel: "Atlas Schindler", meta: 100, realizado: 25, produtividade: 1.0, pendencias: 1, status: "ok", proximoPasso: "Entrega de guias — 02/06" },
];

export type Pendencia = {
  id: string;
  tipo: "Restrição" | "RFI" | "Mudança" | "Risco" | "Issue" | "Decisão";
  disciplina: string;
  descricao: string;
  responsavel: string;
  prazo: string;
  impacto: "Alto" | "Médio" | "Baixo";
  status: "Aberta" | "Em análise" | "Resolvida";
  prioridade: "P1" | "P2" | "P3";
};

export const pendencias: Pendencia[] = [
  { id: "PD-0042", tipo: "Decisão", disciplina: "Instalações Hidráulicas", descricao: "Definir fornecedor de tubulação PEX (3 propostas em análise)", responsavel: "Proprietário", prazo: "16/05/2026", impacto: "Alto", status: "Aberta", prioridade: "P1" },
  { id: "PD-0041", tipo: "RFI", disciplina: "Estrutura", descricao: "Detalhamento de armadura no balanço da varanda — eixo C/4", responsavel: "Projetista estrutural", prazo: "12/05/2026", impacto: "Médio", status: "Em análise", prioridade: "P2" },
  { id: "PD-0040", tipo: "Mudança", disciplina: "Fachada", descricao: "Substituição de revestimento cerâmico por painel ACM nos pavtos 6-8", responsavel: "Arq. L. Ferri", prazo: "20/05/2026", impacto: "Alto", status: "Aberta", prioridade: "P1" },
  { id: "PD-0039", tipo: "Restrição", disciplina: "Alvenaria", descricao: "Falta de bloco cerâmico 14x19x29 — pedido em atraso", responsavel: "Suprimentos", prazo: "10/05/2026", impacto: "Alto", status: "Aberta", prioridade: "P1" },
  { id: "PD-0038", tipo: "Risco", disciplina: "Instalações Elétricas", descricao: "Concessionária pode atrasar entrada de energia definitiva em 30 dias", responsavel: "Eng. P. Tavares", prazo: "30/06/2026", impacto: "Alto", status: "Em análise", prioridade: "P2" },
  { id: "PD-0037", tipo: "Issue", disciplina: "Impermeabilização", descricao: "Vazamento detectado no reservatório inferior após teste", responsavel: "Eng. R. Lima", prazo: "09/05/2026", impacto: "Médio", status: "Em análise", prioridade: "P2" },
  { id: "PD-0036", tipo: "Decisão", disciplina: "Acabamentos", descricao: "Aprovação do padrão de porcelanato áreas comuns", responsavel: "Proprietário", prazo: "25/05/2026", impacto: "Médio", status: "Aberta", prioridade: "P2" },
  { id: "PD-0035", tipo: "RFI", disciplina: "Instalações Hidráulicas", descricao: "Posicionamento de prumadas de gás — pavto técnico", responsavel: "Projetista hidráulico", prazo: "14/05/2026", impacto: "Baixo", status: "Em análise", prioridade: "P3" },
  { id: "PD-0034", tipo: "Restrição", disciplina: "Elevadores", descricao: "Espera entrega das guias do elevador social", responsavel: "Atlas Schindler", prazo: "02/06/2026", impacto: "Médio", status: "Aberta", prioridade: "P2" },
  { id: "PD-0033", tipo: "Mudança", disciplina: "Instalações Elétricas", descricao: "Inclusão de carregadores veiculares na garagem (12 vagas)", responsavel: "Eng. P. Tavares", prazo: "28/05/2026", impacto: "Médio", status: "Em análise", prioridade: "P2" },
];

export type ItemControle = {
  codigo: string;
  nome: string;
  disciplina: string;
  orcamento: number;
  tendencia: number;
  status: StatusSemaforo;
  dataPrevista: string;
  responsavel: string;
  avanco: number;
};

export const itensControle: ItemControle[] = [
  { codigo: "IC-1.01", nome: "Fundação — Estacas hélice contínua", disciplina: "Estrutura", orcamento: 2_180_000, tendencia: 2_175_000, status: "ok", dataPrevista: "15/06/2025", responsavel: "Eng. R. Lima", avanco: 100 },
  { codigo: "IC-1.02", nome: "Estrutura — Pavtos subsolo a 4", disciplina: "Estrutura", orcamento: 6_420_000, tendencia: 6_510_000, status: "ok", dataPrevista: "30/04/2026", responsavel: "Eng. R. Lima", avanco: 92 },
  { codigo: "IC-1.03", nome: "Estrutura — Pavtos 5 a cobertura", disciplina: "Estrutura", orcamento: 4_180_000, tendencia: 4_180_000, status: "ok", dataPrevista: "10/08/2026", responsavel: "Eng. R. Lima", avanco: 35 },
  { codigo: "IC-2.01", nome: "Alvenaria de vedação — Torre", disciplina: "Alvenaria", orcamento: 1_950_000, tendencia: 2_020_000, status: "atencao", dataPrevista: "20/09/2026", responsavel: "Mestre Jorge", avanco: 71 },
  { codigo: "IC-3.01", nome: "Hidráulica — Prumadas e shafts", disciplina: "Instalações Hidráulicas", orcamento: 2_320_000, tendencia: 2_540_000, status: "critico", dataPrevista: "05/11/2026", responsavel: "Eng. C. Souza", avanco: 48 },
  { codigo: "IC-3.02", nome: "Hidráulica — Reservatórios e bombeamento", disciplina: "Instalações Hidráulicas", orcamento: 980_000, tendencia: 990_000, status: "atencao", dataPrevista: "30/07/2026", responsavel: "Eng. C. Souza", avanco: 55 },
  { codigo: "IC-4.01", nome: "Elétrica — Infra e quadros", disciplina: "Instalações Elétricas", orcamento: 2_640_000, tendencia: 2_720_000, status: "atencao", dataPrevista: "20/10/2026", responsavel: "Eng. P. Tavares", avanco: 55 },
  { codigo: "IC-5.01", nome: "Fachada — Revestimento e ACM", disciplina: "Fachada", orcamento: 3_850_000, tendencia: 4_120_000, status: "ok", dataPrevista: "15/12/2026", responsavel: "Arq. L. Ferri", avanco: 18 },
  { codigo: "IC-6.01", nome: "Impermeabilização geral", disciplina: "Impermeabilização", orcamento: 720_000, tendencia: 740_000, status: "atencao", dataPrevista: "10/09/2026", responsavel: "Eng. R. Lima", avanco: 62 },
  { codigo: "IC-7.01", nome: "Acabamentos internos — Apartamentos", disciplina: "Acabamentos", orcamento: 8_650_000, tendencia: 8_820_000, status: "ok", dataPrevista: "30/01/2027", responsavel: "Mestre Aldo", avanco: 9 },
  { codigo: "IC-7.02", nome: "Acabamentos áreas comuns", disciplina: "Acabamentos", orcamento: 2_180_000, tendencia: 2_180_000, status: "ok", dataPrevista: "15/02/2027", responsavel: "Mestre Aldo", avanco: 5 },
  { codigo: "IC-8.01", nome: "Elevadores — Fornecimento e montagem", disciplina: "Elevadores", orcamento: 1_420_000, tendencia: 1_420_000, status: "ok", dataPrevista: "20/12/2026", responsavel: "Atlas Schindler", avanco: 25 },
];

export type Diario = {
  id: string;
  data: string;
  disciplina: string;
  itemControle: string;
  atividade: string;
  metaDia: string;
  realizadoDia: string;
  equipe: number;
  hh: number;
  restricao: string;
  statusDia: StatusSemaforo;
  planoSeguinte: string;
  observacoes: string;
};

export const diarios: Diario[] = [
  { id: "DC-220", data: "08/05/2026", disciplina: "Estrutura", itemControle: "IC-1.03", atividade: "Armação de pilares pavto 6", metaDia: "8 pilares", realizadoDia: "7 pilares", equipe: 12, hh: 96, restricao: "Atraso na entrega de aço CA-50", statusDia: "atencao", planoSeguinte: "Concretagem dos 7 pilares + armar laje", observacoes: "Chuva forte às 15h interrompeu serviço por 1h" },
  { id: "DC-219", data: "07/05/2026", disciplina: "Alvenaria", itemControle: "IC-2.01", atividade: "Elevação alvenaria pavto 4", metaDia: "180 m²", realizadoDia: "142 m²", equipe: 8, hh: 64, restricao: "Falta de blocos 14x19x29", statusDia: "critico", planoSeguinte: "Aguardar entrega blocos prevista 09/05", observacoes: "Acionado suprimentos com prioridade" },
  { id: "DC-218", data: "07/05/2026", disciplina: "Instalações Hidráulicas", itemControle: "IC-3.01", atividade: "Prumada AF eixo D", metaDia: "1 prumada completa", realizadoDia: "1 prumada", equipe: 4, hh: 32, restricao: "—", statusDia: "ok", planoSeguinte: "Prumada AQ eixo D", observacoes: "Sem ocorrências" },
  { id: "DC-217", data: "06/05/2026", disciplina: "Instalações Elétricas", itemControle: "IC-4.01", atividade: "Eletrodutos laje pavto 5", metaDia: "1 laje completa", realizadoDia: "0,8 laje", equipe: 6, hh: 48, restricao: "Interferência com hidráulica", statusDia: "atencao", planoSeguinte: "Concluir trecho restante e iniciar pavto 6", observacoes: "Reunião de compatibilização agendada" },
  { id: "DC-216", data: "06/05/2026", disciplina: "Impermeabilização", itemControle: "IC-6.01", atividade: "Manta asfáltica reservatório inferior", metaDia: "120 m²", realizadoDia: "120 m²", equipe: 3, hh: 24, restricao: "—", statusDia: "ok", planoSeguinte: "Teste de estanqueidade após 72h", observacoes: "Aplicação conforme especificação" },
];

export const proximosPassos = [
  { data: "12/05", texto: "Resposta RFI armadura varanda eixo C/4", responsavel: "Projetista estrutural" },
  { data: "16/05", texto: "DECISÃO: Fornecedor de tubulação PEX", responsavel: "Proprietário" },
  { data: "18/05", texto: "Concretagem laje cobertura — Estrutura", responsavel: "Eng. R. Lima" },
  { data: "20/05", texto: "Definir mudança fachada ACM pavtos 6-8", responsavel: "Proprietário + Arq." },
  { data: "22/05", texto: "Mock-up revestimento de fachada", responsavel: "Arq. L. Ferri" },
];

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const formatPct = (v: number) => `${v.toFixed(1)}%`;
