/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Portal de Gestão Operacional da TI do Instituto HEAL
 * Tipagem canônica e contratos de dados
 */

export type UserRole = 'GESTOR' | 'TECNICO' | 'ADMIN';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatarUrl?: string;
}

export type TicketStatus = 'novo' | 'em_atendimento' | 'planejado' | 'pendente' | 'solucionado' | 'fechado';

export type GLPIPriority = 'muito_baixa' | 'baixa' | 'media' | 'alta' | 'muito_alta';

export type ManagerialPriority = 'P1_CRITICA' | 'P2_ALTA' | 'P3_MEDIA' | 'P4_PADRAO';

export type AuthorshipType = 'humana' | 'automacao' | 'indeterminada';

export type EvidenceLevel = 
  | 'Fato confirmado'
  | 'Indício de desconformidade'
  | 'Verificação necessária'
  | 'Desconformidade confirmada';

export type CanonicalPendingStatus = 
  | 'NEW'
  | 'PERSISTENT'
  | 'REOPENED'
  | 'WAITING_EXTERNAL'
  | 'INCONCLUSIVE'
  | 'RESOLVED_WITH_EVIDENCE';

export interface TicketFollowup {
  id: string;
  authorName: string;
  authorType: AuthorshipType;
  date: string; // ISO ou formatado BRT
  content: string;
  isPrivate: boolean;
}

export interface TicketTask {
  id: string;
  description: string;
  status: 'concluida' | 'em_andamento' | 'pendente';
  assignedTo?: string;
  date: string;
}

export interface Ticket {
  id: number;
  title: string;
  status: TicketStatus;
  priorityGLPI: GLPIPriority;
  suggestedPriority: ManagerialPriority;
  groupId: number;
  groupName: string;
  technicianId?: number;
  technicianName?: string;
  category: string;
  dateCreation: string; // ISO
  lastHumanActionDate: string; // última ação humana comprovada
  dateMod: string; // data de modificação técnica no GLPI (NUNCA interpretar isoladamente como ação humana!)
  isWithoutEvolution24h: boolean;
  hasNominalTech: boolean;
  hospitalLocation: string; // Bloco Cirúrgico, UTI Adulto, Farmácia Central, etc.
  clinicalImpactAssessed: boolean;
  evidenceGaps: string[];
  tasks: TicketTask[];
  followups: TicketFollowup[];
  description: string;
}

export interface Technician {
  id: number;
  name: string;
  role: string;
  groupId: number;
  groupName: string;
  isManagementGroup: boolean; // Grupo 48 Gestão: excluído dos rankings de produtividade
  activeTicketsCount: number;
  ticketsWithoutEvolution24hCount: number;
  resolvedInPeriodCount: number;
  avgObservedResolutionHours: number; // tempo médio observado (não é MTTR nem SLA!)
  avatarInitials: string;
  email: string;
}

export interface PendingItem {
  id: string;
  stableFingerprint: string; // Identificador estável
  ticketId: number;
  ticketTitle: string;
  status: CanonicalPendingStatus;
  evidenceLevel: EvidenceLevel;
  popRule: string; // ex: POP-TIN-017 v2.4
  daysOpen: number;
  assignedTechnicianName?: string;
  groupName: string;
  description: string;
  evidenceNotes: string;
  lastAuditDate: string;
  transitionHistory: {
    from: CanonicalPendingStatus;
    to: CanonicalPendingStatus;
    timestamp: string;
    reason: string;
  }[];
}

export interface AuditSnapshot {
  id: string;
  timestamp: string;
  type: 'SNAPSHOT_04H' | 'MANUAL';
  totalTicketsEvaluated: number;
  newPendingsCount: number;
  persistentPendingsCount: number;
  reopenedPendingsCount: number;
  resolvedWithEvidenceCount: number;
  rulesEvaluated: string[];
  limitations: string;
  auditor: string;
  status: 'CONCLUIDO' | 'ALERTA';
}

export type PanelTemplateType = 'TPL-01' | 'TPL-02' | 'TPL-03' | 'TPL-04';

export interface ArtifactPanel {
  id: string;
  templateType: PanelTemplateType;
  templateName: string;
  title: string;
  ownerName: string;
  referenceDate: string; // Data de referência (America/Sao_Paulo)
  generationDate: string;
  source: 'REALTIME' | 'SNAPSHOT_04H';
  version: string;
  status: 'APROVADO' | 'RASCUNHO' | 'ARQUIVADO';
  summary: {
    headline: string;
    criticalAlertsCount: number;
    topPriorities: string[];
    keyDecisionsSummary: string;
    metricsBrief: { label: string; value: string | number }[];
  };
  detail: {
    sections: {
      title: string;
      description?: string;
      items: {
        title: string;
        description: string;
        responsible?: string;
        deadline?: string;
        status?: string;
        evidenceLevel?: EvidenceLevel;
        relatedTicketId?: number;
      }[];
    }[];
    governanceNotes?: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  pathType?: 'FAST_PATH' | 'AGY';
  sources?: string[];
  analyticalDetail?: string; // Conteúdo aprofundado para revelação progressiva ("Ver análise completa")
  quickArtifact?: ArtifactPanel;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
  templateGenerated?: string;
}

export type NavigationRoute = 
  | 'visao-geral'
  | 'chamados'
  | 'equipe'
  | 'pendencias'
  | 'auditorias'
  | 'indicadores'
  | 'agente-gerencial'
  | 'daily-paineis'
  | 'templates'
  | 'configuracoes';

export interface NavMenuItemConfig {
  id: NavigationRoute;
  label: string;
  isVisible: boolean;
  isLocked?: boolean; // ex: 'configuracoes' não pode ser desativado
}

export interface PopRule {
  id: string; // ex: 'POP-TIN-017-R1'
  title: string;
  description: string;
  defaultEvidenceLevel: EvidenceLevel;
  thresholdHours: number; // ex: 24h
  severity: 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAIXA';
  isActive: boolean;
  applicableExceptions: string;
  createdAt: string;
  updatedAt: string;
}

export interface PopRevision {
  version: string;
  date: string;
  author: string;
  summary: string;
  rulesCount: number;
}

export interface PopSpecification {
  code: string; // 'POP-TIN-017'
  version: string; // 'v2.4'
  status: 'VIGENTE' | 'HOMOLOGADA' | 'RASCUNHO' | 'ARQUIVADA';
  homologatedBy: string; // 'Diretoria de Tecnologia da Informação (DTI)'
  effectiveDate: string; // '01/08/2026'
  changeNotes: string;
  rules: PopRule[];
  revisionHistory: PopRevision[];
}

export interface OperationalCalculationSettings {
  // Limiar de estagnação geral
  stagnationThresholdHours: number; // 24

  // Parâmetros do Tempo Médio Observado
  avgResolutionTime: {
    excludeWeekends: boolean;
    excludeWaitingExternal: boolean;
    excludeUnassignedTime: boolean;
    excludeReopened: boolean;
    calculationWindowDays: number; // 30
  };

  // Governança de Equipe
  teamGovernance: {
    excludeManagementGroup48: boolean;
    maxActiveTicketsPerTechThreshold: number; // 6
    stalledTicketsAlertThreshold: number; // 2
    excludedGroupIds: number[]; // [48]
  };

  // Horários dos Snapshots Oficiais (America/Sao_Paulo)
  snapshotSchedules: {
    nightlyAuditTime: string; // '04:00'
    morningBriefTime: string; // '07:00'
    shiftCutoffTime: string; // '17:00'
  };

  // Classificação de Autoria Humana vs Automação
  authorshipRules: {
    automationKeywords: string[]; // ['glpi_sync', 'notificacao_automatica', 'alert_bot', 'rotina_noturna', 'system']
    minCharsForValidHumanEvidence: number; // 15
  };

  // Setores Críticos de Alta Prioridade
  emergencyLocations: string[];
}

export interface SettingsAuditLog {
  id: string;
  timestamp: string;
  user: string;
  section: string;
  changeDescription: string;
}

