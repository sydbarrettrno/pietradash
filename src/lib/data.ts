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
  updatedAt: "2026-05-02T07:40:00.000Z",
  obras: [
    {
      id: obraId,
      nome: "Bella Pietra",
      endereco: "Itapoá/SC - base demonstrativa",
      inicio: "2026-07-01",
      prazoPrevisto: "2027-04-30",
      cliente: "Proprietário do Projeto",
      responsavel: PIETRA_OWNER_NAME,
      avancoPlanejado: 31.8,
      desvioPrazoDias: 9,
    },
  ],
  disciplinas: [
    { id: "disc-mob", obraId, nome: "Mobilização e Canteiro", responsavel: "Anibal", meta: 100, produtividade: 1.03, proximoPasso: "Revisar logística de canteiro e frente de materiais" },
    { id: "disc-fund", obraId, nome: "Fundações", responsavel: "Anibal", meta: 100, produtividade: 0.97, proximoPasso: "Consolidar relatório de execução das estacas" },
    { id: "disc-estrut", obraId, nome: "Estrutura", responsavel: "Anibal", meta: 100, produtividade: 0.92, proximoPasso: "Programar concretagem da próxima laje" },
    { id: "disc-alv", obraId, nome: "Alvenaria e Vedação", responsavel: "Mestre de obras", meta: 100, produtividade: 0.81, proximoPasso: "Regularizar abastecimento de blocos e liberar pavimentos" },
    { id: "disc-ele", obraId, nome: "Instalações Elétricas", responsavel: "Equipe elétrica", meta: 100, produtividade: 0.89, proximoPasso: "Compatibilizar shafts com hidráulica" },
    { id: "disc-hid", obraId, nome: "Instalações Hidrossanitárias", responsavel: "Equipe hidráulica", meta: 100, produtividade: 0.78, proximoPasso: "Definir fornecedor de tubos e conexões críticas" },
    { id: "disc-sist", obraId, nome: "Sistemas Especiais", responsavel: "Terceirizados técnicos", meta: 100, produtividade: 0.95, proximoPasso: "Validar interfaces de PCI, SPDA e GLP" },
    { id: "disc-rev", obraId, nome: "Revestimentos Base", responsavel: "Equipe de revestimento", meta: 100, produtividade: 0.86, proximoPasso: "Liberar frentes de emboço após instalações embutidas" },
    { id: "disc-acab", obraId, nome: "Acabamentos", responsavel: "Equipe de acabamento", meta: 100, produtividade: 1.01, proximoPasso: "Aprovar amostras de piso e pintura" },
    { id: "disc-elev", obraId, nome: "Transporte Vertical", responsavel: "Fornecedor elevadores", meta: 100, produtividade: 1, proximoPasso: "Confirmar entrega de guias e marcos de montagem" },
    { id: "disc-infra", obraId, nome: "Infraestrutura Externa", responsavel: "Equipe externa", meta: 100, produtividade: 0.93, proximoPasso: "Programar drenagem e redes externas" },
    { id: "disc-entrega", obraId, nome: "Entrega e Apoio Final", responsavel: "Coordenação de entrega", meta: 100, produtividade: 1, proximoPasso: "Definir checklist de entrega e limpeza final" },
  ],
  itensControle: [
    { id: "item-001", obraId, codigo: "IC-001", nome: "Canteiro - implantação e instalações provisórias", disciplinaId: "disc-mob", orcamentoPrevisto: 320000, tendenciaCusto: 338000, status: "atencao", dataPrevista: "2026-07-15", responsavel: "Anibal", avancoFisico: 65 },
    { id: "item-002", obraId, codigo: "IC-002", nome: "Canteiro - manutenção e logística de apoio", disciplinaId: "disc-mob", orcamentoPrevisto: 210000, tendenciaCusto: 224000, status: "ok", dataPrevista: "2027-04-15", responsavel: "Anibal", avancoFisico: 28 },
    { id: "item-003", obraId, codigo: "IC-003", nome: "Fundações - estacas e blocos", disciplinaId: "disc-fund", orcamentoPrevisto: 1780000, tendenciaCusto: 1815000, status: "ok", dataPrevista: "2026-08-20", responsavel: "Anibal", avancoFisico: 92 },
    { id: "item-004", obraId, codigo: "IC-004", nome: "Fundações - vigas baldrame e contenções", disciplinaId: "disc-fund", orcamentoPrevisto: 840000, tendenciaCusto: 870000, status: "atencao", dataPrevista: "2026-09-05", responsavel: "Anibal", avancoFisico: 76 },
    { id: "item-005", obraId, codigo: "IC-005", nome: "Estrutura - subsolo e térreo", disciplinaId: "disc-estrut", orcamentoPrevisto: 2460000, tendenciaCusto: 2495000, status: "ok", dataPrevista: "2026-09-30", responsavel: "Anibal", avancoFisico: 84 },
    { id: "item-006", obraId, codigo: "IC-006", nome: "Estrutura - pavimentos tipo", disciplinaId: "disc-estrut", orcamentoPrevisto: 3940000, tendenciaCusto: 4075000, status: "atencao", dataPrevista: "2026-12-15", responsavel: "Anibal", avancoFisico: 41 },
    { id: "item-007", obraId, codigo: "IC-007", nome: "Estrutura - cobertura e reservatórios", disciplinaId: "disc-estrut", orcamentoPrevisto: 980000, tendenciaCusto: 1035000, status: "atencao", dataPrevista: "2027-01-10", responsavel: "Anibal", avancoFisico: 18 },
    { id: "item-008", obraId, codigo: "IC-008", nome: "Alvenaria - pavimentos inferiores", disciplinaId: "disc-alv", orcamentoPrevisto: 890000, tendenciaCusto: 940000, status: "critico", dataPrevista: "2026-11-10", responsavel: "Mestre de obras", avancoFisico: 39 },
    { id: "item-009", obraId, codigo: "IC-009", nome: "Alvenaria - pavimentos superiores", disciplinaId: "disc-alv", orcamentoPrevisto: 1120000, tendenciaCusto: 1190000, status: "atencao", dataPrevista: "2027-01-20", responsavel: "Mestre de obras", avancoFisico: 12 },
    { id: "item-010", obraId, codigo: "IC-010", nome: "Elétrica - infraestrutura e eletrodutos", disciplinaId: "disc-ele", orcamentoPrevisto: 980000, tendenciaCusto: 1025000, status: "atencao", dataPrevista: "2026-12-20", responsavel: "Equipe elétrica", avancoFisico: 35 },
    { id: "item-011", obraId, codigo: "IC-011", nome: "Elétrica - quadros, alimentadores e SPDA", disciplinaId: "disc-ele", orcamentoPrevisto: 1360000, tendenciaCusto: 1428000, status: "atencao", dataPrevista: "2027-02-10", responsavel: "Equipe elétrica", avancoFisico: 16 },
    { id: "item-012", obraId, codigo: "IC-012", nome: "Hidrossanitário - prumadas e shafts", disciplinaId: "disc-hid", orcamentoPrevisto: 1180000, tendenciaCusto: 1320000, status: "critico", dataPrevista: "2026-12-05", responsavel: "Equipe hidráulica", avancoFisico: 27 },
    { id: "item-013", obraId, codigo: "IC-013", nome: "Hidrossanitário - reservatórios e bombas", disciplinaId: "disc-hid", orcamentoPrevisto: 760000, tendenciaCusto: 815000, status: "atencao", dataPrevista: "2027-01-25", responsavel: "Equipe hidráulica", avancoFisico: 9 },
    { id: "item-014", obraId, codigo: "IC-014", nome: "Sistemas especiais - PCI, GLP e automação", disciplinaId: "disc-sist", orcamentoPrevisto: 1120000, tendenciaCusto: 1168000, status: "atencao", dataPrevista: "2027-02-20", responsavel: "Terceirizados técnicos", avancoFisico: 8 },
    { id: "item-015", obraId, codigo: "IC-015", nome: "Revestimentos base - chapisco, emboço e contrapiso", disciplinaId: "disc-rev", orcamentoPrevisto: 1590000, tendenciaCusto: 1665000, status: "atencao", dataPrevista: "2027-02-28", responsavel: "Equipe de revestimento", avancoFisico: 14 },
    { id: "item-016", obraId, codigo: "IC-016", nome: "Impermeabilização e áreas molhadas", disciplinaId: "disc-rev", orcamentoPrevisto: 620000, tendenciaCusto: 655000, status: "ok", dataPrevista: "2027-01-30", responsavel: "Equipe de revestimento", avancoFisico: 22 },
    { id: "item-017", obraId, codigo: "IC-017", nome: "Acabamentos - revestimentos cerâmicos", disciplinaId: "disc-acab", orcamentoPrevisto: 2140000, tendenciaCusto: 2190000, status: "ok", dataPrevista: "2027-03-20", responsavel: "Equipe de acabamento", avancoFisico: 5 },
    { id: "item-018", obraId, codigo: "IC-018", nome: "Acabamentos - pintura, portas e metais", disciplinaId: "disc-acab", orcamentoPrevisto: 1840000, tendenciaCusto: 1875000, status: "ok", dataPrevista: "2027-04-05", responsavel: "Equipe de acabamento", avancoFisico: 2 },
    { id: "item-019", obraId, codigo: "IC-019", nome: "Elevadores - fornecimento e montagem", disciplinaId: "disc-elev", orcamentoPrevisto: 1280000, tendenciaCusto: 1280000, status: "ok", dataPrevista: "2027-03-10", responsavel: "Fornecedor elevadores", avancoFisico: 12 },
    { id: "item-020", obraId, codigo: "IC-020", nome: "Infraestrutura externa - drenagem e redes", disciplinaId: "disc-infra", orcamentoPrevisto: 940000, tendenciaCusto: 995000, status: "atencao", dataPrevista: "2027-03-30", responsavel: "Equipe externa", avancoFisico: 7 },
    { id: "item-021", obraId, codigo: "IC-021", nome: "Infraestrutura externa - acessos e pavimentação", disciplinaId: "disc-infra", orcamentoPrevisto: 1120000, tendenciaCusto: 1175000, status: "atencao", dataPrevista: "2027-04-10", responsavel: "Equipe externa", avancoFisico: 4 },
    { id: "item-022", obraId, codigo: "IC-022", nome: "Entrega - limpeza, vistoria e checklist final", disciplinaId: "disc-entrega", orcamentoPrevisto: 360000, tendenciaCusto: 375000, status: "ok", dataPrevista: "2027-04-25", responsavel: "Coordenação de entrega", avancoFisico: 0 },
  ],
  pendencias: [
    { id: "PD-001", obraId, tipo: "Decisão", disciplinaId: "disc-hid", descricao: "Definir fornecedor de tubulação e conexões para prumadas críticas", responsavel: "Proprietário", prazo: "2026-05-15", impacto: "Alto", status: "Aberta", prioridade: "P1" },
    { id: "PD-002", obraId, tipo: "Restrição", disciplinaId: "disc-alv", descricao: "Entrega de blocos cerâmicos abaixo da necessidade semanal", responsavel: "Suprimentos", prazo: "2026-05-10", impacto: "Alto", status: "Aberta", prioridade: "P1" },
    { id: "PD-003", obraId, tipo: "RFI", disciplinaId: "disc-estrut", descricao: "Conferir detalhe de armadura em transição de pilares do pavimento tipo", responsavel: "Projetista estrutural", prazo: "2026-05-12", impacto: "Médio", status: "Em análise", prioridade: "P2" },
    { id: "PD-004", obraId, tipo: "Mudança", disciplinaId: "disc-acab", descricao: "Avaliar alteração de padrão de porcelanato nas áreas comuns", responsavel: "Proprietário", prazo: "2026-05-22", impacto: "Médio", status: "Aberta", prioridade: "P2" },
    { id: "PD-005", obraId, tipo: "Issue", disciplinaId: "disc-mob", descricao: "Área de descarga está gerando conflito com circulação interna", responsavel: "Anibal", prazo: "2026-05-09", impacto: "Baixo", status: "Em análise", prioridade: "P3" },
    { id: "PD-006", obraId, tipo: "Risco", disciplinaId: "disc-ele", descricao: "Atraso da concessionária pode afetar energização definitiva", responsavel: "Equipe elétrica", prazo: "2026-07-05", impacto: "Alto", status: "Em análise", prioridade: "P2" },
    { id: "PD-007", obraId, tipo: "Restrição", disciplinaId: "disc-rev", descricao: "Revestimento depende da liberação completa das instalações embutidas", responsavel: "Anibal", prazo: "2026-06-01", impacto: "Médio", status: "Aberta", prioridade: "P2" },
    { id: "PD-008", obraId, tipo: "Decisão", disciplinaId: "disc-infra", descricao: "Escolher prioridade entre drenagem externa e acesso provisório", responsavel: "Proprietário", prazo: "2026-05-18", impacto: "Médio", status: "Aberta", prioridade: "P2" },
    { id: "PD-009", obraId, tipo: "RFI", disciplinaId: "disc-sist", descricao: "Compatibilizar rota de GLP com shafts e área técnica", responsavel: "Projetista complementar", prazo: "2026-05-28", impacto: "Médio", status: "Em análise", prioridade: "P2" },
    { id: "PD-010", obraId, tipo: "Risco", disciplinaId: "disc-elev", descricao: "Janela de fabricação do elevador pode pressionar a entrega final", responsavel: "Fornecedor elevadores", prazo: "2026-08-15", impacto: "Alto", status: "Aberta", prioridade: "P2" },
    { id: "PD-011", obraId, tipo: "Issue", disciplinaId: "disc-fund", descricao: "Necessária validação final de locação de blocos de fundação", responsavel: "Anibal", prazo: "2026-05-11", impacto: "Baixo", status: "Resolvida", prioridade: "P3" },
    { id: "PD-012", obraId, tipo: "Restrição", disciplinaId: "disc-estrut", descricao: "Concretagem depende de confirmação de fornecimento de concreto", responsavel: "Fornecedor concreto", prazo: "2026-05-13", impacto: "Médio", status: "Aberta", prioridade: "P2" },
    { id: "PD-013", obraId, tipo: "Mudança", disciplinaId: "disc-sist", descricao: "Inclusão de espera para automação de portões e controle de acesso", responsavel: "Anibal", prazo: "2026-06-10", impacto: "Baixo", status: "Em análise", prioridade: "P3" },
    { id: "PD-014", obraId, tipo: "Decisão", disciplinaId: "disc-acab", descricao: "Aprovar amostras de pintura interna e textura externa", responsavel: "Proprietário", prazo: "2026-06-05", impacto: "Baixo", status: "Aberta", prioridade: "P3" },
    { id: "PD-015", obraId, tipo: "Risco", disciplinaId: "disc-alv", descricao: "Produtividade da equipe de alvenaria abaixo da meta por duas semanas", responsavel: "Mestre de obras", prazo: "2026-05-20", impacto: "Médio", status: "Aberta", prioridade: "P2" },
  ],
  diarios: [
    { id: "DC-001", obraId, data: "2026-05-01", disciplinaId: "disc-mob", itemControleId: "item-001", atividade: "Organização de acesso, almoxarifado e descarga", metaDia: "1 frente liberada", realizadoDia: "1 frente liberada", equipe: 5, hh: 40, restricao: "Sem restrição", statusDia: "ok", avancoItem: 65, planoSeguinte: "Ajustar área de circulação de materiais", observacoes: "Base empírica gerada para demonstração." },
    { id: "DC-002", obraId, data: "2026-05-02", disciplinaId: "disc-fund", itemControleId: "item-003", atividade: "Conferência de blocos e arranques", metaDia: "12 blocos", realizadoDia: "11 blocos", equipe: 7, hh: 56, restricao: "Aguardando conferência de locação", statusDia: "atencao", avancoItem: 92, planoSeguinte: "Encerrar conferência e liberar concretagem complementar", observacoes: "Uma posição ficou pendente para rechecagem." },
    { id: "DC-003", obraId, data: "2026-05-03", disciplinaId: "disc-estrut", itemControleId: "item-005", atividade: "Forma e armação de vigas do térreo", metaDia: "220 m²", realizadoDia: "205 m²", equipe: 12, hh: 96, restricao: "Entrega parcial de madeira", statusDia: "atencao", avancoItem: 84, planoSeguinte: "Completar travamento e preparar inspeção", observacoes: "Produtividade aceitável, com perda pequena por material." },
    { id: "DC-004", obraId, data: "2026-05-04", disciplinaId: "disc-alv", itemControleId: "item-008", atividade: "Elevação de alvenaria no pavimento inferior", metaDia: "160 m²", realizadoDia: "118 m²", equipe: 8, hh: 64, restricao: "Falta de blocos cerâmicos", statusDia: "critico", avancoItem: 39, planoSeguinte: "Priorizar áreas com material disponível", observacoes: "Restrição registrada como pendência crítica." },
    { id: "DC-005", obraId, data: "2026-05-05", disciplinaId: "disc-ele", itemControleId: "item-010", atividade: "Infraestrutura elétrica em laje", metaDia: "1 laje", realizadoDia: "0,7 laje", equipe: 5, hh: 40, restricao: "Interferência com passagem hidráulica", statusDia: "atencao", avancoItem: 35, planoSeguinte: "Compatibilizar shafts antes do fechamento", observacoes: "Necessário alinhamento entre equipes." },
    { id: "DC-006", obraId, data: "2026-05-06", disciplinaId: "disc-hid", itemControleId: "item-012", atividade: "Montagem de prumadas hidráulicas", metaDia: "2 prumadas", realizadoDia: "1 prumada", equipe: 4, hh: 32, restricao: "Definição de fornecedor pendente", statusDia: "critico", avancoItem: 27, planoSeguinte: "Executar trechos liberados e aguardar decisão", observacoes: "Dependência direta de decisão do proprietário." },
    { id: "DC-007", obraId, data: "2026-05-07", disciplinaId: "disc-sist", itemControleId: "item-014", atividade: "Levantamento de interferências PCI e GLP", metaDia: "1 relatório", realizadoDia: "1 relatório", equipe: 3, hh: 24, restricao: "Aguardando retorno do projetista", statusDia: "atencao", avancoItem: 8, planoSeguinte: "Formalizar RFI de compatibilização", observacoes: "Levantamento base concluído." },
    { id: "DC-008", obraId, data: "2026-05-08", disciplinaId: "disc-rev", itemControleId: "item-015", atividade: "Preparação para emboço em áreas liberadas", metaDia: "90 m²", realizadoDia: "76 m²", equipe: 6, hh: 48, restricao: "Liberação parcial de instalações embutidas", statusDia: "atencao", avancoItem: 14, planoSeguinte: "Aguardar liberação dos shafts restantes", observacoes: "Produção limitada por interface técnica." },
    { id: "DC-009", obraId, data: "2026-05-09", disciplinaId: "disc-acab", itemControleId: "item-017", atividade: "Separação de amostras de acabamento", metaDia: "4 amostras", realizadoDia: "4 amostras", equipe: 2, hh: 16, restricao: "Aprovação do proprietário", statusDia: "ok", avancoItem: 5, planoSeguinte: "Apresentar amostras para decisão", observacoes: "Base preparada para reunião." },
    { id: "DC-010", obraId, data: "2026-05-10", disciplinaId: "disc-infra", itemControleId: "item-020", atividade: "Reconhecimento de redes externas", metaDia: "1 levantamento", realizadoDia: "1 levantamento", equipe: 4, hh: 32, restricao: "Definir prioridade de frente externa", statusDia: "atencao", avancoItem: 7, planoSeguinte: "Apresentar alternativas de sequência", observacoes: "Infraestrutura ainda em fase inicial." },
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
  return data.disciplinas.find((disciplina) => disciplina.id === disciplinaId)?.nome ?? "Sem disciplina";
}

export function getItemControle(data: PietraData, itemControleId: string) {
  return data.itensControle.find((item) => item.id === itemControleId);
}

export function getItemControleLabel(data: PietraData, itemControleId: string) {
  const item = getItemControle(data, itemControleId);
  return item ? `${item.codigo} - ${item.nome}` : "Sem item de controle";
}

export function getDisciplinaResumos(data: PietraData, obraId = data.activeObraId): DisciplinaResumo[] {
  const itens = getItensDaObra(data, obraId);
  const pendencias = getPendenciasDaObra(data, obraId);
  const diarios = getDiariosDaObra(data, obraId);

  return getDisciplinasDaObra(data, obraId).map((disciplina) => {
    const itensDisciplina = itens.filter((item) => item.disciplinaId === disciplina.id);
    const pendenciasDisciplina = pendencias.filter((pendencia) => pendencia.disciplinaId === disciplina.id);
    const pendenciasAbertas = pendenciasDisciplina.filter((pendencia) => pendencia.status !== "Resolvida");
    const pendenciasCriticas = pendenciasAbertas.filter((pendencia) => pendencia.prioridade === "P1");
    const diariosRecentes = diarios
      .filter((diario) => diario.disciplinaId === disciplina.id)
      .sort((a, b) => b.data.localeCompare(a.data));

    const base = itensDisciplina.reduce((sum, item) => sum + item.orcamentoPrevisto, 0);
    const realizado =
      base > 0
        ? itensDisciplina.reduce((sum, item) => sum + item.avancoFisico * item.orcamentoPrevisto, 0) / base
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
  const realizado = itens.reduce((sum, item) => sum + item.orcamentoPrevisto * (item.avancoFisico / 100), 0);
  const avancoFisico = orcamentoPrevisto > 0 ? (realizado / orcamentoPrevisto) * 100 : 0;
  const desvioCustoValor = orcamentoTendencia - orcamentoPrevisto;
  const desvioCusto = orcamentoPrevisto > 0 ? (desvioCustoValor / orcamentoPrevisto) * 100 : 0;
  const pendenciasAbertas = pendencias.filter((pendencia) => pendencia.status !== "Resolvida");
  const pendenciasCriticas = pendenciasAbertas.filter((pendencia) => pendencia.prioridade === "P1");
  const decisoesPendentes = pendenciasAbertas.filter((pendencia) => pendencia.tipo === "Decisão");
  const statusGeral =
    pendenciasCriticas.length >= 3 || disciplinaResumos.some((disciplina) => disciplina.status === "critico")
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
  return getPendenciasDaObra(data, obraId)
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
