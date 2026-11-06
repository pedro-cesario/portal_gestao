/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Definições Padrão de Configurações, Fórmulas e Regras POP-TIN-017
 */

import { PopSpecification, OperationalCalculationSettings, SettingsAuditLog, NavMenuItemConfig } from '../types';

export const DEFAULT_MENU_CONFIG: NavMenuItemConfig[] = [
  { id: 'visao-geral', label: 'Visão Geral', isVisible: true },
  { id: 'chamados', label: 'Chamados GLPI', isVisible: true },
  { id: 'equipe', label: 'Equipe Técnica', isVisible: true },
  { id: 'pendencias', label: 'Pendências & POP', isVisible: true },
  { id: 'auditorias', label: 'Auditorias (04h)', isVisible: true },
  { id: 'indicadores', label: 'Indicadores', isVisible: true },
  { id: 'agente-gerencial', label: 'Agente Gerencial', isVisible: true },
  { id: 'daily-paineis', label: 'Daily e Painéis', isVisible: true },
  { id: 'templates', label: 'Catálogo de Templates', isVisible: true },
  { id: 'configuracoes', label: 'Configurações', isVisible: true, isLocked: true },
];

export const DEFAULT_POP_SPEC: PopSpecification = {
  code: 'POP-TIN-017',
  version: 'v2.4',
  status: 'VIGENTE',
  homologatedBy: 'Comitê de Governança DTI / Gerência de Operações de TI',
  effectiveDate: '01/08/2026',
  changeNotes: 'Ajuste de tolerâncias operacionais, integração das 4 camadas de evidência factual e exclusão obrigatória de conclusões disciplinares automáticas.',
  rules: [
    {
      id: 'POP-TIN-017-R1',
      title: 'Ausência de evolução humana observável',
      description: 'Chamados em aberto sem novo acompanhamento humano comprovado no GLPI dentro da tolerância horária.',
      defaultEvidenceLevel: 'Indício de desconformidade',
      thresholdHours: 24,
      severity: 'ALTA',
      isActive: true,
      applicableExceptions: 'Chamados em status de aguardo de fornecedor Philips/Tasy com protocolo de escalonamento formal registrado.',
      createdAt: '10/01/2026',
      updatedAt: '01/08/2026',
    },
    {
      id: 'POP-TIN-017-R2',
      title: 'Chamado em setor crítico sem técnico nominal',
      description: 'Chamado aberto em local de assistência direta (UTI, Bloco Cirúrgico, PS) sem técnico nominal atribuído.',
      defaultEvidenceLevel: 'Fato confirmado',
      thresholdHours: 0.5, // 30 minutos
      severity: 'CRITICA',
      isActive: true,
      applicableExceptions: 'Falha geral de infraestrutura com chamado pai consolidado aberto pelo plantonista de rede.',
      createdAt: '10/01/2026',
      updatedAt: '01/08/2026',
    },
    {
      id: 'POP-TIN-017-R3',
      title: 'Encerramento sem comprovação documental técnica',
      description: 'Solução ou fechamento de chamado sem preenchimento substantivo de causa-raiz, ação executada e validação com o usuário.',
      defaultEvidenceLevel: 'Desconformidade confirmada',
      thresholdHours: 0,
      severity: 'ALTA',
      isActive: true,
      applicableExceptions: 'Chamados duplicados com referência cruzada validada para o chamado principal.',
      createdAt: '15/05/2026',
      updatedAt: '01/08/2026',
    },
    {
      id: 'POP-TIN-017-R4',
      title: 'Reabertura sucessiva sem parecer gerencial',
      description: 'Chamados que retornam para atendimento após encerramento sem que haja análise de reincidência por líder técnico.',
      defaultEvidenceLevel: 'Verificação necessária',
      thresholdHours: 12,
      severity: 'MEDIA',
      isActive: true,
      applicableExceptions: 'Solicitações adicionais de treinamento de usuário identificadas no mesmo fluxo.',
      createdAt: '15/05/2026',
      updatedAt: '01/08/2026',
    },
    {
      id: 'POP-TIN-017-R5',
      title: 'Pendência externa sem atualização de protocolo',
      description: 'Chamados vinculados a terceiros (Tasy, Philips, Canon, operadora) sem registro de follow-up a cada 72h.',
      defaultEvidenceLevel: 'Indício de desconformidade',
      thresholdHours: 72,
      severity: 'MEDIA',
      isActive: true,
      applicableExceptions: 'Períodos de feriado prolongado em que o fornecedor opera apenas sob escala de sobreaviso.',
      createdAt: '01/08/2026',
      updatedAt: '01/08/2026',
    },
    {
      id: 'POP-TIN-017-R6',
      title: 'date_mod isolada sem acompanhamento humano',
      description: 'Discrepância entre modificação de metadados do banco e falta de ação efetiva do operador humano.',
      defaultEvidenceLevel: 'Indício de desconformidade',
      thresholdHours: 24,
      severity: 'ALTA',
      isActive: true,
      applicableExceptions: 'Trabalhos em lote de saneamento cadastral devidamente agendados.',
      createdAt: '01/08/2026',
      updatedAt: '01/08/2026',
    }
  ],
  revisionHistory: [
    {
      version: 'v2.4',
      date: '01/08/2026',
      author: 'Henrique Vasconcelos (Gestão TI)',
      summary: 'Inclusão de regras para protocolos terceirizados (R5) e vedação contra conclusões disciplinares automáticas.',
      rulesCount: 6
    },
    {
      version: 'v2.3',
      date: '15/05/2026',
      author: 'Dra. Camila Barros (Comitê DTI)',
      summary: 'Adição de critérios de documentação mínima em encerramentos (R3) e tratativa de reaberturas (R4).',
      rulesCount: 4
    },
    {
      version: 'v2.0',
      date: '10/01/2026',
      author: 'Conselho de Governança Operacional',
      summary: 'Marco inaugural canônico: adoção das 4 camadas de evidência e auditoria noturna de 04h.',
      rulesCount: 2
    }
  ]
};

export const DEFAULT_CALCULATION_SETTINGS: OperationalCalculationSettings = {
  stagnationThresholdHours: 24,
  avgResolutionTime: {
    excludeWeekends: true,
    excludeWaitingExternal: true,
    excludeUnassignedTime: false,
    excludeReopened: true,
    calculationWindowDays: 30
  },
  teamGovernance: {
    excludeManagementGroup48: true,
    maxActiveTicketsPerTechThreshold: 6,
    stalledTicketsAlertThreshold: 2,
    excludedGroupIds: [48]
  },
  snapshotSchedules: {
    nightlyAuditTime: '04:00',
    morningBriefTime: '07:00',
    shiftCutoffTime: '17:00'
  },
  authorshipRules: {
    automationKeywords: [
      'glpi_sync',
      'notificacao_automatica',
      'alert_bot',
      'rotina_noturna',
      'system_daemon',
      'cron_job',
      'sistema'
    ],
    minCharsForValidHumanEvidence: 15
  },
  emergencyLocations: [
    'UTI Adulto',
    'UTI Neonatal',
    'Bloco Cirúrgico',
    'Pronto-Socorro',
    'Hemodinâmica',
    'Centro Obstétrico'
  ]
};

export const INITIAL_SETTINGS_AUDIT_LOGS: SettingsAuditLog[] = [
  {
    id: 'log-1',
    timestamp: '06/11/2026 09:30',
    user: 'Henrique Vasconcelos',
    section: 'Regras POP-TIN-017',
    changeDescription: 'Verificação da homologação v2.4 para ciclo diário de auditoria.'
  },
  {
    id: 'log-2',
    timestamp: '05/11/2026 16:45',
    user: 'Administrador HEAL',
    section: 'Tempo Médio Observado',
    changeDescription: 'Ativação do desconto de finais de semana e estados de pendência externa.'
  }
];
