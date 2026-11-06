/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Dados Fictícios de Demonstração Homologados para Prototipação
 * IMPORTANTE: Dados estritamente simulados. Nenhum dado sensível de paciente ou credencial real.
 */

import { 
  Ticket, 
  Technician, 
  PendingItem, 
  AuditSnapshot, 
  ArtifactPanel,
  CurrentUser 
} from '../types';

export const CURRENT_TIMESTAMP_BRT = '06/11/2026 10:10 (Brasília)';
export const LAST_SNAPSHOT_TIME_BRT = '06/11/2026 04:00 (Oficial)';

export const MOCK_USERS: CurrentUser[] = [
  {
    id: 'usr-1',
    name: 'Henrique Vasconcelos',
    email: 'h.vasconcelos@heal.org.br',
    role: 'GESTOR',
    department: 'Gestão Operacional de TI',
    avatarUrl: 'HV',
  },
  {
    id: 'usr-2',
    name: 'Mariana Costa',
    email: 'm.costa@heal.org.br',
    role: 'TECNICO',
    department: 'Sistemas Clínicos / Tasy',
    avatarUrl: 'MC',
  },
  {
    id: 'usr-3',
    name: 'Administrador HEAL',
    email: 'admin.ops@heal.org.br',
    role: 'ADMIN',
    department: 'Governança & Segurança da Informação',
    avatarUrl: 'AD',
  },
];

export const MOCK_TECHNICIANS: Technician[] = [
  {
    id: 101,
    name: 'Mariana Costa',
    role: 'Analista Sênior de Sistemas Clínicos (Tasy)',
    groupId: 12,
    groupName: 'Sistemas Hospitalares',
    isManagementGroup: false,
    activeTicketsCount: 7,
    ticketsWithoutEvolution24hCount: 1,
    resolvedInPeriodCount: 14,
    avgObservedResolutionHours: 18.4,
    avatarInitials: 'MC',
    email: 'm.costa@heal.org.br',
  },
  {
    id: 102,
    name: 'Carlos Eduardo Ramos',
    role: 'Especialista em Redes & Infraestrutura Crítica',
    groupId: 15,
    groupName: 'Infraestrutura & Redes',
    isManagementGroup: false,
    activeTicketsCount: 9,
    ticketsWithoutEvolution24hCount: 2,
    resolvedInPeriodCount: 19,
    avgObservedResolutionHours: 22.1,
    avatarInitials: 'CR',
    email: 'c.ramos@heal.org.br',
  },
  {
    id: 103,
    name: 'Rafael Albuquerque',
    role: 'Técnico de Campo (Centro Cirúrgico e UTI)',
    groupId: 18,
    groupName: 'Suporte Presencial Assistencial',
    isManagementGroup: false,
    activeTicketsCount: 5,
    ticketsWithoutEvolution24hCount: 0,
    resolvedInPeriodCount: 23,
    avgObservedResolutionHours: 7.2,
    avatarInitials: 'RA',
    email: 'r.albuquerque@heal.org.br',
  },
  {
    id: 104,
    name: 'Fernanda Lima',
    role: 'DBA & Especialista em PACS/Imagens',
    groupId: 12,
    groupName: 'Sistemas Hospitalares',
    isManagementGroup: false,
    activeTicketsCount: 4,
    ticketsWithoutEvolution24hCount: 1,
    resolvedInPeriodCount: 8,
    avgObservedResolutionHours: 31.0,
    avatarInitials: 'FL',
    email: 'f.lima@heal.org.br',
  },
  {
    id: 105,
    name: 'Lucas Mendes',
    role: 'Analista de Suporte N1/N2',
    groupId: 18,
    groupName: 'Suporte Presencial Assistencial',
    isManagementGroup: false,
    activeTicketsCount: 8,
    ticketsWithoutEvolution24hCount: 3,
    resolvedInPeriodCount: 16,
    avgObservedResolutionHours: 14.5,
    avatarInitials: 'LM',
    email: 'l.mendes@heal.org.br',
  },
  // Grupo 48 - Gestão: incluído para transparência de governança, mas EXCLUÍDO dos rankings operacionais
  {
    id: 4801,
    name: 'Dr. Roberto Silveira',
    role: 'Coordenador Executivo de TI Hospitalar',
    groupId: 48,
    groupName: 'Grupo 48 Gestão',
    isManagementGroup: true,
    activeTicketsCount: 2,
    ticketsWithoutEvolution24hCount: 0,
    resolvedInPeriodCount: 3,
    avgObservedResolutionHours: 48.0,
    avatarInitials: 'RS',
    email: 'r.silveira@heal.org.br',
  },
  {
    id: 4802,
    name: 'Paula Nogueira',
    role: 'Supervisora de Operações e Processos',
    groupId: 48,
    groupName: 'Grupo 48 Gestão',
    isManagementGroup: true,
    activeTicketsCount: 1,
    ticketsWithoutEvolution24hCount: 0,
    resolvedInPeriodCount: 2,
    avgObservedResolutionHours: 36.0,
    avatarInitials: 'PN',
    email: 'p.nogueira@heal.org.br',
  },
];

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 48219,
    title: 'Falha de transmissão de telemetria dos monitores cardíacos — Leitos 09 a 14',
    status: 'em_atendimento',
    priorityGLPI: 'media', // No GLPI está média, mas gerencialmente é crítica!
    suggestedPriority: 'P1_CRITICA',
    groupId: 18,
    groupName: 'Suporte Presencial Assistencial',
    technicianId: 103,
    technicianName: 'Rafael Albuquerque',
    category: 'Equipamentos Médicos / Monitorização',
    dateCreation: '2026-11-06T06:15:00-03:00',
    lastHumanActionDate: '2026-11-06T08:45:00-03:00',
    dateMod: '2026-11-06T09:12:00-03:00', // Modificado por bot de coleta
    isWithoutEvolution24h: false,
    hasNominalTech: true,
    hospitalLocation: 'UTI Geral Adulto — 3º Andar',
    clinicalImpactAssessed: true,
    evidenceGaps: ['Falta validação de conectividade do switch reserva no rack Sul'],
    description: 'Central de enfermagem reportou queda intermitente nos dados dos leitos 09 a 14 no posto central. Monitores locais preservam alarmes sonoros auditados pela engenharia clínica.',
    tasks: [
      { id: 't1', description: 'Inspeção física do cabeamento estruturado patch panel C12', status: 'concluida', assignedTo: 'Rafael Albuquerque', date: '06/11 07:30' },
      { id: 't2', description: 'Troca de transceiver SFP no switch assistencial', status: 'em_andamento', assignedTo: 'Carlos Eduardo Ramos', date: '06/11 08:45' }
    ],
    followups: [
      { id: 'f1', authorName: 'Rafael Albuquerque', authorType: 'humana', date: '06/11 08:45', content: 'Substituído cabo drop do leito 11. Leitos 09 e 10 normalizaram. Investigando porta de uplink para 12-14.', isPrivate: false },
      { id: 'f2', authorName: 'GLPI Integration Daemon', authorType: 'automacao', date: '06/11 09:12', content: 'Status de ping da VLAN 104 restabelecido parcialmente (perda de 4%).', isPrivate: true }
    ]
  },
  {
    id: 48204,
    title: 'Lentidão severa na abertura de laudos radiológicos no visualizador PACS',
    status: 'em_atendimento',
    priorityGLPI: 'alta',
    suggestedPriority: 'P1_CRITICA',
    groupId: 12,
    groupName: 'Sistemas Hospitalares',
    technicianId: 104,
    technicianName: 'Fernanda Lima',
    category: 'Sistemas de Imagem / PACS',
    dateCreation: '2026-11-05T14:30:00-03:00',
    lastHumanActionDate: '2026-11-05T17:10:00-03:00', // Sem evolução humana > 17h
    dateMod: '2026-11-06T04:00:00-03:00', // Batch do snapshot
    isWithoutEvolution24h: false,
    hasNominalTech: true,
    hospitalLocation: 'Centro de Diagnóstico por Imagem (CDI)',
    clinicalImpactAssessed: true,
    evidenceGaps: ['Sem evidência de teste de IOPS no storage NAS-PACS-02', 'Ausência de log de transação do SQL do PACS anexado'],
    description: 'Médicos radiologistas relatam que tomografias com mais de 800 cortes demoram mais de 3 minutos para renderizar na estação de trabalho.',
    tasks: [
      { id: 't1', description: 'Verificação da fila de renderização DICOM', status: 'concluida', assignedTo: 'Fernanda Lima', date: '05/11 16:00' },
      { id: 't2', description: 'Coleta de métricas de I/O de disco no pool 3', status: 'pendente', assignedTo: 'Fernanda Lima', date: '05/11 17:10' }
    ],
    followups: [
      { id: 'f1', authorName: 'Fernanda Lima', authorType: 'humana', date: '05/11 17:10', content: 'Identificado gargalo de I/O no nó 2 do cluster PACS. Abrindo chamado emergencial com fornecedor da solução de storage.', isPrivate: false }
    ]
  },
  {
    id: 48191,
    title: 'Chamado sem técnico nominal: Travamento da prescrição eletrônica Tasy no Centro Obstétrico',
    status: 'novo',
    priorityGLPI: 'alta',
    suggestedPriority: 'P1_CRITICA',
    groupId: 12,
    groupName: 'Sistemas Hospitalares',
    technicianId: undefined,
    technicianName: undefined, // SEM TÉCNICO NOMINAL!
    category: 'Prontuário Eletrônico / Prescrição',
    dateCreation: '2026-11-06T07:40:00-03:00',
    lastHumanActionDate: '2026-11-06T07:40:00-03:00',
    dateMod: '2026-11-06T07:40:00-03:00',
    isWithoutEvolution24h: false,
    hasNominalTech: false,
    hospitalLocation: 'Centro Obstétrico — 2º Andar',
    clinicalImpactAssessed: true,
    evidenceGaps: ['Chamado sem atribuição técnica há mais de 2 horas em setor assistencial de risco'],
    description: 'Posto de enfermagem obstétrica relata erro de timeout ao confirmar aprazamento de medicação pós-parto. Chamado aberto diretamente pelo coordenador de enfermagem.',
    tasks: [],
    followups: [
      { id: 'f1', authorName: 'Triagem Automática GLPI', authorType: 'automacao', date: '06/11 07:40', content: 'Chamado classificado para Grupo 12 - Sistemas Hospitalares. Aguardando assunção nominal.', isPrivate: false }
    ]
  },
  {
    id: 48098,
    title: 'Impressora térmica de pulseiras de identificação travando na Triagem Pronto Atendimento',
    status: 'pendente',
    priorityGLPI: 'media',
    suggestedPriority: 'P2_ALTA',
    groupId: 18,
    groupName: 'Suporte Presencial Assistencial',
    technicianId: 105,
    technicianName: 'Lucas Mendes',
    category: 'Hardware Assistencial / Impressão Térmica',
    dateCreation: '2026-11-04T11:20:00-03:00',
    lastHumanActionDate: '2026-11-04T15:30:00-03:00', // > 24h sem evolução observável!
    dateMod: '2026-11-05T04:00:00-03:00',
    isWithoutEvolution24h: true, // EXCEÇÃO 24H!
    hasNominalTech: true,
    hospitalLocation: 'Pronto Atendimento Adulto — Triagem',
    clinicalImpactAssessed: false,
    evidenceGaps: ['Ausência de registro de intervenção técnica nas últimas 42 horas', 'Não há comprovação se foi fornecida impressora de contingência'],
    description: 'Equipamento Zebra ZD510 cortando código Datamatrix das pulseiras dos pacientes. Triagem utilizando impressora secundária da recepção provisoriamente.',
    tasks: [
      { id: 't1', description: 'Limpeza do sensor óptico e rolete tracionador', status: 'concluida', assignedTo: 'Lucas Mendes', date: '04/11 14:00' },
      { id: 't2', description: 'Troca da cabeça de impressão térmica', status: 'em_andamento', assignedTo: 'Lucas Mendes', date: '04/11 15:30' }
    ],
    followups: [
      { id: 'f1', authorName: 'Lucas Mendes', authorType: 'humana', date: '04/11 15:30', content: 'Cabeça térmica danificada. Solicitado componente no almoxarifado técnico.', isPrivate: false }
    ]
  },
  {
    id: 48112,
    title: 'Leitor de código de barras sem leitura na checagem beira-leito — Clínica Médica 4º Andar',
    status: 'em_atendimento',
    priorityGLPI: 'baixa',
    suggestedPriority: 'P3_MEDIA',
    groupId: 18,
    groupName: 'Suporte Presencial Assistencial',
    technicianId: 105,
    technicianName: 'Lucas Mendes',
    category: 'Periféricos Assistenciais',
    dateCreation: '2026-11-04T09:00:00-03:00',
    lastHumanActionDate: '2026-11-04T10:15:00-03:00',
    dateMod: '2026-11-05T04:00:00-03:00',
    isWithoutEvolution24h: true, // > 24h sem evolução
    hasNominalTech: true,
    hospitalLocation: 'Internação 4º Andar — Posto 2',
    clinicalImpactAssessed: false,
    evidenceGaps: ['Mais de 48h sem apontamento de teste do leitor USB'],
    description: 'Leitor sem fio Zebra não faz o pareamento com a base do carrinho de enfermagem.',
    tasks: [],
    followups: [
      { id: 'f1', authorName: 'Lucas Mendes', authorType: 'humana', date: '04/11 10:15', content: 'Base foi reconfigurada via código de barras de fábrica. Ficou em teste no posto.', isPrivate: false }
    ]
  },
  {
    id: 48155,
    title: 'Inconsistência de estoque de antibióticos na interface Farmácia Central / Tasy',
    status: 'planejado',
    priorityGLPI: 'alta',
    suggestedPriority: 'P2_ALTA',
    groupId: 12,
    groupName: 'Sistemas Hospitalares',
    technicianId: 101,
    technicianName: 'Mariana Costa',
    category: 'Integrações de Farmácia & Estoque',
    dateCreation: '2026-11-05T08:30:00-03:00',
    lastHumanActionDate: '2026-11-06T09:00:00-03:00',
    dateMod: '2026-11-06T09:05:00-03:00',
    isWithoutEvolution24h: false,
    hasNominalTech: true,
    hospitalLocation: 'Farmácia Central — Subsolo 1',
    clinicalImpactAssessed: true,
    evidenceGaps: ['Aguardando conferência física de 2 lotes de Meropenem pelo farmacêutico responsável'],
    description: 'Interface de dispensa automática acusou divergência de 14 ampolas entre saldo físico e contábil após reinicialização do serviço de mensageria HL7.',
    tasks: [
      { id: 't1', description: 'Reconciliação da fila de mensagens HL7', status: 'concluida', assignedTo: 'Mariana Costa', date: '06/11 08:50' },
      { id: 't2', description: 'Reprocessamento das transações pendentes no Tasy', status: 'em_andamento', assignedTo: 'Mariana Costa', date: '06/11 09:00' }
    ],
    followups: [
      { id: 'f1', authorName: 'Mariana Costa', authorType: 'humana', date: '06/11 09:00', content: 'Fila HL7 expurgada de mensagens duplicadas. Reprocessamento em andamento em ambiente de contingência.', isPrivate: false }
    ]
  },
  {
    id: 48180,
    title: 'Ponto de rede oscilando no consultório de triagem pediátrica do Pronto Socorro',
    status: 'em_atendimento',
    priorityGLPI: 'media',
    suggestedPriority: 'P3_MEDIA',
    groupId: 15,
    groupName: 'Infraestrutura & Redes',
    technicianId: 102,
    technicianName: 'Carlos Eduardo Ramos',
    category: 'Infraestrutura de Rede / Cabeamento',
    dateCreation: '2026-11-05T16:00:00-03:00',
    lastHumanActionDate: '2026-11-06T08:10:00-03:00',
    dateMod: '2026-11-06T08:15:00-03:00',
    isWithoutEvolution24h: false,
    hasNominalTech: true,
    hospitalLocation: 'Pronto Atendimento Infantil',
    clinicalImpactAssessed: false,
    evidenceGaps: [],
    description: 'Médica pediatra informou perda momentânea da sessão do prontuário durante atendimento.',
    tasks: [
      { id: 't1', description: 'Certificação do link de par trançado Cat6', status: 'concluida', assignedTo: 'Carlos Eduardo Ramos', date: '06/11 08:10' }
    ],
    followups: [
      { id: 'f1', authorName: 'Carlos Eduardo Ramos', authorType: 'humana', date: '06/11 08:10', content: 'Conector RJ45 fêmea no espelho de parede estava com pino 3 com oxidação mecânica. Tomada refeita e link certificado a 1Gbps full-duplex.', isPrivate: false }
    ]
  },
  {
    id: 47990,
    title: 'Falha na rotina de replicação do banco de dados analítico de indicadores hospitalares',
    status: 'solucionado',
    priorityGLPI: 'media',
    suggestedPriority: 'P3_MEDIA',
    groupId: 12,
    groupName: 'Sistemas Hospitalares',
    technicianId: 104,
    technicianName: 'Fernanda Lima',
    category: 'Bancos de Dados & BI',
    dateCreation: '2026-11-03T02:00:00-03:00',
    lastHumanActionDate: '2026-11-05T18:20:00-03:00',
    dateMod: '2026-11-05T18:20:00-03:00',
    isWithoutEvolution24h: false,
    hasNominalTech: true,
    hospitalLocation: 'Data Center Primário',
    clinicalImpactAssessed: false,
    evidenceGaps: [],
    description: 'Job noturno de CDC (Change Data Capture) falhou por falta de espaço temporário no tablespace.',
    tasks: [
      { id: 't1', description: 'Expansão de 100GB no storage LUN-DB01', status: 'concluida', assignedTo: 'Fernanda Lima', date: '05/11 17:00' },
      { id: 't2', description: 'Reprocessamento dos snapshots históricos', status: 'concluida', assignedTo: 'Fernanda Lima', date: '05/11 18:20' }
    ],
    followups: [
      { id: 'f1', authorName: 'Fernanda Lima', authorType: 'humana', date: '05/11 18:20', content: 'Espaço ampliado e replicação sincronizada com sucesso. Indicadores atualizados.', isPrivate: false }
    ]
  }
];

export const MOCK_PENDINGS: PendingItem[] = [
  {
    id: 'pend-01',
    stableFingerprint: 'HEAL-POP017-48098-FPT1',
    ticketId: 48098,
    ticketTitle: 'Impressora térmica de pulseiras de identificação travando na Triagem Pronto Atendimento',
    status: 'PERSISTENT',
    evidenceLevel: 'Indício de desconformidade',
    popRule: 'POP-TIN-017 v2.4 (Subitem 4.2 - Limiar 24h sem ação técnica documentada)',
    daysOpen: 2,
    assignedTechnicianName: 'Lucas Mendes',
    groupName: 'Suporte Presencial Assistencial',
    description: 'Chamado em setor crítico (Triagem) sem registro de intervenção humana documentada há mais de 42 horas.',
    evidenceNotes: 'POP-TIN-017 estabelece que setores de classificação de risco exigem acompanhamento com intervalo máximo de 24h. Ausência de atualização não comprova ausência de trabalho, porém enseja verificação gerencial imediata.',
    lastAuditDate: '06/11/2026 04:00',
    transitionHistory: [
      { from: 'NEW', to: 'PERSISTENT', timestamp: '06/11/2026 04:00', reason: 'Auditado no snapshot 04h: permaneceu >24h sem log de ação humana.' },
      { from: 'NEW', to: 'NEW', timestamp: '05/11/2026 04:00', reason: 'Entrada inicial no snapshot com prazo em curso.' }
    ]
  },
  {
    id: 'pend-02',
    stableFingerprint: 'HEAL-POP017-48191-FPT2',
    ticketId: 48191,
    ticketTitle: 'Chamado sem técnico nominal: Travamento da prescrição eletrônica Tasy no Centro Obstétrico',
    status: 'NEW',
    evidenceLevel: 'Desconformidade confirmada',
    popRule: 'POP-TIN-017 v2.4 (Subitem 3.1 - Atribuição Nominal Obrigatória para Área Assistencial)',
    daysOpen: 1,
    assignedTechnicianName: undefined,
    groupName: 'Sistemas Hospitalares',
    description: 'Chamado aberto para área assistencial de risco vital há mais de 2 horas apenas com grupo atribuído e sem responsável técnico nominal.',
    evidenceNotes: 'Fato comprovado no GLPI: campo "Técnico Atribuído" nulo. Regra institucional exige assunção nominal em até 30 minutos em áreas críticas.',
    lastAuditDate: '06/11/2026 04:00',
    transitionHistory: [
      { from: 'NEW', to: 'NEW', timestamp: '06/11/2026 08:00', reason: 'Detectado na varredura operacional matinal.' }
    ]
  },
  {
    id: 'pend-03',
    stableFingerprint: 'HEAL-POP017-48204-FPT3',
    ticketId: 48204,
    ticketTitle: 'Lentidão severa na abertura de laudos radiológicos no visualizador PACS',
    status: 'PERSISTENT',
    evidenceLevel: 'Verificação necessária',
    popRule: 'POP-TIN-017 v2.4 (Subitem 5.1 - Evidência de Contato com Fornecedor de Terceiros)',
    daysOpen: 2,
    assignedTechnicianName: 'Fernanda Lima',
    groupName: 'Sistemas Hospitalares',
    description: 'Apontamento técnico menciona acionamento de terceiro fornecedor de storage, porém sem número de protocolo ou comprovante formal anexado.',
    evidenceNotes: 'Necessário confirmar se o ticket externo foi efetivamente aberto junto ao suporte de nível 3 da fabricante do storage PACS.',
    lastAuditDate: '06/11/2026 04:00',
    transitionHistory: [
      { from: 'NEW', to: 'PERSISTENT', timestamp: '06/11/2026 04:00', reason: 'Persistência sem registro de evidência de protocolo externo.' }
    ]
  },
  {
    id: 'pend-04',
    stableFingerprint: 'HEAL-POP017-47990-FPT4',
    ticketId: 47990,
    ticketTitle: 'Falha na rotina de replicação do banco de dados analítico de indicadores hospitalares',
    status: 'RESOLVED_WITH_EVIDENCE',
    evidenceLevel: 'Fato confirmado',
    popRule: 'POP-TIN-017 v2.4 (Subitem 6.3 - Solução com Evidência Técnica Auditável)',
    daysOpen: 3,
    assignedTechnicianName: 'Fernanda Lima',
    groupName: 'Sistemas Hospitalares',
    description: 'Chamado concluído com relatório de volumetria de disco e print de sincronismo do job CDC anexados.',
    evidenceNotes: 'Auditoria confirmou conformidade documental plena: causa raiz identificada, ação preventiva registrada e logs válidos anexados.',
    lastAuditDate: '06/11/2026 04:00',
    transitionHistory: [
      { from: 'PERSISTENT', to: 'RESOLVED_WITH_EVIDENCE', timestamp: '06/11/2026 04:00', reason: 'Resolução comprovada na auditoria oficial 04h.' }
    ]
  }
];

export const MOCK_AUDITS: AuditSnapshot[] = [
  {
    id: 'audit-20261106-0400',
    timestamp: '06/11/2026 04:00',
    type: 'SNAPSHOT_04H',
    totalTicketsEvaluated: 142,
    newPendingsCount: 3,
    persistentPendingsCount: 8,
    reopenedPendingsCount: 1,
    resolvedWithEvidenceCount: 11,
    rulesEvaluated: ['POP-TIN-017 v2.4', 'POP-TIN-008 v1.9', 'Instrução Normativa DTI 03/2026'],
    limitations: 'Varredura automática via réplica somente-leitura do MariaDB GLPI. Não audita chamados com sigilo médico restrito pelo DPO.',
    auditor: 'Motor de Auditoria Noturna HEAL (Agendado 04h00)',
    status: 'CONCLUIDO'
  },
  {
    id: 'audit-20261105-0400',
    timestamp: '05/11/2026 04:00',
    type: 'SNAPSHOT_04H',
    totalTicketsEvaluated: 138,
    newPendingsCount: 6,
    persistentPendingsCount: 7,
    reopenedPendingsCount: 0,
    resolvedWithEvidenceCount: 9,
    rulesEvaluated: ['POP-TIN-017 v2.4', 'POP-TIN-008 v1.9'],
    limitations: 'Janela de manutenção programada no switch core às 03:30 causou atraso de 12 minutos na consolidação dos hashes.',
    auditor: 'Motor de Auditoria Noturna HEAL (Agendado 04h00)',
    status: 'CONCLUIDO'
  },
  {
    id: 'audit-20261104-1630',
    timestamp: '04/11/2026 16:30',
    type: 'MANUAL',
    totalTicketsEvaluated: 135,
    newPendingsCount: 2,
    persistentPendingsCount: 9,
    reopenedPendingsCount: 0,
    resolvedWithEvidenceCount: 5,
    rulesEvaluated: ['POP-TIN-017 v2.4'],
    limitations: 'Auditoria manual sob demanda solicitada pela Coordenação antes da reunião do comitê de segurança assistencial.',
    auditor: 'Henrique Vasconcelos (Gestor TI)',
    status: 'CONCLUIDO'
  }
];

export const MOCK_SAVED_PANELS: ArtifactPanel[] = [
  {
    id: 'art-daily-20261106',
    templateType: 'TPL-01',
    templateName: 'TPL-01 — Daily Operacional',
    title: 'Daily Operacional de TI — 06/11/2026',
    ownerName: 'Agente Gerencial',
    referenceDate: '06/11/2026',
    generationDate: '06/11/2026 07:15',
    source: 'SNAPSHOT_04H',
    version: 'v1.0 (Homologado)',
    status: 'APROVADO',
    summary: {
      headline: 'Estabilidade geral mantida com 2 pontos de atenção imediata: telemetria UTI Adulto e prescrição obstétrica sem técnico.',
      criticalAlertsCount: 2,
      topPriorities: [
        '#48219: Normalizar uplink da telemetria cardíaca leitos 12-14 na UTI Geral',
        '#48191: Atribuir responsável nominal imediato para prescrição no Centro Obstétrico',
        '#48098: Substituir impressora térmica da Triagem PA parada há >24h'
      ],
      keyDecisionsSummary: 'Priorização de campo direcionada ao Centro Cirúrgico e UTI antes das 10h. Grupo 48 apoia articulação com fornecedor PACS.',
      metricsBrief: [
        { label: 'Chamados Ativos', value: 33 },
        { label: 'Sem Evolução >24h', value: 7 },
        { label: 'Sem Técnico Nominal', value: 2 },
        { label: 'Tempo Médio Obs.', value: '18.2h' }
      ]
    },
    detail: {
      sections: [
        {
          title: '1. Resumo Executivo da Operação',
          description: 'Visão consolidada da infraestrutura e sistemas hospitalares no turno matinal.',
          items: [
            { title: 'Conectividade do Hospital', description: 'Links primário e de contingência operando com 100% de disponibilidade. Sem registros de indisponibilidade de internet ou WAN.' },
            { title: 'Sistemas Clínicos Core', description: 'Tasy ERP e visualizadores laboratoriais sem incidentes globais. Lentidão pontual reportada no PACS em investigação.' }
          ]
        },
        {
          title: '2. Pendências & Auditoria POP-TIN-017',
          description: 'Chamados em não-conformidade com as regras de documentação e tempo.',
          items: [
            { title: 'Chamado #48098 (Zebra Triagem)', description: '42 horas sem atualização observável.', responsible: 'Lucas Mendes', deadline: 'Hoje às 11:30', evidenceLevel: 'Indício de desconformidade', relatedTicketId: 48098 },
            { title: 'Chamado #48191 (Obstétrico)', description: 'Chamado assistencial sem técnico nominal.', responsible: 'Mariana Costa (Sugerido)', deadline: 'Imediato', evidenceLevel: 'Desconformidade confirmada', relatedTicketId: 48191 }
          ]
        },
        {
          title: '3. Carga e Distribuição da Equipe',
          description: 'Distribuição nominal dos 33 chamados ativos (excluindo Grupo 48 dos rankings de produtividade).',
          items: [
            { title: 'Suporte Presencial (Rafael / Lucas)', description: '13 chamados ativos. Rafael alocado na UTI Geral; Lucas focado nos periféricos do PA.' },
            { title: 'Sistemas & Dados (Mariana / Fernanda)', description: '11 chamados ativos. Foco em interfaces de farmácia e storage PACS.' },
            { title: 'Infraestrutura (Carlos Ramos)', description: '9 chamados ativos. Validação física de switches assistenciais.' }
          ]
        },
        {
          title: '4. Entregas Concluídas nas Últimas 24h',
          description: 'Chamados finalizados com evidência comprovada anexada.',
          items: [
            { title: '#47990: Banco de Indicadores', description: 'Tablespace ampliado em 100GB e réplicas CDC sincronizadas com logs validados.', evidenceLevel: 'Fato confirmado', relatedTicketId: 47990 },
            { title: '#47952: Certificado Digital Médicos', description: 'Tokens criptográficos A3 renovados para 6 cirurgiões de plantão.', evidenceLevel: 'Fato confirmado' }
          ]
        },
        {
          title: '5. As 3 Prioridades do Dia',
          description: 'Foco mandatório da liderança e técnicos para o turno.',
          items: [
            { title: 'Prioridade 1: Estabilizar Telemetria UTI Leitos 12-14', description: 'Troca de SFP e validação de pacotes na VLAN 104.', responsible: 'Rafael / Carlos Ramos', deadline: '11:00' },
            { title: 'Prioridade 2: Regularizar Prescrição Centro Obstétrico', description: 'Assunção nominal e teste de timeout do aprazamento.', responsible: 'Mariana Costa', deadline: '09:30' },
            { title: 'Prioridade 3: Entrega de Impressora Contingência PA', description: 'Instalação física de impressora térmica reserva na triagem.', responsible: 'Lucas Mendes', deadline: '10:30' }
          ]
        },
        {
          title: '6. Decisões e Encaminhamentos',
          description: 'Compromissos firmados pelo gestor autenticado com rastreabilidade.',
          items: [
            { title: 'Decisão DEC-2026-88', description: 'Autorizada abertura de chamado com garantia do fornecedor do storage PACS.' },
            { title: 'Decisão DEC-2026-89', description: 'Remanejamento de impressora térmica reserva da administração para o PA.' }
          ]
        }
      ],
      governanceNotes: 'Gerado automaticamente às 07:15 com base no SNAPSHOT_04H. Aprovado pelo Gestor Henrique Vasconcelos às 07:45.'
    }
  },
  {
    id: 'art-weekly-2026w45',
    templateType: 'TPL-02',
    templateName: 'TPL-02 — Alinhamento Semanal',
    title: 'Alinhamento Semanal TI — Semana 45/2026',
    ownerName: 'Agente Gerencial',
    referenceDate: '03/11 a 07/11/2026',
    generationDate: '04/11/2026 14:00',
    source: 'SNAPSHOT_04H',
    version: 'v1.1',
    status: 'APROVADO',
    summary: {
      headline: 'Aumento de 18% no volume de chamados de prescrição após atualização do Tasy v3.4. Resolução média estável em 18.4 horas.',
      criticalAlertsCount: 1,
      topPriorities: [
        'Ajuste fino de índices do banco Oracle do Tasy',
        'Plano de contingência para substituição de 5 switches de borda obsoletos',
        'Treinamento das novas enfermeiras no leitor beira-leito'
      ],
      keyDecisionsSummary: 'Congelamento de novas mudanças no Tasy durante o final de semana. Reunião de alinhamento com a diretoria médica na quinta-feira.',
      metricsBrief: [
        { label: 'Total Concluídos Sem.', value: 74 },
        { label: 'Backlog Atual', value: 33 },
        { label: 'Conformidade Doc.', value: '88%' },
        { label: 'Tempo Médio Semanal', value: '18.4h' }
      ]
    },
    detail: {
      sections: [
        {
          title: '1. Indicadores Chave da Semana',
          description: 'Métricas observadas de abertura, solução e documentação.',
          items: [
            { title: 'Volume Semanal', description: '82 chamados abertos vs 74 concluídos (+8 chamados no backlog líquido).' },
            { title: 'Qualidade Documental POP-TIN-017', description: '88% dos chamados fechados apresentaram logs e comprovação de ação humana comprovada.' }
          ]
        },
        {
          title: '2. Riscos & Dependências Externas',
          description: 'Fatores externos que afetam a operação da TI hospitalar.',
          items: [
            { title: 'Fornecedor PACS', description: 'Demora média de 6h para retorno em chamados de severidade 2.' },
            { title: 'Almoxarifado de Peças', description: 'Estoque de transceivers SFP e fontes redundantes em nível mínimo de segurança.' }
          ]
        }
      ]
    }
  },
  {
    id: 'art-feedback-mariana',
    templateType: 'TPL-03',
    templateName: 'TPL-03 — Feedback Individual',
    title: 'Dossiê de Feedback Técnico — Mariana Costa',
    ownerName: 'Henrique Vasconcelos',
    referenceDate: 'Outubro / Novembro 2026',
    generationDate: '02/11/2026 16:30',
    source: 'REALTIME',
    version: 'v1.0 (Revisão Gerencial)',
    status: 'APROVADO',
    summary: {
      headline: 'Excelente resolutividade em incidentes de alta complexidade do Tasy. Oportunidade de melhoria no registro tempestivo de followups durante a tarde.',
      criticalAlertsCount: 0,
      topPriorities: [
        'Priorizar registros humanos nos chamados antes das 17h para mitigar falsos alertas na auditoria noturna 04h',
        'Mentoria técnica para Lucas Mendes nos fluxos de farmácia'
      ],
      keyDecisionsSummary: 'Feedback estruturado baseado estritamente em evidências factuais do GLPI, sem caráter punitivo ou disciplinar.',
      metricsBrief: [
        { label: 'Chamados Resolvidos (Mês)', value: 58 },
        { label: 'Tempo Médio Observado', value: '18.4h' },
        { label: 'Reaberturas', value: '1.7%' },
        { label: 'Qualidade Doc.', value: '94%' }
      ]
    },
    detail: {
      sections: [
        {
          title: '1. Evidências Factuais e Métricas Observadas',
          description: 'Dados extraídos do GLPI com confirmação humana.',
          items: [
            { title: 'Desempenho em Crises', description: 'Liderou com maestria o restabelecimento do módulo de faturamento hospitalar no dia 28/10, reduzindo o tempo de parada sem geração de erros contábeis.' },
            { title: 'Índice de Reabertura', description: 'Apenas 1 chamado reaberto em 58 concluídos no último ciclo de 30 dias.' }
          ]
        },
        {
          title: '2. Pontos Positivos Comprovados',
          items: [
            { title: 'Profundo conhecimento clínico', description: 'Capacidade diferenciada de traduzir termos assistenciais em configurações precisas no ERP Tasy.' },
            { title: 'Relação com equipe assistencial', description: 'Avaliações espontâneas muito positivas da equipe de enfermagem do Bloco Cirúrgico.' }
          ]
        },
        {
          title: '3. Plano de Desenvolvimento e Combinados',
          items: [
            { title: 'Apontamento de Acompanhamentos', description: 'Registrar notas de andamento intermediárias no GLPI para evitar que chamados fiquem classificados como "sem evolução observável" no snapshot das 04h.' },
            { title: 'Apoio em Documentação', description: 'Contribuir com 2 novos POPs de contingência para o módulo de agendamento cirúrgico.' }
          ]
        }
      ],
      governanceNotes: 'Documento confidencial gerencial. Sem natureza disciplinar. Revisão agendada para 30 dias.'
    }
  },
  {
    id: 'art-project-pacs',
    templateType: 'TPL-04',
    templateName: 'TPL-04 — Gestão de Projetos',
    title: 'Painel do Projeto — Expansão do Storage PACS & Laudos',
    ownerName: 'Agente Gerencial',
    referenceDate: 'Q4 2026',
    generationDate: '01/11/2026 10:00',
    source: 'REALTIME',
    version: 'v2.2',
    status: 'APROVADO',
    summary: {
      headline: 'Projeto em 68% de conclusão. Marco de migração de volumes antigos concluído; aguardando homologação do cache SSD.',
      criticalAlertsCount: 1,
      topPriorities: [
        'Homologação dos testes de estresse com 50 laudos simultâneos no CDI',
        'Recebimento fiscal dos novos módulos de memória para o storage secundário'
      ],
      keyDecisionsSummary: 'Manter a janela de contingência aos domingos das 01h às 05h para não interferir na rotina assistencial.',
      metricsBrief: [
        { label: 'Progresso Geral', value: '68%' },
        { label: 'Marcos Concluídos', value: '5 de 8' },
        { label: 'Riscos Ativos', value: '2' },
        { label: 'Previsão Conclusão', value: '25/11/2026' }
      ]
    },
    detail: {
      sections: [
        {
          title: '1. Cronograma e Marcos do Projeto',
          items: [
            { title: 'M1: Instalação física no Data Center', description: 'Racks cabeados e alimentados por no-break trifásico redundante.', status: 'Concluído' },
            { title: 'M2: Configuração dos pools ZFS e LUNs', description: 'Configuração dos volumes RAID-Z2 concluída com testes de redundância.', status: 'Concluído' },
            { title: 'M3: Teste de Carga de Imagens Tomográficas', description: 'Simulação com 200 exames de alta resolução.', status: 'Em andamento' }
          ]
        },
        {
          title: '2. Matriz de Riscos & Mitigações',
          items: [
            { title: 'Risco de degradação durante backup noturno', description: 'Mitigação: criação de snapshot assíncrono isolado na VLAN de réplica.', evidenceLevel: 'Fato confirmado' }
          ]
        }
      ]
    }
  }
];

export const MOCK_INDICATORS_DATA = {
  kpis: {
    totalOpen: 33,
    newTickets: 4,
    inProgress: 18,
    planned: 4,
    pending: 7,
    noNominalTech: 2,
    onlyGroup: 2,
    noEvolution24h: 3,
    resolvedPeriod: 80,
    avgObservedResolutionHours: 18.2, // Explicação: média ponderada das horas corridas entre data_abertura e data_solucao para chamados concluídos no período de 7 dias
    avgResolutionFormulaNotice: 'Fórmula: Σ(Data Solução - Data Abertura) / Total Chamados Solucionados no período de 7 dias. NUNCA interpretar como SLA ou MTTR contratual.',
  },
  statusDistribution: [
    { name: 'Em Atendimento', count: 18, percentage: 54 },
    { name: 'Pendente', count: 7, percentage: 21 },
    { name: 'Planejado', count: 4, percentage: 12 },
    { name: 'Novo', count: 4, percentage: 12 }
  ],
  categoryDistribution: [
    { name: 'Sistemas Hospitalares (Tasy/PACS)', count: 14, color: '#134F9F' },
    { name: 'Suporte Assistencial & Periféricos', count: 11, color: '#0284C7' },
    { name: 'Infraestrutura & Redes Críticas', count: 6, color: '#6366F1' },
    { name: 'Acessos & Segurança', count: 2, color: '#0D9488' }
  ],
  trendSeries: [
    { day: '31/10', abertos: 14, solucionados: 12, tempoMedio: 19.5 },
    { day: '01/11', abertos: 9, solucionados: 11, tempoMedio: 18.0 },
    { day: '02/11', abertos: 7, solucionados: 8, tempoMedio: 17.2 },
    { day: '03/11', abertos: 16, solucionados: 15, tempoMedio: 18.9 },
    { day: '04/11', abertos: 18, solucionados: 17, tempoMedio: 18.4 },
    { day: '05/11', abertos: 15, solucionados: 14, tempoMedio: 18.1 },
    { day: '06/11 (Parcial)', abertos: 8, solucionados: 6, tempoMedio: 18.2 }
  ],
  documentQualityIndex: {
    overallRate: 88.5,
    criteria: [
      { name: 'Ação humana documentada antes de 24h', compliance: 91 },
      { name: 'Atribuição nominal confirmada', compliance: 94 },
      { name: 'Causa raiz técnica registrada na solução', compliance: 82 },
      { name: 'Evidência de teste ou validação anexada', compliance: 87 }
    ]
  }
};
