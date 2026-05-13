export type DocStatus = "Publicado" | "Em Aprovação" | "Em Revisão" | "Arquivado";
export type DocCategory =
  | "Pessoas & Cultura"
  | "Jurídico"
  | "Financeiro"
  | "Operações"
  | "Compliance"
  | "Governança";

export type ApprovalStage = {
  name: string;
  status: "done" | "current" | "pending";
  date?: string;
};

export type DocSection = {
  id: string;
  title: string;
  body: string; // markdown-ish, simple paragraphs separated by \n\n
  highlight?: string;
  warning?: string;
};

export type Document = {
  code: string;
  title: string;
  type: "Política" | "Procedimento" | "Formulário" | "Documento";
  category: DocCategory;
  status: DocStatus;
  version: string;
  scope: string;
  responsible: string;
  elaboration: string;
  approvalAuthority: string;
  currentStage: string;
  effectiveDate?: string;
  updatedAt: string;
  year: number;
  summary: string;
  approvalChain: ApprovalStage[];
  sections: DocSection[];
  related?: string[];
};

const baseChain = (): ApprovalStage[] => [
  { name: "Elaboração", status: "done", date: "12 Mar 2026" },
  { name: "Diretoria", status: "done", date: "28 Mar 2026" },
  { name: "CEO", status: "current" },
  { name: "Conselho Deliberativo", status: "pending" },
];

const baseMeta = {
  category: "Pessoas & Cultura" as const,
  status: "Em Aprovação" as const,
  version: "1.0 — Primeira Emissão",
  scope: "Hyndra Participações e Empresas Participadas",
  responsible: "Head de Pessoas & Cultura",
  elaboration: "Head de P&C",
  approvalAuthority: "Conselho Deliberativo",
  currentStage: "CEO — Pendente",
  year: 2026,
  updatedAt: "28 Mar 2026",
};

const policySections = (title: string, principles: string[], proceduresIntro: string): DocSection[] => [
  {
    id: "objetivo",
    title: "1. Objetivo",
    body: `Estabelecer diretrizes, princípios e responsabilidades referentes a ${title.toLowerCase()} no âmbito da Hyndra Participações e suas empresas participadas, assegurando alinhamento estratégico, equidade e excelência operacional.`,
    highlight: "Aplicação institucional uniforme em todas as empresas do grupo, respeitando as particularidades operacionais de cada negócio.",
  },
  {
    id: "abrangencia",
    title: "2. Abrangência",
    body: "Aplica-se a todos os colaboradores, líderes, diretores e prestadores de serviço da Hyndra Participações e empresas participadas, em todas as unidades e modalidades de trabalho.",
  },
  {
    id: "principios",
    title: "3. Princípios",
    body: principles.map((p, i) => `${i + 1}. ${p}`).join("\n\n"),
  },
  {
    id: "responsabilidades",
    title: "4. Responsabilidades",
    body: "Conselho Deliberativo: aprovar a política e seus desvios estruturais.\n\nCEO: garantir a aplicação institucional e zelar pela cultura.\n\nHead de P&C: gerir, manter e atualizar o documento.\n\nLíderes: aplicar consistentemente em suas equipes.\n\nColaboradores: conhecer, respeitar e reportar desvios.",
  },
  {
    id: "procedimentos",
    title: "5. Procedimentos",
    body: proceduresIntro,
    warning: "Qualquer exceção a esta política deve ser formalmente aprovada pelo CEO mediante parecer do Head de P&C.",
  },
  {
    id: "vigencia",
    title: "6. Vigência e Revisão",
    body: "Esta política entra em vigor na data de aprovação pelo Conselho Deliberativo e será revisada a cada 24 meses ou sempre que mudanças regulatórias ou estratégicas exigirem.",
  },
];

export const documents: Document[] = [
  {
    ...baseMeta,
    code: "PC-EDU-001",
    type: "Política",
    title: "Bolsas de Estudo e Incentivos à Educação",
    summary: "Diretrizes para concessão de bolsas de estudo, subsídios educacionais e incentivos ao desenvolvimento acadêmico de colaboradores.",
    approvalChain: baseChain(),
    related: ["FSB-001", "TC-EDU-001", "PC-TDE-004"],
    sections: policySections(
      "Bolsas de Estudo e Incentivos à Educação",
      [
        "Educação como vetor de transformação institucional e individual.",
        "Equidade de acesso conforme critérios meritocráticos e estratégicos.",
        "Compromisso recíproco entre Hyndra e colaborador beneficiado.",
        "Transparência nos critérios e na governança do programa.",
      ],
      "A solicitação ocorre por meio do Formulário FSB-001, com parecer do líder direto, análise técnica do P&C e deliberação do comitê de educação. Aprovações exigem assinatura do Termo de Compromisso TC-EDU-001."
    ),
  },
  {
    ...baseMeta,
    code: "PC-CGE-005",
    type: "Política",
    title: "Ciclo de Gente — Gestão de Desempenho",
    summary: "Estrutura institucional do ciclo anual de avaliação de desempenho, calibração e desenvolvimento de talentos.",
    approvalChain: baseChain(),
    related: ["PC-TDE-004", "PC-REB-003"],
    sections: policySections(
      "Ciclo de Gente",
      [
        "Avaliação contínua, justa e baseada em evidências.",
        "Conexão entre desempenho, desenvolvimento e remuneração.",
        "Calibração colegiada para mitigar vieses individuais.",
        "Diálogos estruturados de feedback e plano de desenvolvimento.",
      ],
      "O ciclo anual contempla autoavaliação, avaliação do líder, calibração por comitê, devolutiva formal e construção de PDI. Resultados alimentam decisões de mérito, sucessão e mobilidade interna."
    ),
  },
  {
    ...baseMeta,
    code: "PC-COM-007",
    type: "Política",
    title: "Comunicação Interna e Endomarketing",
    summary: "Princípios e canais oficiais de comunicação interna e endomarketing institucional.",
    approvalChain: baseChain(),
    sections: policySections(
      "Comunicação Interna",
      [
        "Verdade institucional como base de toda mensagem interna.",
        "Cadência previsível e canais oficiais reconhecidos.",
        "Linguagem clara, refinada e coerente com a marca Hyndra.",
        "Escuta ativa e mecanismos formais de retorno.",
      ],
      "Comunicações estratégicas seguem matriz de aprovação P&C + CEO. Endomarketing é planejado em calendário trimestral e conectado aos pilares culturais."
    ),
  },
  {
    ...baseMeta,
    code: "PC-PJS-006",
    type: "Política",
    title: "Contratação de Prestadores PJ",
    summary: "Critérios, governança e limites para contratação de prestadores de serviço pessoa jurídica.",
    approvalChain: baseChain(),
    sections: policySections(
      "Contratação PJ",
      [
        "PJ como modalidade de exceção, justificada por especialização ou projeto.",
        "Conformidade legal e tributária inegociável.",
        "Governança formal de aprovação e renovação.",
        "Mitigação de riscos trabalhistas e reputacionais.",
      ],
      "Toda contratação PJ exige parecer jurídico, aprovação do diretor da área e validação do P&C. Contratos seguem modelo padrão com cláusulas mínimas obrigatórias."
    ),
  },
  {
    ...baseMeta,
    code: "PC-REB-003",
    type: "Política",
    title: "Remuneração e Benefícios",
    summary: "Estrutura de remuneração fixa, variável e benefícios institucionais.",
    approvalChain: baseChain(),
    related: ["PC-CGE-005"],
    sections: policySections(
      "Remuneração e Benefícios",
      [
        "Equidade interna e competitividade externa balanceadas.",
        "Pacote total reconhecendo contribuição e responsabilidade.",
        "Governança colegiada para movimentações salariais.",
        "Transparência de critérios e estrutura de cargos.",
      ],
      "Estrutura salarial é revisada anualmente com pesquisa de mercado de referência. Movimentações exigem parecer do líder, análise do P&C e aprovação do diretor de área."
    ),
  },
  {
    ...baseMeta,
    code: "PC-SEL-009",
    type: "Política",
    title: "Seleção de Talentos",
    summary: "Princípios, etapas e governança do processo de seleção de talentos.",
    approvalChain: baseChain(),
    sections: policySections(
      "Seleção de Talentos",
      [
        "Aderência cultural e técnica como critérios complementares.",
        "Diversidade como vetor de inteligência coletiva.",
        "Processo estruturado, documentado e auditável.",
        "Experiência respeitosa e refinada para todo candidato.",
      ],
      "Vagas são abertas com job description aprovado. O funil contempla triagem, entrevistas técnica e cultural, painel com líderes e proposta formalizada pelo P&C."
    ),
  },
  {
    ...baseMeta,
    code: "PC-SST-008",
    type: "Política",
    title: "Saúde e Segurança do Trabalho",
    summary: "Diretrizes institucionais de saúde, segurança e bem-estar no ambiente de trabalho.",
    approvalChain: baseChain(),
    sections: policySections(
      "Saúde e Segurança do Trabalho",
      [
        "Vida e integridade como prioridade absoluta.",
        "Conformidade plena com NRs e normas regulatórias.",
        "Cultura de prevenção e responsabilidade compartilhada.",
        "Bem-estar integral: físico, mental e psicossocial.",
      ],
      "Inclui PCMSO, PGR, treinamentos obrigatórios, comunicação de incidentes e auditorias periódicas em todas as unidades."
    ),
  },
  {
    ...baseMeta,
    code: "PC-TDE-004",
    type: "Política",
    title: "Treinamento e Desenvolvimento",
    summary: "Diretrizes para programas de treinamento, capacitação e desenvolvimento de carreira.",
    approvalChain: baseChain(),
    related: ["PC-EDU-001", "PC-CGE-005"],
    sections: policySections(
      "Treinamento e Desenvolvimento",
      [
        "Aprendizagem contínua como pilar cultural.",
        "Desenvolvimento atrelado a estratégia e PDI individual.",
        "Combinação de trilhas formais, mentoria e on-the-job.",
        "Mensuração de efetividade e ROI educacional.",
      ],
      "Plano anual de T&D é construído a partir do Ciclo de Gente, gaps estratégicos e demandas das áreas, com priorização orçamentária aprovada pelo CEO."
    ),
  },
  {
    ...baseMeta,
    code: "FSB-001",
    type: "Formulário",
    title: "Formulário de Solicitação de Bolsa",
    summary: "Formulário institucional para solicitação de bolsa de estudo, vinculado à PC-EDU-001.",
    approvalChain: baseChain(),
    related: ["PC-EDU-001", "TC-EDU-001"],
    sections: [
      {
        id: "uso",
        title: "1. Uso do Formulário",
        body: "Documento de preenchimento obrigatório para todo colaborador interessado em pleitear bolsa de estudo no âmbito do programa institucional Hyndra.",
        highlight: "O preenchimento incompleto inviabiliza a análise pelo comitê de educação.",
      },
      {
        id: "campos",
        title: "2. Campos Obrigatórios",
        body: "Dados do colaborador, descrição do curso, instituição, carga horária, valor, justificativa estratégica, parecer do líder direto e contrapartidas propostas.",
      },
      {
        id: "fluxo",
        title: "3. Fluxo de Aprovação",
        body: "Colaborador → Líder direto → Head de P&C → Comitê de Educação → Diretoria → Assinatura do TC-EDU-001.",
      },
    ],
  },
  {
    ...baseMeta,
    code: "TC-EDU-001",
    type: "Documento",
    title: "Termo de Compromisso — Bolsa de Estudo",
    summary: "Termo formal de compromisso recíproco entre Hyndra e colaborador beneficiado por bolsa de estudo.",
    approvalChain: baseChain(),
    related: ["PC-EDU-001", "FSB-001"],
    sections: [
      {
        id: "natureza",
        title: "1. Natureza do Termo",
        body: "Instrumento jurídico que formaliza direitos e obrigações entre Hyndra Participações e o colaborador beneficiado, em conformidade com a Política PC-EDU-001.",
      },
      {
        id: "compromissos",
        title: "2. Compromissos do Beneficiado",
        body: "Manutenção de aproveitamento mínimo, prestação de contas semestral, permanência mínima após conclusão e devolução proporcional em caso de desligamento voluntário.",
        warning: "O descumprimento das cláusulas implica restituição integral dos valores pagos pela Hyndra, atualizados monetariamente.",
      },
      {
        id: "compromissos-hyndra",
        title: "3. Compromissos da Hyndra",
        body: "Custeio dos valores aprovados, flexibilidade razoável de jornada para fins acadêmicos e reconhecimento institucional do desenvolvimento adquirido.",
      },
    ],
  },
];

export const categories: { name: DocCategory; description: string; executive: string; icon: string }[] = [
  { name: "Pessoas & Cultura", description: "Políticas que estruturam a relação entre Hyndra e seu capital humano.", executive: "Head de Pessoas & Cultura", icon: "Users" },
  { name: "Jurídico", description: "Diretrizes contratuais, regulatórias e de proteção institucional.", executive: "Head Jurídico", icon: "Scale" },
  { name: "Financeiro", description: "Governança financeira, controles e gestão de capital.", executive: "CFO", icon: "Wallet" },
  { name: "Operações", description: "Padrões operacionais e excelência de execução.", executive: "COO", icon: "Building2" },
  { name: "Compliance", description: "Integridade, ética e conformidade institucional.", executive: "Compliance Officer", icon: "ShieldCheck" },
  { name: "Governança", description: "Estrutura societária, conselhos e tomada de decisão.", executive: "Conselho Deliberativo", icon: "Landmark" },
];

export const getDocByCode = (code: string) => documents.find((d) => d.code === code);
export const getDocsByCategory = (cat: DocCategory) => documents.filter((d) => d.category === cat);
