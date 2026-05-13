export type DocStatus = "Publicado" | "Em Aprovação" | "Em Revisão" | "Arquivado";
export type DocCategory =
  | "Pessoas & Cultura"
  | "Jurídico"
  | "Financeiro"
  | "Operações"
  | "Compliance"
  | "Governança";

export type DocType =
  | "Política"
  | "SOP"
  | "Apresentação"
  | "Fluxograma"
  | "Formulário"
  | "Documento"
  | "Procedimento";

export type ApprovalStage = {
  name: string;
  status: "done" | "current" | "pending";
  date?: string;
};

export type DocBlock =
  | { kind: "p"; text: string }
  | { kind: "subheading"; text: string }
  | { kind: "list"; items: string[]; ordered?: boolean }
  | { kind: "table"; headers: string[]; rows: string[][]; caption?: string }
  | { kind: "info"; text: string }
  | { kind: "warning"; text: string }
  | { kind: "matrix" } // ApprovalMatrix (PC-FIN-CAP-001)
  | { kind: "flowchart" } // FlowchartViewer (FLUX-ADM-001)
  | { kind: "slides" }; // SlideViewer (DECK-ADM-001)

export type DocSection = {
  id: string;
  title: string;
  blocks: DocBlock[];
};

export type Document = {
  code: string;
  title: string;
  type: DocType;
  category: DocCategory;
  status: DocStatus;
  version: string;
  scope: string;
  responsible: string;
  elaboration: string;
  approvalAuthority: string;
  currentStage: string;
  effectiveDate?: string;
  emissionDate?: string;
  department?: string;
  classification?: string;
  updatedAt: string;
  year: number;
  summary: string;
  approvalChain: ApprovalStage[];
  sections: DocSection[];
  related?: string[];
};

// ---------- Approval chains ----------
const pendingChain = (): ApprovalStage[] => [
  { name: "Elaboração", status: "done", date: "12 Mar 2026" },
  { name: "Diretoria", status: "done", date: "28 Mar 2026" },
  { name: "CEO", status: "current" },
  { name: "Conselho Deliberativo", status: "pending" },
];

const publishedChain = (date: string): ApprovalStage[] => [
  { name: "Elaboração", status: "done", date: "10 Jan 2026" },
  { name: "Diretoria", status: "done", date: "20 Fev 2026" },
  { name: "CEO", status: "done", date: "15 Abr 2026" },
  { name: "Conselho Deliberativo", status: "done", date: date },
];

// ---------- Common P&C metadata ----------
const pcBase = {
  category: "Pessoas & Cultura" as const,
  status: "Em Aprovação" as const,
  version: "1.0 — Primeira Emissão",
  scope: "Hyndra Participações e empresas participadas",
  responsible: "Marlon Silva — Head de Pessoas & Cultura",
  elaboration: "Head de P&C",
  approvalAuthority: "Conselho Deliberativo",
  currentStage: "CEO — Pendente",
  classification: "Uso interno — Confidencial",
  year: 2026,
  updatedAt: "28 Mar 2026",
  department: "Pessoas & Cultura",
};

// Helpers
const policySectionsCommon = (
  themeTitle: string,
  principles: string[],
  procedures: DocBlock[],
): DocSection[] => [
  {
    id: "objetivo",
    title: "1. Objetivo",
    blocks: [
      {
        kind: "p",
        text: `Estabelecer diretrizes, princípios e responsabilidades referentes a ${themeTitle.toLowerCase()} no âmbito da Hyndra Participações e suas empresas participadas, assegurando alinhamento estratégico, equidade e excelência institucional.`,
      },
      {
        kind: "info",
        text: "Aplicação institucional uniforme em todas as empresas do grupo, respeitando as particularidades operacionais de cada negócio.",
      },
    ],
  },
  {
    id: "abrangencia",
    title: "2. Abrangência",
    blocks: [
      {
        kind: "p",
        text: "Aplica-se a todos os colaboradores, líderes, diretores e prestadores de serviço da Hyndra Participações e empresas participadas, em todas as unidades e modalidades de trabalho.",
      },
    ],
  },
  {
    id: "principios",
    title: "3. Princípios",
    blocks: [{ kind: "list", items: principles, ordered: true }],
  },
  {
    id: "responsabilidades",
    title: "4. Responsabilidades",
    blocks: [
      {
        kind: "table",
        headers: ["Instância", "Responsabilidade"],
        rows: [
          ["Conselho Deliberativo", "Aprovar a política e seus desvios estruturais."],
          ["CEO", "Garantir aplicação institucional e zelar pela cultura."],
          ["Head de P&C", "Gerir, manter e atualizar o documento."],
          ["Líderes", "Aplicar consistentemente em suas equipes."],
          ["Colaboradores", "Conhecer, respeitar e reportar desvios."],
        ],
      },
    ],
  },
  {
    id: "procedimentos",
    title: "5. Procedimentos",
    blocks: [
      ...procedures,
      {
        kind: "warning",
        text: "Qualquer exceção a esta política deve ser formalmente aprovada pelo CEO mediante parecer do Head de P&C.",
      },
    ],
  },
  {
    id: "vigencia",
    title: "6. Vigência e Revisão",
    blocks: [
      {
        kind: "p",
        text: "Esta política entra em vigor na data de aprovação pelo Conselho Deliberativo e será revisada a cada 24 meses ou sempre que mudanças regulatórias ou estratégicas exigirem.",
      },
    ],
  },
];

// ---------- Documents ----------

export const documents: Document[] = [
  // ============ FINANCEIRO — PC-FIN-CAP-001 (Publicado) ============
  {
    code: "PC-FIN-CAP-001",
    title: "Política de Contas a Pagar",
    type: "Política",
    category: "Financeiro",
    status: "Publicado",
    version: "1.0 · Revisão 00",
    scope: "Newe Urbanismo e Participações S.A.",
    responsible: "Gerente de Governança",
    elaboration: "Gerente de Governança",
    approvalAuthority: "CEO",
    currentStage: "Vigente",
    emissionDate: "06 Mai 2026",
    effectiveDate: "07 Mai 2026",
    department: "Financeiro — Governança Corporativa e Controles Internos",
    classification: "Uso interno — Confidencial",
    year: 2026,
    updatedAt: "07 Mai 2026",
    summary:
      "Diretrizes, alçadas de aprovação e governança do ciclo de pagamentos, com gestão de fornecedores, processamento de tributos e segregação de funções no sistema MEGA.",
    approvalChain: publishedChain("06 Mai 2026"),
    related: ["PC-CGE-005"],
    sections: [
      {
        id: "objetivo",
        title: "1. Objetivo",
        blocks: [
          {
            kind: "p",
            text: "Esta política e seus respectivos controles internos devem, obrigatoriamente, seguir os padrões e fundamentos estabelecidos na Política Mãe do grupo. A estruturação baseia-se em princípios de gestão financeira e controle, visando a gestão do capital de giro, previsibilidade do fluxo de caixa e eficiência operacional.",
          },
        ],
      },
      {
        id: "abrangencia",
        title: "2. Abrangência",
        blocks: [
          {
            kind: "p",
            text: "Aplica-se a todos os colaboradores, departamentos e gestores envolvidos no processo de solicitação, aprovação e liquidação de obrigações financeiras da NEWE URBANISMO E PARTICIPACOES S.A.",
          },
        ],
      },
      {
        id: "ciclo",
        title: "3. Diretrizes do Ciclo de Pagamentos",
        blocks: [
          {
            kind: "p",
            text: "Três datas fixas mensais para pagamentos a fornecedores, organizando previsibilidade do fluxo de caixa:",
          },
          {
            kind: "table",
            headers: ["Janela", "Data"],
            rows: [
              ["1ª Data", "5º dia útil do mês"],
              ["2ª Data", "Dia 15 (ou dia útil subsequente)"],
              ["3ª Data", "Dia 25 (ou dia útil subsequente)"],
            ],
          },
          { kind: "subheading", text: "3.1 Gestão de Fornecedores" },
          {
            kind: "table",
            headers: ["Categoria", "Diretriz"],
            rows: [
              [
                "Fornecedores Negociáveis",
                "Vencimento alinhado para o mês subsequente à emissão da NF, respeitando as datas fixas para otimizar o capital de giro.",
              ],
              [
                "Fornecedores Não Negociáveis",
                "Pagamentos com condições fixas por contrato ou lei processados nas respectivas datas de vencimento para evitar multas.",
              ],
              [
                "Segurança Operacional",
                "Vedado pagamento a fornecedores por meio de chaves PIX aleatórias.",
              ],
              [
                "Impostos",
                "Todo lançamento de guia no sistema MEGA deve ter documentação comprobatória anexada: PDF da guia, memória de cálculo e detalhamento técnico do tributo.",
              ],
              [
                "Titularidade",
                "Somente realizados pagamentos para contas bancárias vinculadas à Razão Social do fornecedor.",
              ],
            ],
          },
        ],
      },
      {
        id: "alcadas",
        title: "4. Governança e Alçadas de Aprovação (Sistema MEGA)",
        blocks: [
          {
            kind: "warning",
            text: "REGRA DE OURO — Todo e qualquer pagamento, antes do agendamento no banco, deve estar previamente aprovado no sistema MEGA. Nenhum pagamento deve ser agendado antes da finalização completa da trilha de aprovação.",
          },
          { kind: "p", text: "As alçadas são segregadas por setor e faixas de valor:" },
          { kind: "matrix" },
          { kind: "subheading", text: "Regras transversais das alçadas" },
          {
            kind: "list",
            items: [
              "Fluxo de antecedência — a trilha deve ser iniciada pelo gestor imediato (primeira instância) antes de subir para instâncias de diretoria, em todos os setores.",
              "Unicidade — pagamentos que envolvam mais de um centro de custo respeitam a alçada de maior rigor entre os setores envolvidos.",
            ],
          },
        ],
      },
      {
        id: "consumo",
        title: "5. Processamento de Contas de Consumo",
        blocks: [
          {
            kind: "p",
            text: "Para despesas previsíveis, o rito é de aprovação orçamentária:",
          },
          {
            kind: "list",
            items: [
              "Aprovação Orçamentária — o Financeiro prepara orçamento anual baseado na média histórica com margem de segurança de 5% a 10%. Após aprovado pela diretoria, serve como pré-aprovação anual.",
              "Lançamento e Baixa — NFs e faturas recebidas são lançadas no sistema MEGA vinculadas ao orçamento periódico aprovado. Pagamento executado na data de vencimento. Baixa realizada contra o valor orçado, sem necessidade de nova aprovação por fatura individual.",
            ],
            ordered: true,
          },
          {
            kind: "info",
            text: "Este processo elimina a redundância na aprovação de despesas previsíveis, aumentando a agilidade e eficiência operacional do departamento financeiro.",
          },
        ],
      },
      {
        id: "bancarios",
        title: "6. Procedimentos Bancários e Segregação de Funções",
        blocks: [
          { kind: "p", text: "Após aprovação integral no sistema MEGA:" },
          {
            kind: "table",
            headers: ["Papel", "Responsável", "Descrição"],
            rows: [
              ["Acesso Master", "CEO", "Titularidade e gestão do acesso Master no banco."],
              [
                "Efetivação Operacional",
                "Gerente Executivo Financeiro",
                "Execução dos pagamentos no ambiente bancário.",
              ],
            ],
          },
        ],
      },
      {
        id: "fundamentacao",
        title: "7. Fundamentação Técnica",
        blocks: [
          {
            kind: "p",
            text: "A estruturação desta política visa a gestão eficiente do capital de giro, a previsibilidade do fluxo de caixa e o fortalecimento do ambiente de controle através da segregação de funções.",
          },
        ],
      },
    ],
  },

  // ============ ADMISSÃO — SOP-ADM-001 (Publicado) ============
  {
    code: "SOP-ADM-001",
    title: "Processo de Admissão — Standard Operating Procedure",
    type: "SOP",
    category: "Pessoas & Cultura",
    status: "Publicado",
    version: "1.0",
    scope: "Newe Urbanismo Integrativo + Hyndra Participações",
    responsible: "Marlon Silva — Head de Pessoas e Cultura",
    elaboration: "Head de P&C",
    approvalAuthority: "CEO",
    currentStage: "Vigente — Revisão anual",
    classification: "Uso interno — Confidencial",
    year: 2026,
    updatedAt: "Mar 2026",
    department: "Pessoas & Cultura",
    summary:
      "Processo padrão de admissão de novos colaboradores: abertura de vaga, seleção, avaliação aprofundada, offer, pré-admissão e onboarding institucional.",
    approvalChain: publishedChain("28 Mar 2026"),
    related: ["DECK-ADM-001", "FLUX-ADM-001", "PC-SEL-009", "PC-REB-003", "PC-PJS-006", "PC-TDE-004"],
    sections: [
      {
        id: "objetivo",
        title: "1. Objetivo",
        blocks: [
          {
            kind: "p",
            text: "Descreve o processo padrão de admissão de novos colaboradores nas empresas Newe Urbanismo Integrativo e Hyndra Participações, garantindo consistência, qualidade na seleção, conformidade legal e experiência de integração alinhada à cultura organizacional.",
          },
        ],
      },
      {
        id: "escopo",
        title: "2. Escopo",
        blocks: [
          {
            kind: "p",
            text: "Aplicável a todas as contratações, independentemente de regime (CLT ou PJ), nível hierárquico ou área de negócio. Abrange desde a abertura da requisição de vaga até o onboarding funcional.",
          },
        ],
      },
      {
        id: "responsabilidades",
        title: "3. Partes Interessadas e Responsabilidades",
        blocks: [
          {
            kind: "table",
            headers: ["Parte interessada", "Papel no processo"],
            rows: [
              ["Gestor demandante", "Solicita a vaga, valida perfil, conduz entrevista e realiza onboarding funcional."],
              [
                "Pessoas e Cultura (Marlon Silva)",
                "Coordena todo o processo: análise, hunting, seleção, assessments, offer e onboarding institucional.",
              ],
              ["CEO", "Aprova headcount em casos não previstos em orçamento."],
              ["T.I", "Prepara acessos, e-mails, equipamentos e realiza entrega no Dia 1."],
              ["Suprimentos", "Providencia itens previstos em offer (carro, equipamentos, benefícios)."],
              ["Jurídico", "Orienta candidatos PJ sobre CNPJ/MEI e formaliza contratos."],
              ["Saúde Ocupacional", "Realiza exame admissional para colaboradores CLT."],
              ["Contabilidade Volpi", "Recebe documentação para registro formal de colaboradores CLT."],
            ],
          },
        ],
      },
      {
        id: "fase-1",
        title: "4. Fase 1 — Abertura e Aprovação da Vaga",
        blocks: [
          {
            kind: "table",
            headers: ["Etapa", "Descrição / Ação", "Responsável", "Prazo", "Formulário"],
            rows: [
              ["1.1 Solicitação", "Gestor preenche o Formulário de Abertura de Vaga (Job Requisition).", "Gestor demandante", "Demanda pontual", "Job Requisition"],
              ["1.2 Análise P&C", "Marlon avalia pertinência estratégica, fit cultural e necessidade real.", "P&C — Marlon", "Até 2 dias úteis", "—"],
              ["1.3 Verificação de orçamento", "Verifica se há headcount aprovado. Se não, aciona o CEO.", "P&C / CEO", "Até 3 dias úteis", "—"],
              ["1.4 Verificação de JD", "Se cargo não tem JD, gestor preenche formulário de JD.", "P&C / Gestor", "Até 3 dias úteis", "Job Description"],
            ],
          },
          {
            kind: "warning",
            text: "Ponto de decisão — sem orçamento, o processo aguarda CEO. Se o CEO não aprovar, o processo é encerrado.",
          },
        ],
      },
      {
        id: "fase-2",
        title: "5. Fase 2 — Recrutamento e Seleção",
        blocks: [
          {
            kind: "table",
            headers: ["Etapa", "Descrição / Ação", "Responsável", "Prazo"],
            rows: [
              ["2.1 Hunting", "P&C inicia busca ativa via canais adequados à posição.", "P&C — Marlon", "7 a 21 dias úteis"],
              ["2.2 Triagem", "Análise de currículos, requisitos técnicos mínimos e fit cultural básico.", "P&C — Marlon", "Contínuo"],
              ["2.3 Validação de perfil", "P&C apresenta shortlist ao gestor para validação.", "P&C + Gestor", "Até 2 dias úteis"],
              ["2.4 Entrevista gestor", "Gestor conduz entrevista técnica e cultural. Feedback em até 24h.", "Gestor demandante", "Até 5 dias úteis"],
            ],
          },
          {
            kind: "info",
            text: "Loops — perfil reprovado por P&C → novo candidato ao hunting. Gestor reprova → retorna ao hunting.",
          },
        ],
      },
      {
        id: "fase-3",
        title: "6. Fase 3 — Avaliação Aprofundada",
        blocks: [
          {
            kind: "table",
            headers: ["Etapa", "Descrição / Ação", "Responsável", "Prazo"],
            rows: [
              ["3.1 Cadastro básico", "P&C envia formulário ao candidato: e-mail, CPF e dados para due diligence.", "P&C", "Imediato"],
              ["3.2 Assessment", "DISC (tático/operacional) ou Hogan (estratégico/liderança).", "P&C", "3 a 5 dias úteis"],
              ["3.3 Diligências", "Verificação de antecedentes, referências profissionais e checagens.", "P&C", "5 a 7 dias úteis"],
              ["3.4 Teste técnico", "Quando aplicável, P&C conduz ou coordena teste de proficiência técnica.", "P&C", "3 a 5 dias úteis"],
            ],
          },
          {
            kind: "warning",
            text: "Reprovação no teste técnico → retorno ao hunting. Reprovação nas diligências → processo encerrado.",
          },
        ],
      },
      {
        id: "fase-4",
        title: "7. Fase 4 — Offer",
        blocks: [
          {
            kind: "table",
            headers: ["Etapa", "Descrição / Ação", "Responsável", "Prazo"],
            rows: [
              ["4.1 Estudo de remuneração", "P&C elabora proposta com base em mercado e faixa interna.", "P&C", "3 a 5 dias úteis"],
              ["4.2 Apresentação da offer", "P&C apresenta a oferta ao candidato.", "P&C", "Retorno em até 3 dias úteis"],
              ["4.3 Negociação", "Candidato pode apresentar contraproposta. P&C avalia viabilidade.", "P&C", "Até 2 dias úteis"],
            ],
          },
        ],
      },
      {
        id: "fase-5",
        title: "8. Fase 5 — Pré-Admissão e Preparação",
        blocks: [
          {
            kind: "table",
            headers: ["Etapa", "Descrição / Ação", "Responsável", "Prazo"],
            rows: [
              ["5.1 T.I", "Criação de acessos, e-mail institucional e separação de equipamentos.", "P&C → T.I", "Até 5 dias antes do Dia 1"],
              ["5.2 Suprimentos", "Veículo, equipamentos ou outros benefícios da offer.", "P&C → Suprimentos", "Até 5 dias antes do Dia 1"],
              ["5.3 PJ — Jurídico", "Orientação sobre criação de CNPJ/MEI e formalização do contrato.", "P&C → Jurídico", "Até 7 dias antes do Dia 1"],
              ["5.4 CLT — Saúde Ocupacional", "Exame admissional. Resultado 'Apto' é pré-requisito para o Dia 1.", "P&C → S. Ocupacional", "Até 7 dias antes do Dia 1"],
              ["5.5 CLT — Documentação", "P&C envia checklist CLT e encaminha docs + laudo à Volpi.", "P&C → Volpi", "Até 3 dias antes do Dia 1"],
            ],
          },
        ],
      },
      {
        id: "fase-6",
        title: "9. Fase 6 — Dia 1 e Onboarding",
        blocks: [
          {
            kind: "table",
            headers: ["Etapa", "Descrição / Ação", "Responsável", "Prazo"],
            rows: [
              ["6.1 T.I — Dia 1", "Entrega de equipamentos + Termo de Responsabilidade de Ativo.", "T.I", "Dia 1 — manhã"],
              ["6.2 Onboarding de sistemas", "Tour pelos sistemas, ferramentas e segurança.", "T.I", "Dia 1 — manhã"],
              ["6.3 Onboarding institucional", "Cultura, missão, valores, agenda e buddy.", "P&C — Marlon", "Dia 1 — tarde"],
              ["6.4 Onboarding funcional", "Gestor apresenta o time, rotina e primeiras entregas.", "Gestor demandante", "Dia 1 → 1ª semana"],
            ],
          },
        ],
      },
      {
        id: "formularios",
        title: "10. Formulários Vinculados",
        blocks: [
          {
            kind: "table",
            headers: ["Formulário", "Fase", "Objetivo"],
            rows: [
              ["Job Requisition", "Fase 1", "Formaliza a demanda do gestor: justificativa, perfil, regime, faixa salarial e orçamento."],
              ["Job Description", "Fase 1", "Descreve o cargo: missão, entregas, competências, KPIs e hierarquia."],
              ["Cadastro Básico do Candidato", "Fase 3", "Coleta dados do candidato aprovado para due diligence e offer."],
              ["Checklist de Documentos CLT", "Fase 5", "Orienta o candidato CLT sobre documentos para registro na Volpi."],
            ],
          },
        ],
      },
      {
        id: "prazos",
        title: "11. Prazos Orientativos por Nível",
        blocks: [
          {
            kind: "table",
            headers: ["Tipo de posição", "Prazo mínimo", "Prazo máximo"],
            rows: [
              ["Operacional / Técnico", "20 dias úteis", "35 dias úteis"],
              ["Tático / Coordenação", "25 dias úteis", "45 dias úteis"],
              ["Estratégico / Liderança", "35 dias úteis", "60 dias úteis"],
            ],
          },
        ],
      },
      {
        id: "regras",
        title: "12. Regras e Diretrizes",
        blocks: [
          {
            kind: "list",
            items: [
              "Nenhuma vaga divulgada externamente sem aceite formal de P&C.",
              "Nenhuma oferta apresentada sem aprovação prévia interna de P&C.",
              "Candidatos sem assessment + diligências completos não são contratados, salvo exceção documentada e aprovada pelo CEO.",
              "DISC: posições operacionais e táticas | Hogan: posições de liderança e estratégicas.",
              "Dados sensíveis (assessments, diligências, histórico salarial): acesso exclusivo de P&C e CEO.",
            ],
          },
        ],
      },
    ],
  },

  // ============ DECK-ADM-001 (Publicado) ============
  {
    code: "DECK-ADM-001",
    title: "Processo de Admissão — Apresentação Institucional",
    type: "Apresentação",
    category: "Pessoas & Cultura",
    status: "Publicado",
    version: "1.0",
    scope: "Newe Urbanismo Integrativo + Hyndra Participações",
    responsible: "Marlon Silva — Head de Pessoas e Cultura",
    elaboration: "Head de P&C",
    approvalAuthority: "CEO",
    currentStage: "Vigente",
    classification: "Uso interno — Confidencial",
    year: 2026,
    updatedAt: "Mar 2026",
    department: "Pessoas & Cultura",
    summary:
      "Apresentação institucional do processo de admissão em 19 slides — visão geral, fases, formulários e prazos.",
    approvalChain: publishedChain("28 Mar 2026"),
    related: ["SOP-ADM-001", "FLUX-ADM-001"],
    sections: [
      {
        id: "deck",
        title: "Slides",
        blocks: [{ kind: "slides" }],
      },
    ],
  },

  // ============ FLUX-ADM-001 (Publicado) ============
  {
    code: "FLUX-ADM-001",
    title: "Processo de Admissão — Fluxograma End-to-End",
    type: "Fluxograma",
    category: "Pessoas & Cultura",
    status: "Publicado",
    version: "1.0",
    scope: "Newe Urbanismo Integrativo + Hyndra Participações",
    responsible: "Marlon Silva — Head de Pessoas e Cultura",
    elaboration: "Head de P&C",
    approvalAuthority: "CEO",
    currentStage: "Vigente",
    classification: "Uso interno — Confidencial",
    year: 2026,
    updatedAt: "Mar 2026",
    department: "Pessoas & Cultura",
    summary:
      "Fluxograma interativo do processo de admissão — 6 fases com swimlanes, pontos de decisão, loops e nós de encerramento.",
    approvalChain: publishedChain("28 Mar 2026"),
    related: ["SOP-ADM-001", "DECK-ADM-001"],
    sections: [
      {
        id: "fluxo",
        title: "Fluxograma",
        blocks: [{ kind: "flowchart" }],
      },
    ],
  },

  // ============ P&C POLICIES (Em Aprovação) ============
  {
    ...pcBase,
    code: "PC-EDU-001",
    type: "Política",
    title: "Bolsas de Estudo e Incentivos à Educação",
    summary:
      "Diretrizes para concessão de bolsas de estudo, subsídios educacionais e incentivos ao desenvolvimento acadêmico.",
    approvalChain: pendingChain(),
    related: ["FSB-001", "TC-EDU-001", "PC-TDE-004"],
    sections: policySectionsCommon(
      "Bolsas de Estudo e Incentivos à Educação",
      [
        "Educação como vetor de transformação institucional e individual.",
        "Equidade de acesso conforme critérios meritocráticos e estratégicos.",
        "Compromisso recíproco entre Hyndra e colaborador beneficiado.",
        "Transparência nos critérios e na governança do programa.",
      ],
      [
        { kind: "p", text: "O programa estrutura-se em quatro tiers de cobertura conforme nível e impacto estratégico:" },
        {
          kind: "table",
          headers: ["Tier", "Público", "Cobertura"],
          rows: [
            ["T1", "Liderança estratégica", "Até 100% — MBA / Pós executiva"],
            ["T2", "Tático / Coordenação", "Até 80% — Pós e especializações"],
            ["T3", "Técnico / Analista", "Até 60% — Graduação / curta duração"],
            ["T4", "Operacional", "Até 50% — Idiomas / cursos livres"],
          ],
        },
        {
          kind: "p",
          text: "A solicitação ocorre pelo Formulário FSB-001, com parecer do líder direto, análise técnica do P&C e deliberação do comitê de educação. Aprovações exigem assinatura do Termo TC-EDU-001 (cláusula de permanência).",
        },
      ],
    ),
  },
  {
    ...pcBase,
    code: "PC-CGE-005",
    type: "Política",
    title: "Ciclo de Gente — Gestão de Desempenho",
    summary: "Estrutura institucional do ciclo anual de avaliação, calibração e desenvolvimento de talentos.",
    approvalChain: pendingChain(),
    related: ["PC-TDE-004", "PC-REB-003"],
    sections: policySectionsCommon(
      "Ciclo de Gente",
      [
        "Avaliação contínua, justa e baseada em evidências.",
        "Conexão entre desempenho, desenvolvimento e remuneração.",
        "Calibração colegiada para mitigar vieses individuais.",
        "Diálogos estruturados de feedback e plano de desenvolvimento.",
      ],
      [
        { kind: "subheading", text: "Quatro momentos (M1–M4)" },
        {
          kind: "table",
          headers: ["Momento", "Foco", "Periodicidade"],
          rows: [
            ["M1 — Contratação de metas", "Definição de OKRs e comportamentos", "Janeiro"],
            ["M2 — Check-in", "Calibração intermediária", "Maio"],
            ["M3 — Avaliação", "Auto + líder + calibração", "Setembro"],
            ["M4 — PDI & Mérito", "Plano de desenvolvimento e decisões", "Novembro"],
          ],
        },
        {
          kind: "p",
          text: "Resultados alimentam decisões de mérito, sucessão, mobilidade interna e construção de PDI individualizado.",
        },
      ],
    ),
  },
  {
    ...pcBase,
    code: "PC-COM-007",
    type: "Política",
    title: "Comunicação Interna e Endomarketing",
    summary: "Princípios e canais oficiais de comunicação interna e endomarketing institucional.",
    approvalChain: pendingChain(),
    sections: policySectionsCommon(
      "Comunicação Interna",
      [
        "Verdade institucional como base de toda mensagem interna.",
        "Cadência previsível e canais oficiais reconhecidos.",
        "Linguagem clara, refinada e coerente com a marca Hyndra.",
        "Escuta ativa e mecanismos formais de retorno.",
      ],
      [
        { kind: "subheading", text: "Arquitetura de canais" },
        {
          kind: "list",
          items: [
            "Comunicados oficiais — autoria CEO / Head de P&C.",
            "Newsletter institucional — quinzenal.",
            "Townhall — trimestral, presença executiva.",
            "Canais de área — operados pelos líderes.",
          ],
        },
        {
          kind: "p",
          text: "Comunicações estratégicas seguem matriz de aprovação P&C + CEO. Endomarketing é planejado em calendário trimestral conectado aos pilares culturais.",
        },
      ],
    ),
  },
  {
    ...pcBase,
    code: "PC-PJS-006",
    type: "Política",
    title: "Contratação de Prestadores PJ",
    summary: "Critérios, governança e limites para contratação de prestadores de serviço pessoa jurídica.",
    approvalChain: pendingChain(),
    sections: policySectionsCommon(
      "Contratação PJ",
      [
        "PJ como modalidade de exceção, justificada por especialização ou projeto.",
        "Conformidade legal e tributária inegociável.",
        "Governança formal de aprovação e renovação.",
        "Mitigação de riscos trabalhistas e reputacionais.",
      ],
      [
        {
          kind: "subheading",
          text: "Indicadores de risco (sinais de alerta)",
        },
        {
          kind: "list",
          items: [
            "Subordinação jurídica direta a líder Hyndra.",
            "Habitualidade e exclusividade prolongadas.",
            "Onerosidade fixa sem entrega definida.",
            "Pessoalidade insubstituível na execução.",
          ],
        },
        {
          kind: "p",
          text: "Toda contratação PJ exige parecer jurídico, aprovação do diretor da área e validação do P&C. Contratos seguem modelo padrão com cláusulas mínimas obrigatórias.",
        },
      ],
    ),
  },
  {
    ...pcBase,
    code: "PC-REB-003",
    type: "Política",
    title: "Remuneração e Benefícios",
    summary: "Estrutura de remuneração fixa, variável e benefícios institucionais.",
    approvalChain: pendingChain(),
    related: ["PC-CGE-005"],
    sections: policySectionsCommon(
      "Remuneração e Benefícios",
      [
        "Equidade interna e competitividade externa balanceadas.",
        "Pacote total reconhecendo contribuição e responsabilidade.",
        "Governança colegiada para movimentações salariais.",
        "Transparência de critérios e estrutura de cargos.",
      ],
      [
        { kind: "subheading", text: "Níveis institucionais" },
        {
          kind: "table",
          headers: ["Nível", "Faixa", "Composição"],
          rows: [
            ["N1", "Operacional", "Fixo + benefícios obrigatórios"],
            ["N2", "Técnico", "Fixo + variável anual"],
            ["N3", "Especialista / Coord.", "Fixo + variável + benefícios corporativos"],
            ["N4", "Gerencial", "Pacote total + LTI"],
            ["N5", "Diretoria", "Pacote total + LTI + ações de longo prazo"],
          ],
        },
        {
          kind: "p",
          text: "Estrutura salarial é revisada anualmente com pesquisa de mercado de referência. Movimentações exigem parecer do líder, análise do P&C e aprovação do diretor de área.",
        },
      ],
    ),
  },
  {
    ...pcBase,
    code: "PC-SEL-009",
    type: "Política",
    title: "Seleção de Talentos",
    summary: "Princípios, etapas e governança do processo de seleção de talentos.",
    approvalChain: pendingChain(),
    related: ["SOP-ADM-001"],
    sections: policySectionsCommon(
      "Seleção de Talentos",
      [
        "Aderência cultural e técnica como critérios complementares.",
        "Diversidade como vetor de inteligência coletiva.",
        "Processo estruturado, documentado e auditável.",
        "Experiência respeitosa e refinada para todo candidato.",
      ],
      [
        {
          kind: "p",
          text: "Vagas são abertas com job description aprovado. O funil contempla triagem, entrevistas técnica e cultural, painel com líderes e proposta formalizada pelo P&C.",
        },
        {
          kind: "info",
          text: "Operacionalização detalhada: ver SOP-ADM-001 — Processo de Admissão.",
        },
      ],
    ),
  },
  {
    ...pcBase,
    code: "PC-SST-008",
    type: "Política",
    title: "Saúde e Segurança do Trabalho",
    summary: "Diretrizes institucionais de saúde, segurança e bem-estar no ambiente de trabalho.",
    approvalChain: pendingChain(),
    sections: policySectionsCommon(
      "Saúde e Segurança do Trabalho",
      [
        "Vida e integridade como prioridade absoluta.",
        "Conformidade plena com NRs e normas regulatórias.",
        "Cultura de prevenção e responsabilidade compartilhada.",
        "Bem-estar integral: físico, mental e psicossocial.",
      ],
      [
        {
          kind: "list",
          items: [
            "PCMSO — Programa de Controle Médico de Saúde Ocupacional.",
            "PGR — Programa de Gerenciamento de Riscos.",
            "Treinamentos obrigatórios por NR aplicável.",
            "Comunicação formal de incidentes e auditorias periódicas.",
          ],
        },
      ],
    ),
  },
  {
    ...pcBase,
    code: "PC-TDE-004",
    type: "Política",
    title: "Treinamento e Desenvolvimento",
    summary: "Diretrizes para programas de treinamento, capacitação e desenvolvimento de carreira.",
    approvalChain: pendingChain(),
    related: ["PC-EDU-001", "PC-CGE-005"],
    sections: policySectionsCommon(
      "Treinamento e Desenvolvimento",
      [
        "Aprendizagem contínua como pilar cultural.",
        "Desenvolvimento atrelado a estratégia e PDI individual.",
        "Combinação de trilhas formais, mentoria e on-the-job.",
        "Mensuração de efetividade e ROI educacional.",
      ],
      [
        { kind: "subheading", text: "Quatro trilhas institucionais" },
        {
          kind: "list",
          items: [
            "Trilha Técnica — domínio funcional da área.",
            "Trilha de Liderança — gestão de pessoas e ciclos.",
            "Trilha Institucional — cultura, governança e marca.",
            "Trilha Estratégica — visão de negócio e mercado.",
          ],
        },
        {
          kind: "p",
          text: "Plano anual de T&D é construído a partir do Ciclo de Gente, gaps estratégicos e demandas das áreas, com priorização orçamentária aprovada pelo CEO.",
        },
      ],
    ),
  },

  // ============ Suporte ============
  {
    ...pcBase,
    code: "FSB-001",
    type: "Formulário",
    title: "Formulário de Solicitação de Bolsa",
    summary: "Formulário institucional para solicitação de bolsa de estudo, vinculado à PC-EDU-001.",
    approvalChain: pendingChain(),
    related: ["PC-EDU-001", "TC-EDU-001"],
    sections: [
      {
        id: "uso",
        title: "1. Uso do Formulário",
        blocks: [
          { kind: "p", text: "Documento de preenchimento obrigatório para todo colaborador interessado em pleitear bolsa de estudo no âmbito do programa institucional Hyndra." },
          { kind: "info", text: "O preenchimento incompleto inviabiliza a análise pelo comitê de educação." },
        ],
      },
      {
        id: "campos",
        title: "2. Campos Obrigatórios",
        blocks: [
          { kind: "list", items: ["Dados do colaborador", "Descrição do curso", "Instituição", "Carga horária", "Valor", "Justificativa estratégica", "Parecer do líder direto", "Contrapartidas propostas"] },
        ],
      },
      {
        id: "fluxo",
        title: "3. Fluxo de Aprovação",
        blocks: [{ kind: "p", text: "Colaborador → Líder direto → Head de P&C → Comitê de Educação → Diretoria → Assinatura do TC-EDU-001." }],
      },
    ],
  },
  {
    ...pcBase,
    code: "TC-EDU-001",
    type: "Documento",
    title: "Termo de Compromisso — Bolsa de Estudo",
    summary: "Termo formal de compromisso recíproco entre Hyndra e colaborador beneficiado por bolsa.",
    approvalChain: pendingChain(),
    related: ["PC-EDU-001", "FSB-001"],
    sections: [
      {
        id: "natureza",
        title: "1. Natureza do Termo",
        blocks: [{ kind: "p", text: "Instrumento jurídico que formaliza direitos e obrigações entre Hyndra Participações e o colaborador beneficiado, em conformidade com a Política PC-EDU-001." }],
      },
      {
        id: "compromissos",
        title: "2. Compromissos do Beneficiado",
        blocks: [
          { kind: "p", text: "Manutenção de aproveitamento mínimo, prestação de contas semestral, permanência mínima após conclusão e devolução proporcional em caso de desligamento voluntário." },
          { kind: "warning", text: "O descumprimento das cláusulas implica restituição integral dos valores pagos pela Hyndra, atualizados monetariamente." },
        ],
      },
      {
        id: "compromissos-hyndra",
        title: "3. Compromissos da Hyndra",
        blocks: [{ kind: "p", text: "Custeio dos valores aprovados, flexibilidade razoável de jornada para fins acadêmicos e reconhecimento institucional do desenvolvimento adquirido." }],
      },
    ],
  },
];

// ---------- Categories ----------
export const categories: { name: DocCategory; description: string; executive: string; icon: string; active: boolean }[] = [
  { name: "Pessoas & Cultura", description: "Políticas que estruturam a relação entre Hyndra e seu capital humano.", executive: "Head de Pessoas & Cultura", icon: "Users", active: true },
  { name: "Financeiro", description: "Governança financeira, controles internos e gestão de capital.", executive: "Gerente de Governança", icon: "Wallet", active: true },
  { name: "Jurídico", description: "Diretrizes contratuais, regulatórias e de proteção institucional.", executive: "Head Jurídico", icon: "Scale", active: false },
  { name: "Operações", description: "Padrões operacionais e excelência de execução.", executive: "COO", icon: "Building2", active: false },
  { name: "Compliance", description: "Integridade, ética e conformidade institucional.", executive: "Compliance Officer", icon: "ShieldCheck", active: false },
  { name: "Governança", description: "Estrutura societária, conselhos e tomada de decisão.", executive: "Conselho Deliberativo", icon: "Landmark", active: false },
];

export const getDocByCode = (code: string) => documents.find((d) => d.code === code);
export const getDocsByCategory = (cat: DocCategory) => documents.filter((d) => d.category === cat);
