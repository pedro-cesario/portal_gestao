/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Agente Gerencial (Copiloto Central de Gestão Operacional)
 * Motor de criação de painéis, FAST_PATH determinístico, AGY analítico
 * Inclui Histórico de Conversas Persistente por Sessão e botão de Nova Conversa
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  FileSpreadsheet, 
  AlertTriangle, 
  ArrowUpRight, 
  ShieldCheck, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Clock,
  Layers,
  FileCheck,
  MessageSquare,
  Plus,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
  ArrowRight
} from 'lucide-react';
import { ChatMessage, ArtifactPanel, Ticket, Technician, PendingItem, ChatSession } from '../../types';
import { EvidenceBadge } from '../common/EvidenceBadge';

interface AgenteGerencialViewProps {
  tickets: Ticket[];
  technicians: Technician[];
  pendings: PendingItem[];
  onSaveArtifactToCatalog: (artifact: ArtifactPanel) => void;
  onNavigateToSavedPanels: () => void;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const AgenteGerencialView: React.FC<AgenteGerencialViewProps> = ({
  tickets,
  technicians,
  pendings,
  onSaveArtifactToCatalog,
  onNavigateToSavedPanels,
  initialPrompt,
  onClearInitialPrompt
}) => {
  // Pre-seeded Histórico de Sessões Realistas
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: 'session-active',
      title: 'Plantão Atual — Análise & Geração 06/11',
      updatedAt: '10:10 (Brasília)',
      templateGenerated: 'TPL-01',
      messages: [
        {
          id: 'msg-welcome',
          role: 'assistant',
          content: 'Olá! Sou o Agente Gerencial da TI do Instituto HEAL. Posso responder consultas operacionais rápidas, auditar evidências ou gerar painéis estruturados (Daily, Alinhamento Semanal, Feedback Individual ou Gestão de Projetos). Como posso apoiar sua gestão agora?',
          timestamp: '10:00 (Brasília)',
          pathType: 'FAST_PATH',
          sources: ['GLPI Réplica MariaDB', 'Auditoria Snapshot 04h']
        }
      ]
    },
    {
      id: 'session-yesterday',
      title: 'Daily & Prioridades de 05/11',
      updatedAt: '05/11 17:30',
      templateGenerated: 'TPL-01',
      messages: [
        {
          id: 'm1',
          role: 'user',
          content: 'Gere o Daily Operacional referente ao dia 05/11 e liste as 3 prioridades do plantão.',
          timestamp: '05/11 07:10'
        },
        {
          id: 'm2',
          role: 'assistant',
          content: 'Daily do dia 05/11 gerado com sucesso. As 3 prioridades aprovadas foram: 1) Expansão de tablespace do banco analítico; 2) Investigação de I/O no nó 2 do cluster PACS; 3) Substituição preventiva do patch cable na UTI Adulto.',
          timestamp: '05/11 07:11',
          pathType: 'FAST_PATH',
          sources: ['Snapshot 04h00', 'GLPI Réplica']
        }
      ]
    },
    {
      id: 'session-mariana',
      title: 'Dossiê Feedback Mariana Costa (Tasy)',
      updatedAt: '04/11 16:40',
      templateGenerated: 'TPL-03',
      messages: [
        {
          id: 'm3',
          role: 'user',
          content: 'Monte a minuta de feedback individual estruturado para a analista Mariana Costa.',
          timestamp: '04/11 16:30'
        },
        {
          id: 'm4',
          role: 'assistant',
          content: 'Dossiê TPL-03 compilado com base em 58 chamados resolvidos no período, 1.7% de taxa de reabertura e 94% de qualidade documental. Conclusões disciplinares automáticas excluídas conforme governança.',
          timestamp: '04/11 16:32',
          pathType: 'AGY',
          sources: ['Histórico GLPI Mariana Costa', 'Auditorias POP-TIN-017']
        }
      ]
    },
    {
      id: 'session-pacs',
      title: 'Diagnóstico Storage PACS & CDI',
      updatedAt: '03/11 11:20',
      templateGenerated: 'TPL-04',
      messages: [
        {
          id: 'm5',
          role: 'user',
          content: 'Qual a causa raiz da lentidão na abertura de laudos tomográficos no visualizador PACS?',
          timestamp: '03/11 11:15'
        },
        {
          id: 'm6',
          role: 'assistant',
          content: 'Identificado gargalo de I/O de disco no pool 3 do storage secundário NAS-PACS-02 durante renderização de exames acima de 800 cortes. Recomendada abertura de chamado de garantia com fabricante e autorização da Decisão DEC-2026-88.',
          timestamp: '03/11 11:18',
          pathType: 'AGY',
          sources: ['Monitoramento de Storage', 'Chamado #48204']
        }
      ]
    }
  ]);

  const [activeSessionId, setActiveSessionId] = useState<string>('session-active');
  const [showHistorySidebar, setShowHistorySidebar] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return false;
    return true;
  });

  // Mensagens da sessão ativa
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const messages = activeSession ? activeSession.messages : [];

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [expandedDetailId, setExpandedDetailId] = useState<string | null>(null);
  const [savedPanelSuccess, setSavedPanelSuccess] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages, isProcessing, activeSessionId]);

  // Se houver um prompt inicial vindo de outro módulo
  useEffect(() => {
    if (initialPrompt) {
      handleSend(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  // Ações Rápidas (FAST_PATH determinísticos)
  const quickActions = [
    { label: 'Analise os 3 chamados críticos', prompt: 'Analise os três chamados prioritários que requerem atenção imediata da gestão.' },
    { label: 'Gere meu Daily de hoje (TPL-01)', prompt: 'Gere o Daily Operacional de hoje (06/11) com base no snapshot das 04h e evidências do GLPI.' },
    { label: 'Chamados sem técnico nominal', prompt: 'Quais chamados assistenciais estão sem técnico nominal atribuído?' },
    { label: 'Monte o Alinhamento Semanal (TPL-02)', prompt: 'Prepare a estrutura do Alinhamento Semanal com indicadores e compromissos da equipe.' },
    { label: 'Feedback para Mariana Costa (TPL-03)', prompt: 'Monte uma minuta de feedback individual estruturado para a analista Mariana Costa.' },
  ];

  // Sugestões Centrais em Destaque para Novas Conversas (Cards no Meio da Tela)
  const featuredCenterSuggestions = [
    {
      title: 'Daily Operacional (TPL-01)',
      subtitle: 'Snapshot das 04h + GLPI',
      badge: 'TPL-01',
      badgeColor: 'bg-blue-500/10 text-[#134F9F] dark:text-blue-400',
      icon: FileSpreadsheet,
      iconColor: 'bg-blue-500/10 text-[#134F9F] dark:text-blue-400',
      description: 'Sintetiza as 6 seções canônicas, exceptions >24h, carga da equipe e as 3 prioridades operacionais do turno.',
      prompt: 'Gere o Daily Operacional de hoje (06/11) com base no snapshot das 04h e evidências do GLPI.'
    },
    {
      title: '3 Chamados Críticos do Plantão',
      subtitle: 'Risco Clínico & Assistencial',
      badge: 'FAST-PATH',
      badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      icon: AlertTriangle,
      iconColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      description: 'Avaliação imediata dos 3 chamados que requerem atenção da gestão (#48219 UTI, #48191 Obstétrico e #48098 PA).',
      prompt: 'Analise os três chamados prioritários que requerem atenção imediata da gestão.'
    },
    {
      title: 'Chamados sem Técnico Nominal',
      subtitle: 'Conformidade POP-TIN-017 R2',
      badge: 'POP-R2',
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      icon: Users,
      iconColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      description: 'Varredura imediata de chamados assistenciais críticos vinculados apenas a grupo, sem operador individual.',
      prompt: 'Quais chamados assistenciais estão sem técnico nominal atribuído?'
    },
    {
      title: 'Feedback Mariana Costa (TPL-03)',
      subtitle: 'Sistemas Hospitalares (Tasy)',
      badge: 'TPL-03',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      icon: FileCheck,
      iconColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      description: 'Dossiê fundamentado em 58 resoluções no mês, sem caráter punitivo ou conclusões disciplinares automáticas.',
      prompt: 'Monte uma minuta de feedback individual estruturado para a analista Mariana Costa.'
    },
    {
      title: 'Alinhamento Semanal (TPL-02)',
      subtitle: 'Diretoria & Coordenação',
      badge: 'TPL-02',
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      icon: Layers,
      iconColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      description: 'Estruturação da pauta gerencial com indicadores consolidados, pendências persistentes e metas da equipe.',
      prompt: 'Prepare a estrutura do Alinhamento Semanal com indicadores e compromissos da equipe.'
    },
    {
      title: 'Auditoria de Chamados >24h',
      subtitle: 'Sem Evolução Humana Comprovada',
      badge: 'AUDITORIA',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      icon: Clock,
      iconColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      description: 'Auditoria de chamados abertos que excederam a tolerância horária sem apontamento humano no GLPI.',
      prompt: 'Quais chamados apresentam desconformidade por ausência de evolução humana há mais de 24h?'
    }
  ];

  // Iniciar nova conversa
  const handleStartNewSession = () => {
    const newSessionId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'Nova Conversa Operacional',
      updatedAt: 'Agora (10:10)',
      messages: [
        {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          content: 'Nova conversa iniciada. Como posso apoiar a gestão operacional da TI agora? Posso responder sobre o status do GLPI, analisar pendências ou gerar painéis executivos.',
          timestamp: '10:10 (Brasília)',
          pathType: 'FAST_PATH',
          sources: ['GLPI Réplica MariaDB', 'Snapshot Noturno 04h']
        }
      ]
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSessionId);
  };

  // Excluir conversa
  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      alert('Você deve manter pelo menos uma conversa no histórico.');
      return;
    }
    const filtered = sessions.filter(s => s.id !== sessionId);
    setSessions(filtered);
    if (activeSessionId === sessionId) {
      setActiveSessionId(filtered[0].id);
    }
  };

  // Atualizar mensagens na sessão ativa
  const appendMessageToActiveSession = (newMsg: ChatMessage, newTitle?: string, generatedTpl?: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          title: newTitle || (s.title === 'Nova Conversa Operacional' ? newMsg.content.slice(0, 38) + '...' : s.title),
          updatedAt: '10:10 (Brasília)',
          templateGenerated: generatedTpl || s.templateGenerated,
          messages: [...s.messages, newMsg]
        };
      }
      return s;
    }));
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: '10:10 (Brasília)'
    };

    appendMessageToActiveSession(userMsg);
    setInputPrompt('');
    setIsProcessing(true);

    const lower = query.toLowerCase();

    // Roteamento inteligente: FAST_PATH vs AGY Real de Geração de Painel
    if (lower.includes('daily') || lower.includes('tpl-01') || lower.includes('painel de hoje')) {
      // GERAÇÃO DE DAILY OPERACIONAL (TPL-01)
      setProcessingStatus('Consultando snapshot 04h, calculando exceções >24h e selecionando 3 prioridades...');
      setTimeout(() => {
        const dailyArtifact: ArtifactPanel = {
          id: `art-daily-${Date.now()}`,
          templateType: 'TPL-01',
          templateName: 'TPL-01 — Daily Operacional',
          title: 'Daily Operacional TI — 06/11/2026',
          ownerName: 'Agente Gerencial',
          referenceDate: '06/11/2026',
          generationDate: '06/11/2026 10:10',
          source: 'SNAPSHOT_04H',
          version: 'v1.0 (Prévia Gerada)',
          status: 'RASCUNHO',
          summary: {
            headline: 'Estabilidade operacional mantida com 2 alertas críticos: telemetria UTI Adulto e prescrição obstétrica sem técnico.',
            criticalAlertsCount: 2,
            topPriorities: [
              '#48219: Normalizar uplink telemetria leitos 12-14 na UTI Adulto',
              '#48191: Atribuir responsável nominal para prescrição no Centro Obstétrico',
              '#48098: Substituir impressora térmica da Triagem PA parada há >24h'
            ],
            keyDecisionsSummary: 'Priorização de campo direcionada à UTI e Centro Obstétrico. Grupo 48 apoia articulação de storage com fornecedor PACS.',
            metricsBrief: [
              { label: 'Chamados Ativos', value: 33 },
              { label: 'Sem Evolução >24h', value: 3 },
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
                  { title: 'Conectividade e Links', description: 'Ambos os links de fibra com 100% de disponibilidade. Sem indisponibilidades registradas.' },
                  { title: 'Sistemas Clínicos', description: 'Tasy ERP operando normalmente; aprazamento do Centro Obstétrico requer verificação (#48191).' }
                ]
              },
              {
                title: '2. Pendências & Auditoria POP-TIN-017',
                description: 'Chamados auditados com desconformidades de documentação ou prazo.',
                items: [
                  { title: '#48098 (Zebra Triagem)', description: '42 horas sem ação humana documentada.', responsible: 'Lucas Mendes', deadline: 'Hoje 11:30', evidenceLevel: 'Indício de desconformidade', relatedTicketId: 48098 },
                  { title: '#48191 (Prescrição Obstétrica)', description: 'Chamado assistencial de risco vital sem técnico nominal.', deadline: 'Imediato', evidenceLevel: 'Desconformidade confirmada', relatedTicketId: 48191 }
                ]
              },
              {
                title: '3. Carga e Distribuição da Equipe Técnica',
                description: 'Distribuição dos 33 chamados ativos (Grupo 48 Gestão excluído dos rankings).',
                items: [
                  { title: 'Suporte Presencial (Rafael / Lucas)', description: '13 chamados. Rafael alocado na UTI; Lucas focado em periféricos do PA.' },
                  { title: 'Sistemas Clínicos (Mariana / Fernanda)', description: '11 chamados. Interfaces de farmácia e storage PACS.' },
                  { title: 'Infraestrutura (Carlos Ramos)', description: '9 chamados. Switches assistenciais e links de dados.' }
                ]
              },
              {
                title: '4. Entregas Concluídas nas Últimas 24h',
                items: [
                  { title: '#47990: Banco de Indicadores', description: 'Tablespace ampliado em 100GB e réplica CDC sincronizada.', evidenceLevel: 'Fato confirmado' }
                ]
              },
              {
                title: '5. As 3 Prioridades do Turno',
                items: [
                  { title: 'Prioridade 1: Telemetria UTI Leitos 12-14', description: 'Troca de transceiver SFP e validação de pacotes VLAN 104.', responsible: 'Rafael / Carlos Ramos' },
                  { title: 'Prioridade 2: Prescrição Centro Obstétrico', description: 'Assunção nominal e teste de timeout do aprazamento.', responsible: 'Mariana Costa' },
                  { title: 'Prioridade 3: Impressora Contingência PA', description: 'Instalação de equipamento reserva na triagem.', responsible: 'Lucas Mendes' }
                ]
              },
              {
                title: '6. Decisões e Encaminhamentos',
                items: [
                  { title: 'Decisão DEC-2026-88', description: 'Autorizada abertura de chamado com garantia do fornecedor PACS.' },
                  { title: 'Decisão DEC-2026-89', description: 'Remanejamento temporário de impressora térmica da administração.' }
                ]
              }
            ],
            governanceNotes: 'Gerado sob demanda pelo Agente Gerencial em conformidade com o padrão TPL-01.'
          }
        };

        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: 'Daily Operacional gerado com sucesso pelo modelo TPL-01! Sintetizei as 6 seções obrigatórias: Resumo, Pendências, Equipe, Entregas, 3 Prioridades e Decisões. Veja a prévia consolidada abaixo e confirme para salvar no catálogo oficial.',
          timestamp: '10:10 (Brasília)',
          pathType: 'AGY',
          sources: ['Snapshot Oficial 04h00', 'Réplica GLPI MariaDB', 'Diretriz POP-TIN-017 v2.4'],
          quickArtifact: dailyArtifact,
          analyticalDetail: 'Base de dados consolidada com 33 chamados ativos, 80 solucionados na semana e 3 pendências críticas sob acompanhamento gerencial.'
        };

        appendMessageToActiveSession(botMsg, 'Geração de Daily Operacional', 'TPL-01');
        setIsProcessing(false);
      }, 1200);

    } else if (lower.includes('três chamados') || lower.includes('3 chamados') || lower.includes('críticos') || lower.includes('prioritários')) {
      // FAST_PATH: OS 3 CHAMADOS PRIORITÁRIOS
      setProcessingStatus('Consultando fila de prioridades assistenciais...');
      setTimeout(() => {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: `Aqui estão os 3 chamados que requerem atenção gerencial imediata no plantão de hoje:\n\n1. **#48219 (UTI Adulto - Monitores Cardíacos)**: Risco de comunicação de telemetria nos leitos 12 a 14. Técnico Rafael em atendimento com apoio de Infraestrutura.\n2. **#48191 (Centro Obstétrico - Prescrição)**: Chamado crítico sem técnico nominal há mais de 2h. Risco de atraso no aprazamento medicamentoso.\n3. **#48098 (Pronto Atendimento - Zebra Triagem)**: Mais de 42h sem evolução humana observável. Requer fornecimento imediato de impressora de contingência.`,
          timestamp: '10:10 (Brasília)',
          pathType: 'FAST_PATH',
          sources: ['Fila Operacional GLPI', 'Triagem de Impacto Clínico'],
          analyticalDetail: 'Detalhes adicionais de auditoria:\n- #48219: O GLPI marcava prioridade média, porém a gestão reclassificou para P1 Crítica por envolver suporte a leitos intensivos.\n- #48191: Atribuição apenas ao Grupo 12. Regra POP-TIN-017 subitem 3.1 exige assunção nominal em até 30min em áreas críticas.\n- #48098: Falha física na cabeça térmica. Peça requisitada no almoxarifado em 04/11 sem andamento posterior.'
        };
        appendMessageToActiveSession(botMsg, 'Análise dos 3 Chamados Críticos');
        setIsProcessing(false);
      }, 600);

    } else if (lower.includes('sem técnico') || lower.includes('sem tecnico') || lower.includes('nominal')) {
      // FAST_PATH: CHAMADOS SEM TÉCNICO NOMINAL
      setProcessingStatus('Varrendo chamados ativos com técnico nulo...');
      setTimeout(() => {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: `Identifiquei **2 chamados ativos sem técnico nominal** atribuído (apenas grupo de atendimento associado):\n\n• **#48191** — Travamento da prescrição eletrônica Tasy no Centro Obstétrico (Grupo 12 Sistemas Hospitalares) — *Prioridade Gerencial Crítica*.\n• **#48225** — Troca de toner no posto administrativo do faturamento (Grupo 18 Suporte Presencial) — *Prioridade Padrão*.\n\nRecomendação: Atribuir nominalmente o chamado #48191 para Mariana Costa ou Fernanda Lima imediatamente.`,
          timestamp: '10:10 (Brasília)',
          pathType: 'FAST_PATH',
          sources: ['GLPI MariaDB Read-Only'],
          analyticalDetail: 'A ausência de técnico nominal viola a regra POP-TIN-017 (Subitem 3.1) para setores de classificação de risco vital. O tempo de resposta médio para chamados sem técnico nominal é 3x superior aos nominalmente assumidos.'
        };
        appendMessageToActiveSession(botMsg, 'Chamados sem Técnico Nominal');
        setIsProcessing(false);
      }, 500);

    } else if (lower.includes('feedback') || lower.includes('mariana') || lower.includes('tpl-03')) {
      // GERAÇÃO DE FEEDBACK INDIVIDUAL (TPL-03)
      setProcessingStatus('Compilando métricas factuais, chamados resolvidos e ausência de notas punitivas...');
      setTimeout(() => {
        const feedbackArtifact: ArtifactPanel = {
          id: `art-feedback-${Date.now()}`,
          templateType: 'TPL-03',
          templateName: 'TPL-03 — Feedback Individual',
          title: 'Dossiê de Feedback Técnico — Mariana Costa (Sistemas)',
          ownerName: 'Henrique Vasconcelos',
          referenceDate: 'Novembro 2026',
          generationDate: '06/11/2026 10:10',
          source: 'REALTIME',
          version: 'v1.0 (Minuta Agente)',
          status: 'RASCUNHO',
          summary: {
            headline: 'Excelente resolutividade em incidentes de alta complexidade do Tasy. Oportunidade de registrar notas antes das 17h.',
            criticalAlertsCount: 0,
            topPriorities: [
              'Registrar followups antes das 17h para mitigar falsos alertas no snapshot noturno das 04h',
              'Apoiar mentoria em farmácia para o analista Lucas Mendes'
            ],
            keyDecisionsSummary: 'Feedback fundamentado em evidências do GLPI, com foco em desenvolvimento e sem caráter punitivo ou disciplinar.',
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
                title: '1. Evidências Factuais do Período',
                items: [
                  { title: 'Condução da Crise de Faturamento (28/10)', description: 'Identificou trava em fila de mensageria e restabeleceu em 1h15 com zero impacto fiscal.', evidenceLevel: 'Fato confirmado' },
                  { title: 'Índice de Reabertura Residual', description: 'Apenas 1 chamado reaberto em 58 concluídos no ciclo de 30 dias.', evidenceLevel: 'Fato confirmado' }
                ]
              },
              {
                title: '2. Pontos Positivos Comprovados',
                items: [
                  { title: 'Domínio Clínico Tasy', description: 'Comunicação empática com a equipe assistencial de enfermagem e médicos.' },
                  { title: 'Rigor Técnico', description: 'Documentação de causas raiz clara nos fechamentos.' }
                ]
              },
              {
                title: '3. Combinados e Próximos Passos',
                items: [
                  { title: 'Apontamento Tempestivo', description: 'Registrar notas de andamento intermediárias no GLPI para evitar falsos alertas no snapshot 04h.' }
                ]
              }
            ],
            governanceNotes: 'Documento estruturado conforme modelo TPL-03. Exclusivo para gestão e desenvolvimento profissional.'
          }
        };

        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: 'Minuta de Feedback Individual estruturada gerada sob o template TPL-03! As evidências foram fundamentadas diretamente nos registros do GLPI, garantindo caráter construtivo e livre de conclusões punitivas automáticas. Confira a prévia abaixo:',
          timestamp: '10:10 (Brasília)',
          pathType: 'AGY',
          sources: ['Histórico Nominal GLPI', 'Auditorias POP-TIN-017'],
          quickArtifact: feedbackArtifact,
          analyticalDetail: 'Métricas da técnica: 58 chamados resolvidos no período, tempo médio de 18.4h, taxa de reabertura de 1.7% e índice de qualidade documental de 94%.'
        };

        appendMessageToActiveSession(botMsg, 'Feedback Individual Mariana Costa', 'TPL-03');
        setIsProcessing(false);
      }, 1000);

    } else {
      // RESPOSTA ANALÍTICA GERAL (AGY)
      setProcessingStatus('Processando consulta com contexto hospitalar e réplica GLPI...');
      setTimeout(() => {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: `Entendido. Com base nos dados ativos do GLPI (33 chamados abertos e 80 solucionados na semana), a operação de TI do Instituto HEAL mantém estabilidade global de 98.2%.\n\nPrincipais direcionamentos sugeridos:\n1. Manter foco na normalização da telemetria da UTI Geral (#48219).\n2. Realizar a assunção nominal da prescrição obstétrica (#48191).\n3. Validar a entrega de impressora reserva na triagem do PA (#48098).\n\nPosso gerar um painel estruturado (Daily Operacional ou Alinhamento Semanal) com essas informações se desejar.`,
          timestamp: '10:10 (Brasília)',
          pathType: 'AGY',
          sources: ['GLPI Réplica MariaDB', 'Snapshot Noturno 04h'],
          analyticalDetail: 'Parâmetros avaliados:\n- Total de chamados com mais de 24h sem ação técnica: 3\n- Total de técnicos com sobrecarga acima de 8 chamados: 2 (Carlos Ramos e Lucas Mendes)\n- Nível de conformidade documental POP-TIN-017: 88.5%'
        };
        appendMessageToActiveSession(botMsg);
        setIsProcessing(false);
      }, 900);
    }
  };

  const handleApproveAndSave = (artifact: ArtifactPanel) => {
    const approved: ArtifactPanel = {
      ...artifact,
      status: 'APROVADO',
      version: `${artifact.version} (Aprovado)`
    };
    onSaveArtifactToCatalog(approved);
    setSavedPanelSuccess(`O painel "${artifact.title}" foi aprovado e arquivado com sucesso no catálogo de Daily e Painéis!`);
    setTimeout(() => setSavedPanelSuccess(null), 5000);
  };

  return (
    <div className="p-2 sm:p-3 w-full h-[calc(100vh-3.5rem)] flex gap-3 relative">
      {/* SIDEBAR DE HISTÓRICO DE CONVERSAS (Drawer off-canvas no mobile, inline no desktop) */}
      {showHistorySidebar && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-30 transition-opacity"
            onClick={() => setShowHistorySidebar(false)}
            aria-hidden="true"
          />
          <aside className="fixed md:static inset-y-0 left-0 z-40 w-72 md:w-64 shrink-0 bg-white dark:bg-slate-900 border-r md:border border-slate-200 dark:border-slate-800 md:rounded-lg flex flex-col justify-between overflow-hidden shadow-2xl md:shadow-xs transition-all">
            <div>
              {/* Header do Histórico */}
              <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#134F9F] dark:text-blue-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Histórico de Conversas
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHistorySidebar(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  title="Ocultar histórico"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>

              {/* Botão de Nova Conversa */}
              <div className="p-2.5 border-b border-slate-100 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => {
                    handleStartNewSession();
                    if (window.innerWidth < 768) setShowHistorySidebar(false);
                  }}
                  className="w-full py-2 px-3 bg-[#134F9F] hover:bg-blue-800 text-white font-semibold rounded-md text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nova Conversa</span>
                </button>
              </div>

              {/* Lista de Sessões Anteriores */}
              <div className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-14rem)]">
                {sessions.map((session) => {
                  const isActive = session.id === activeSessionId;
                  return (
                    <div
                      key={session.id}
                      onClick={() => {
                        setActiveSessionId(session.id);
                        if (window.innerWidth < 768) setShowHistorySidebar(false);
                      }}
                      className={`p-2.5 rounded-lg text-xs sm:text-[13px] cursor-pointer transition-all group flex flex-col gap-1 border ${
                        isActive
                          ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60 text-[#134F9F] dark:text-blue-300 font-semibold shadow-2xs'
                          : 'border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <span className="truncate leading-tight">
                          {session.title}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteSession(session.id, e)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-0.5 transition-opacity cursor-pointer"
                          title="Excluir conversa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                        <span>{session.updatedAt}</span>
                        {session.templateGenerated && (
                          <span className="bg-blue-500/10 dark:bg-blue-500/20 text-[#134F9F] dark:text-blue-400 font-bold px-1.5 py-0.2 rounded">
                            {session.templateGenerated}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rodapé do Histórico */}
            <div className="p-2.5 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
              <span>{sessions.length} sessões</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">Memória OK</span>
            </div>
          </aside>
        </>
      )}

      {/* ÁREA CENTRAL DO CHAT */}
      <div className="flex-1 flex flex-col justify-between min-w-0 h-full">
        {/* CABEÇALHO DO AGENTE COM BADGE INSTITUCIONAL */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shrink-0 mb-3 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {!showHistorySidebar && (
                <button
                  type="button"
                  onClick={() => setShowHistorySidebar(true)}
                  className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Abrir histórico de conversas"
                >
                  <PanelLeftOpen className="w-4 h-4" />
                </button>
              )}

              <div className="w-8 h-8 rounded-lg bg-[#134F9F] flex items-center justify-center text-white shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate max-w-[280px] sm:max-w-md">
                    {activeSession ? activeSession.title : 'Agente Gerencial'}
                  </h2>
                  <span className="text-xs font-mono font-bold bg-blue-500/10 text-[#134F9F] dark:text-blue-400 px-2 py-0.5 rounded">
                    Sessão Ativa
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  Ponto único de criação de painéis · Governança e auditoria GLPI
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                Privacy Gateway Ativo
              </span>
            </div>
          </div>
        </div>

        {savedPanelSuccess && (
          <div className="mb-3 p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 rounded-lg text-xs sm:text-sm flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{savedPanelSuccess}</span>
            </div>
            <button
              type="button"
              onClick={onNavigateToSavedPanels}
              className="text-xs sm:text-sm font-bold text-[#134F9F] dark:text-blue-300 underline shrink-0"
            >
              Abrir em Daily e Painéis →
            </button>
          </div>
        )}

        {/* ÁREA DE CONVERSA COM ROLAGEM (Sem scroll no estado inicial de sugestões e sem cortes) */}
        <div className={`flex-1 pr-1 mb-2 ${messages.length <= 1 ? 'overflow-hidden flex flex-col justify-center py-1' : 'overflow-y-auto space-y-4'}`}>
          {/* Se a sessão for nova ou tiver apenas a saudação inicial, exibir sugestões no meio da tela com zero scroll e sem cortes */}
          {messages.length <= 1 ? (
            <div className="w-full flex flex-col justify-center px-1 sm:px-3">
              {/* Header Central de Boas-Vindas com Ícone Inline e Tipografia Confortável */}
              <div className="text-center mb-3 shrink-0">
                <div className="inline-flex items-center gap-2.5 mb-1.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#134F9F] to-blue-500 flex items-center justify-center text-white shadow-xs">
                    <Bot className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 dark:text-slate-100">
                    Como posso apoiar sua gestão operacional hoje?
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
                  Consulte status do GLPI, realize auditorias com evidências ou gere painéis executivos com um clique:
                </p>
              </div>

              {/* Grid Central de Sugestões em Destaque (Full Width, Legível e Proporcional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 w-full">
                {featuredCenterSuggestions.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(item.prompt)}
                      className="text-left p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-[#134F9F] dark:hover:border-blue-400 hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className={`p-1.5 rounded-lg ${item.iconColor}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#134F9F] dark:group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5 mb-1">
                          {item.subtitle}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-snug line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs sm:text-sm font-semibold text-[#134F9F] dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                        <span>Iniciar consulta</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-4xl lg:max-w-5xl rounded-xl p-4 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#134F9F] text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-xs'
                }`}
              >
                {/* Header da Mensagem do Bot */}
                {msg.role === 'assistant' && (
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800/80 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Agente Gerencial</span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className={`font-mono text-xs px-2 py-0.5 rounded font-bold ${
                        msg.pathType === 'FAST_PATH' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' : 'bg-blue-500/15 text-[#134F9F] dark:text-blue-400'
                      }`}>
                        {msg.pathType || 'AGY'}
                      </span>
                    </div>
                    <span className="font-mono text-xs">{msg.timestamp}</span>
                  </div>
                )}

                {/* Conteúdo Principal (Sintético Primeiro) */}
                <div className="whitespace-pre-line">
                  {msg.content}
                </div>

                {/* PRÉVIA VISUAL ESTRUTURADA DE PAINEL GERADO (QUICK ARTIFACT) */}
                {msg.quickArtifact && (
                  <div className="mt-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-[#134F9F] dark:text-blue-400" />
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block">
                            {msg.quickArtifact.templateName}
                          </span>
                          <strong className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {msg.quickArtifact.title}
                          </strong>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded">
                        {msg.quickArtifact.status}
                      </span>
                    </div>

                    {/* Headline e Métricas Sintéticas da Capa */}
                    <p className="text-slate-700 dark:text-slate-300 italic">
                      "{msg.quickArtifact.summary.headline}"
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                      {msg.quickArtifact.summary.metricsBrief.map((m, idx) => (
                        <div key={idx} className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded">
                          <span className="text-[10px] text-slate-400 block">{m.label}</span>
                          <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">{m.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* As 3 Prioridades do Painel */}
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-[11px] block mb-1">
                        Prioridades Estruturadas:
                      </span>
                      <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                        {msg.quickArtifact.summary.topPriorities.map((p, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#134F9F] dark:text-blue-400 font-bold font-mono">{idx + 1}.</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Botões de Confirmação e Salvamento */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        Fonte: {msg.quickArtifact.source} · {msg.quickArtifact.generationDate}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleApproveAndSave(msg.quickArtifact!)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 font-semibold text-white bg-[#134F9F] hover:bg-blue-800 rounded-md transition-colors shadow-xs cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Aprovar e Salvar no Catálogo</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Botão de Revelação Progressiva ("Ver análise completa") */}
                {msg.analyticalDetail && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setExpandedDetailId(expandedDetailId === msg.id ? null : msg.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#134F9F] dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      <span>{expandedDetailId === msg.id ? 'Ocultar análise completa' : 'Ver análise completa com fontes e evidências'}</span>
                      {expandedDetailId === msg.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {expandedDetailId === msg.id && (
                      <div className="mt-2 p-2.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5">
                        <div className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">
                          Detalhamento Factual & Justificativas
                        </div>
                        <p className="whitespace-pre-line leading-relaxed">
                          {msg.analyticalDetail}
                        </p>
                        {msg.sources && (
                          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
                            <strong>Fontes:</strong>
                            <span>{msg.sources.join(' · ')}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )))}

          {isProcessing && (
            <div className="flex flex-col items-start">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-xs text-slate-500 shadow-xs flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#134F9F] animate-spin shrink-0" />
                <span>{processingStatus || 'Processando raciocínio com modelo gerencial...'}</span>
              </div>
            </div>
          )}
          {messages.length > 1 && <div ref={messagesEndRef} />}
        </div>

        {/* SUGESTÕES RÁPIDAS (Exibidas durante o diálogo contínuo) */}
        {messages.length > 1 && (
          <div className="py-2 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 text-xs">
            <span className="text-slate-400 text-xs font-medium shrink-0">Sugestões:</span>
            {quickActions.map((action, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(action.prompt)}
                className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-slate-200/60 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors text-xs font-medium cursor-pointer"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* CAMPO DE ENTRADA DO CHAT */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative shrink-0 pt-1"
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ex: 'Gere meu Daily de hoje', 'Analise os 3 prioritários', 'Monte feedback para Mariana Costa'..."
              disabled={isProcessing}
              className="flex-1 text-sm px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
            />

            <button
              type="submit"
              disabled={!inputPrompt.trim() || isProcessing}
              className="px-5 py-3 bg-[#134F9F] hover:bg-blue-800 text-white rounded-lg transition-colors font-semibold text-sm flex items-center gap-2 shadow-xs disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
