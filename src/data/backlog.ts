export type BacklogPriority = "crítico" | "importante" | "estruturante";
export type BacklogItemStatus = "publicado" | "em-aprovacao" | "a-criar";
export type BacklogDocType = "Política" | "Procedimento" | "Fluxograma";

export type BacklogItem = {
  code: string;
  title: string;
  type: BacklogDocType;
  priority: BacklogPriority;
  status: BacklogItemStatus;
  hubDocCode?: string; // se já existe no Hub, referencia o código do documento
};

export type BacklogArea = {
  id: string;
  name: string;
  icon: string; // nome do ícone Lucide
  executive: string;
  items: BacklogItem[];
};

export const backlogAreas: BacklogArea[] = [
  {
    id: "pc",
    name: "Pessoas & Cultura",
    icon: "Users",
    executive: "Marlon Silva — Head de P&C",
    items: [
      // Políticas
      { code: "PC-POL-01", title: "Política de Recrutamento e Seleção", type: "Política", priority: "crítico", status: "em-aprovacao", hubDocCode: "PC-SEL-009" },
      { code: "PC-POL-02", title: "Política de Remuneração e Benefícios", type: "Política", priority: "crítico", status: "em-aprovacao", hubDocCode: "PC-REB-003" },
      { code: "PC-POL-03", title: "Política de Avaliação de Desempenho", type: "Política", priority: "crítico", status: "em-aprovacao", hubDocCode: "PC-CGE-005" },
      { code: "PC-POL-04", title: "Política de Jornada de Trabalho e Ponto", type: "Política", priority: "crítico", status: "a-criar" },
      { code: "PC-POL-05", title: "Política de Férias e Afastamentos", type: "Política", priority: "crítico", status: "a-criar" },
      { code: "PC-POL-06", title: "Política de Código de Conduta e Ética", type: "Política", priority: "crítico", status: "a-criar" },
      { code: "PC-POL-07", title: "Política de Diversidade, Equidade e Inclusão", type: "Política", priority: "importante", status: "a-criar" },
      { code: "PC-POL-08", title: "Política de Treinamento e Desenvolvimento", type: "Política", priority: "importante", status: "em-aprovacao", hubDocCode: "PC-TDE-004" },
      { code: "PC-POL-09", title: "Política de Desligamento", type: "Política", priority: "importante", status: "a-criar" },
      { code: "PC-POL-10", title: "Política de Prevenção ao Assédio e Violência", type: "Política", priority: "crítico", status: "a-criar" },
      // Procedimentos
      { code: "PC-PROC-01", title: "Procedimento de Admissão — do aceite à integração", type: "Procedimento", priority: "crítico", status: "publicado", hubDocCode: "SOP-ADM-001" },
      { code: "PC-PROC-02", title: "Procedimento de Desligamento — do aviso ao arquivo", type: "Procedimento", priority: "crítico", status: "a-criar" },
      { code: "PC-PROC-03", title: "Procedimento de Ciclo de Avaliação de Desempenho", type: "Procedimento", priority: "importante", status: "a-criar" },
      { code: "PC-PROC-04", title: "Procedimento de Aplicação de Medidas Disciplinares", type: "Procedimento", priority: "crítico", status: "a-criar" },
      { code: "PC-PROC-05", title: "Procedimento de Gestão de Afastamentos Médicos", type: "Procedimento", priority: "importante", status: "a-criar" },
      { code: "PC-PROC-06", title: "Procedimento de Onboarding de Liderança", type: "Procedimento", priority: "estruturante", status: "a-criar" },
      // Fluxogramas
      { code: "PC-FLX-01", title: "Fluxo de Recrutamento e Seleção (triagem → oferta)", type: "Fluxograma", priority: "crítico", status: "a-criar" },
      { code: "PC-FLX-02", title: "Fluxo de Admissão (aceite → primeiro dia)", type: "Fluxograma", priority: "crítico", status: "publicado", hubDocCode: "FLUX-ADM-001" },
      { code: "PC-FLX-03", title: "Fluxo de Desligamento (comunicação → baixa)", type: "Fluxograma", priority: "crítico", status: "a-criar" },
      { code: "PC-FLX-04", title: "Fluxo de Tratamento de Denúncia / Canal de Ética", type: "Fluxograma", priority: "importante", status: "a-criar" },
    ],
  },
  {
    id: "fin",
    name: "Financeiro / Controladoria",
    icon: "Wallet",
    executive: "Gerente de Governança",
    items: [
      { code: "FIN-POL-01", title: "Política de Contas a Pagar", type: "Política", priority: "crítico", status: "publicado", hubDocCode: "PC-FIN-CAP-001" },
      { code: "FIN-POL-02", title: "Política de Contas a Receber e Cobrança", type: "Política", priority: "crítico", status: "a-criar" },
      { code: "FIN-POL-03", title: "Política de Gestão de Caixa e Fluxo Financeiro", type: "Política", priority: "crítico", status: "a-criar" },
      { code: "FIN-POL-04", title: "Política de Controle de Despesas e Reembolsos", type: "Política", priority: "crítico", status: "a-criar" },
      { code: "FIN-POL-05", title: "Política de Alçadas de Aprovação Financeira", type: "Política", priority: "crítico", status: "a-criar" },
      { code: "FIN-PROC-01", title: "Procedimento de Fechamento Mensal", type: "Procedimento", priority: "crítico", status: "a-criar" },
      { code: "FIN-PROC-02", title: "Procedimento de Conciliação Bancária", type: "Procedimento", priority: "crítico", status: "a-criar" },
      { code: "FIN-PROC-03", title: "Procedimento de Solicitação e Aprovação de Despesas", type: "Procedimento", priority: "crítico", status: "a-criar" },
      { code: "FIN-PROC-04", title: "Procedimento de Emissão de NF e Faturamento", type: "Procedimento", priority: "crítico", status: "a-criar" },
      { code: "FIN-PROC-05", title: "Procedimento de Inadimplência e Cobrança Ativa", type: "Procedimento", priority: "crítico", status: "a-criar" },
      { code: "FIN-PROC-06", title: "Procedimento de Elaboração e Revisão de Budget", type: "Procedimento", priority: "importante", status: "a-criar" },
      { code: "FIN-PROC-07", title: "Procedimento de Prestação de Contas de Viagens", type: "Procedimento", priority: "importante", status: "a-criar" },
      { code: "FIN-PROC-08", title: "Procedimento de Reporte Financeiro ao Board", type: "Procedimento", priority: "importante", status: "a-criar" },
      { code: "FIN-FLX-01", title: "Fluxo de Aprovação de Pagamentos (por alçada)", type: "Fluxograma", priority: "crítico", status: "a-criar" },
      { code: "FIN-FLX-02", title: "Fluxo de Cobrança de Inadimplentes (estágios)", type: "Fluxograma", priority: "crítico", status: "a-criar" },
      { code: "FIN-FLX-03", title: "Fluxo de Fechamento Mensal (responsáveis e prazos)", type: "Fluxograma", priority: "crítico", status: "a-criar" },
      { code: "FIN-FLX-04", title: "Fluxo de Reembolso de Despesas", type: "Fluxograma", priority: "importante", status: "a-criar" },
      { code: "FIN-FLX-05", title: "Fluxo de Elaboração do Budget Anual", type: "Fluxograma", priority: "importante", status: "a-criar" },
    ],
  },
  {
    id: "com",
    name: "Comercial e Marketing",
    icon: "TrendingUp",
    executive: "Head Comercial",
    items: [
      { code: "COM-POL-01", title: "Política Comercial — condições, descontos e alçadas", type: "Política", priority: "crítico", status: "a-criar" },
      { code: "COM-POL-02", title: "Política de Relacionamento com Imobiliárias e Corretores", type: "Política", priority: "crítico", status: "a-criar" },
      { code: "COM-POL-03", title: "Política de Uso da Marca e Comunicação Externa", type: "Política", priority: "importante", status: "a-criar" },
      { code: "COM-PROC-01", title: "Procedimento da Jornada de Venda — do lead ao contrato", type: "Procedimento", priority: "crítico", status: "a-criar" },
      { code: "COM-PROC-02", title: "Procedimento de Atendimento e Protocolo de Visita", type: "Procedimento", priority: "crítico", status: "a-criar" },
      { code: "COM-PROC-03", title: "Procedimento de Follow-up Pós-Visita (3 momentos)", type: "Procedimento", priority: "crítico", status: "a-criar" },
      { code: "COM-PROC-04", title: "Procedimento de Gestão do CRM", type: "Procedimento", priority: "importante", status: "a-criar" },
      { code: "COM-PROC-05", title: "Procedimento de Briefing e Planejamento de Campanhas", type: "Procedimento", priority: "importante", status: "a-criar" },
      { code: "COM-FLX-01", title: "Fluxo da Jornada Comercial Completa (topo a fechamento)", type: "Fluxograma", priority: "crítico", status: "a-criar" },
      { code: "COM-FLX-02", title: "Fluxo de Aprovação de Material de Marketing", type: "Fluxograma", priority: "importante", status: "a-criar" },
      { code: "COM-FLX-03", title: "Fluxo de Tratamento de Proposta e Contrato", type: "Fluxograma", priority: "crítico", status: "a-criar" },
    ],
  },
  {
    id: "prod",
    name: "Produto",
    icon: "Building2",
    executive: "Head de Produto",
    items: [
      { code: "PROD-POL-01", title: "Política de Desenvolvimento de Produto — critérios de viabilidade", type: "Política", priority: "importante", status: "a-criar" },
      { code: "PROD-POL-02", title: "Política de Gestão de Portfólio de Empreendimentos", type: "Política", priority: "importante", status: "a-criar" },
      { code: "PROD-PROC-01", title: "Procedimento de Estudo de Viabilidade (VGV, implantação, público)", type: "Procedimento", priority: "crítico", status: "a-criar" },
      { code: "PROD-PROC-02", title: "Procedimento de Desenvolvimento de Briefing de Produto", type: "Procedimento", priority: "crítico", status: "a-criar" },
      { code: "PROD-PROC-03", title: "Procedimento de Gestão de Landbank e Oportunidades", type: "Procedimento", priority: "importante", status: "a-criar" },
      { code: "PROD-PROC-04", title: "Procedimento de Apresentação de Produto ao Board", type: "Procedimento", priority: "importante", status: "a-criar" },
      { code: "PROD-FLX-01", title: "Fluxo de Aprovação de Novo Empreendimento (gate review)", type: "Fluxograma", priority: "crítico", status: "a-criar" },
      { code: "PROD-FLX-02", title: "Fluxo de Desenvolvimento de Produto (conceito → lançamento)", type: "Fluxograma", priority: "importante", status: "a-criar" },
      { code: "PROD-FLX-03", title: "Fluxo de Gestão de Alterações de Produto em Andamento", type: "Fluxograma", priority: "importante", status: "a-criar" },
    ],
  },
  {
    id: "proj",
    name: "Projetos e Aprovação",
    icon: "Landmark",
    executive: "Head de Projetos",
    items: [
      { code: "PROJ-POL-01", title: "Política de Gestão de Projetos e Empreendimentos", type: "Política", priority: "crítico", status: "a-criar" },
      { code: "PROJ-POL-02", title: "Política de Gestão de Riscos Regulatórios", type: "Política", priority: "importante", status: "a-criar" },
      { code: "PROJ-PROC-01", title: "Procedimento de Protocolo e Acompanhamento de Aprovações Municipais", type: "Procedimento", priority: "crítico", status: "a-criar" },
      { code: "PROJ-PROC-02", title: "Procedimento de Gestão Documental de Empreendimentos", type: "Procedimento", priority: "crítico", status: "a-criar" },
      { code: "PROJ-PROC-03", title: "Procedimento de Acompanhamento de Obra e Entregas", type: "Procedimento", priority: "crítico", status: "a-criar" },
      { code: "PROJ-PROC-04", title: "Procedimento de Solicitações Internas de Aprovação (SLA ≤5 dias)", type: "Procedimento", priority: "importante", status: "a-criar" },
      { code: "PROJ-PROC-05", title: "Procedimento de Gestão de Contratos com Fornecedores de Obra", type: "Procedimento", priority: "importante", status: "a-criar" },
      { code: "PROJ-PROC-06", title: "Procedimento de Entrega de Unidades e Pós-obra", type: "Procedimento", priority: "importante", status: "a-criar" },
      { code: "PROJ-FLX-01", title: "Fluxo de Aprovação de Projeto junto aos Órgãos Competentes", type: "Fluxograma", priority: "crítico", status: "a-criar" },
      { code: "PROJ-FLX-02", title: "Fluxo de Gestão de Pendências Regulatórias", type: "Fluxograma", priority: "crítico", status: "a-criar" },
      { code: "PROJ-FLX-03", title: "Fluxo de Acompanhamento de Cronograma de Obra", type: "Fluxograma", priority: "importante", status: "a-criar" },
      { code: "PROJ-FLX-04", title: "Fluxo de Entrega de Unidades ao Cliente", type: "Fluxograma", priority: "importante", status: "a-criar" },
    ],
  },
  {
    id: "jur",
    name: "Jurídico / Compliance",
    icon: "Scale",
    executive: "Head Jurídico",
    items: [
      { code: "JUR-POL-01", title: "Política Antissuborno e Anticorrupção (Lei 12.846)", type: "Política", priority: "crítico", status: "a-criar" },
      { code: "JUR-POL-02", title: "Política de Proteção de Dados — LGPD", type: "Política", priority: "crítico", status: "a-criar" },
      { code: "JUR-POL-03", title: "Política de Gestão de Contratos", type: "Política", priority: "crítico", status: "a-criar" },
      { code: "JUR-POL-04", title: "Política de Prevenção à Lavagem de Dinheiro (PLD)", type: "Política", priority: "crítico", status: "a-criar" },
      { code: "JUR-PROC-01", title: "Procedimento de Revisão e Aprovação Jurídica de Contratos", type: "Procedimento", priority: "crítico", status: "a-criar" },
      { code: "JUR-PROC-02", title: "Procedimento de Tratamento de Incidentes de Dados (LGPD)", type: "Procedimento", priority: "crítico", status: "a-criar" },
      { code: "JUR-PROC-03", title: "Procedimento de Gestão de Contencioso", type: "Procedimento", priority: "importante", status: "a-criar" },
      { code: "JUR-FLX-01", title: "Fluxo de Aprovação e Assinatura de Contratos", type: "Fluxograma", priority: "crítico", status: "a-criar" },
      { code: "JUR-FLX-02", title: "Fluxo de Resposta a Incidente de Dados (LGPD)", type: "Fluxograma", priority: "crítico", status: "a-criar" },
    ],
  },
  {
    id: "ti",
    name: "TI / Dados",
    icon: "ShieldCheck",
    executive: "Head de TI",
    items: [
      { code: "TI-POL-01", title: "Política de Segurança da Informação", type: "Política", priority: "crítico", status: "a-criar" },
      { code: "TI-POL-02", title: "Política de Uso Aceitável de Recursos de TI", type: "Política", priority: "importante", status: "a-criar" },
      { code: "TI-POL-03", title: "Política de Gestão de Acessos e Senhas", type: "Política", priority: "crítico", status: "a-criar" },
      { code: "TI-PROC-01", title: "Procedimento de Concessão e Revogação de Acessos", type: "Procedimento", priority: "crítico", status: "a-criar" },
      { code: "TI-PROC-02", title: "Procedimento de Backup e Recuperação de Dados", type: "Procedimento", priority: "crítico", status: "a-criar" },
      { code: "TI-PROC-03", title: "Procedimento de Gestão de Fornecedores de Tecnologia", type: "Procedimento", priority: "importante", status: "a-criar" },
      { code: "TI-FLX-01", title: "Fluxo de Solicitação e Aprovação de Acesso a Sistemas", type: "Fluxograma", priority: "crítico", status: "a-criar" },
      { code: "TI-FLX-02", title: "Fluxo de Resposta a Incidente de Segurança", type: "Fluxograma", priority: "crítico", status: "a-criar" },
    ],
  },
];

// --- Helpers ---

export function getAreaProgress(area: BacklogArea) {
  const total = area.items.length;
  const done = area.items.filter((i) => i.status === "publicado").length;
  const inProgress = area.items.filter((i) => i.status === "em-aprovacao").length;
  return { total, done, inProgress, pct: Math.round((done / total) * 100) };
}

export function getGlobalProgress() {
  const allItems = backlogAreas.flatMap((a) => a.items);
  const total = allItems.length;
  const done = allItems.filter((i) => i.status === "publicado").length;
  const inProgress = allItems.filter((i) => i.status === "em-aprovacao").length;
  const toCreate = allItems.filter((i) => i.status === "a-criar").length;
  return { total, done, inProgress, toCreate, pct: Math.round((done / total) * 100) };
}
