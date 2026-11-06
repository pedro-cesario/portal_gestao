/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Visão Geral (Central de Comando)
 * 100% CONSOLIDADA EM CARDS SEM SCROLL NO VIEWPORT 1440x900
 * Aumentar Visualização individual em cada Card + Personalizar quais Cards aparecem
 */

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  UserX, 
  Activity, 
  Server, 
  Layers, 
  FileText, 
  Sparkles, 
  Info, 
  Calendar, 
  ExternalLink,
  Maximize2,
  SlidersHorizontal,
  Users,
  ShieldCheck
} from 'lucide-react';
import { Ticket, AuditSnapshot, EvidenceLevel } from '../../types';
import { SyntheticMetricCard } from '../common/SyntheticMetricCard';
import { EvidenceBadge } from '../common/EvidenceBadge';
import { DetailDrawer } from '../common/DetailDrawer';
import { Modal } from '../common/Modal';
import { TicketStatusText, ManagerialPriorityTag } from '../common/StatusTag';

interface OverviewViewProps {
  tickets: Ticket[];
  latestAudit: AuditSnapshot;
  onNavigateToTicket: (ticketId: number) => void;
  onNavigateToRoute: (route: any) => void;
  dataSource: 'REALTIME' | 'SNAPSHOT_04H';
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  tickets,
  latestAudit,
  onNavigateToTicket,
  onNavigateToRoute,
  dataSource
}) => {
  // Estados para Nível 2 e Modal Ampliado
  const [selectedKpiDrilldown, setSelectedKpiDrilldown] = useState<string | null>(null);
  const [selectedRiskTicket, setSelectedRiskTicket] = useState<Ticket | null>(null);
  const [showFormulaModal, setShowFormulaModal] = useState<boolean>(false);
  const [maximizedCard, setMaximizedCard] = useState<'priorities' | 'health' | 'team' | null>(null);

  // Personalização de quais Cards aparecem na Visão Geral
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [visibleWidgets, setVisibleWidgets] = useState({
    showKpis: true,
    showPriorities: true,
    showHealth: true,
    showTeam: true
  });

  // Cálculos sintéticos
  const openTickets = tickets.filter(t => t.status !== 'fechado' && t.status !== 'solucionado');
  const unassignedTickets = tickets.filter(t => !t.hasNominalTech && t.status !== 'fechado' && t.status !== 'solucionado');
  const noEvolution24hTickets = tickets.filter(t => t.isWithoutEvolution24h && t.status !== 'fechado' && t.status !== 'solucionado');
  const inProgressTickets = tickets.filter(t => t.status === 'em_atendimento');
  const newTickets = tickets.filter(t => t.status === 'novo');
  const solvedCount = 80;

  // As 3 Prioridades Operacionais Imediatas (Mandatório: até 3 prioridades na síntese)
  const top3Priorities = tickets
    .filter(t => t.suggestedPriority === 'P1_CRITICA' || t.isWithoutEvolution24h || !t.hasNominalTech)
    .slice(0, 3);

  return (
    <div className="p-2.5 sm:p-4 max-w-7xl w-full mx-auto space-y-3">
      {/* BARRA SUPERIOR: CONEXÃO GLPI & PERSONALIZAR CARDS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-600 dark:text-slate-300 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <Server className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            <strong className="text-slate-900 dark:text-white">Conexão GLPI:</strong> Réplica somente-leitura ativa · Fonte: <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{dataSource}</span>
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-slate-500 dark:text-slate-400">
            Último snapshot 04h: <strong className="text-slate-800 dark:text-slate-200">04:00 (Brasília)</strong>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowFormulaModal(true)}
            className="inline-flex items-center gap-1 text-[11px] text-[#134F9F] dark:text-blue-400 hover:underline font-medium cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Regra de Tempo Médio</span>
          </button>

          <button
            type="button"
            onClick={() => setShowConfigModal(true)}
            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Personalizar Cards</span>
          </button>
        </div>
      </div>

      {/* GRID DE 6 KPIS ESSENCIAIS EM CARDS */}
      {visibleWidgets.showKpis && (
        <section aria-label="KPIs Operacionais Essenciais">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
            <SyntheticMetricCard
              label="Chamados Abertos"
              value={openTickets.length}
              subtext="Backlog ativo em atendimento"
              trend={{ value: "+2 hoje", isPositive: false }}
              onClickDetail={() => setSelectedKpiDrilldown('abertos')}
              ctaText="Ver lista"
            />

            <SyntheticMetricCard
              label="Novos / Em Andamento"
              value={`${newTickets.length} / ${inProgressTickets.length}`}
              subtext="4 aguardando triagem"
              alertLevel="info"
              onClickDetail={() => setSelectedKpiDrilldown('novos')}
              ctaText="Detalhar"
            />

            <SyntheticMetricCard
              label="Sem Técnico Nominal"
              value={unassignedTickets.length}
              subtext="Apenas grupo atribuído"
              alertLevel={unassignedTickets.length > 0 ? "critical" : "none"}
              onClickDetail={() => setSelectedKpiDrilldown('sem_tecnico')}
              ctaText="Atribuir"
            />

            <SyntheticMetricCard
              label="Sem Evolução 24h"
              value={noEvolution24hTickets.length}
              subtext="Limiar POP-TIN-017"
              alertLevel={noEvolution24hTickets.length > 0 ? "warning" : "none"}
              onClickDetail={() => setSelectedKpiDrilldown('sem_evolucao')}
              ctaText="Auditar"
            />

            <SyntheticMetricCard
              label="Solucionados (7d)"
              value={solvedCount}
              subtext="Com evidência comprovada"
              trend={{ value: "98% conformidade", isPositive: true }}
              onClickDetail={() => setSelectedKpiDrilldown('solucionados')}
              ctaText="Histórico"
            />

            <SyntheticMetricCard
              label="Tempo Médio Obs."
              value="18.2h"
              subtext="Abertura a solução"
              formulaExplanation="Fórmula: Σ(Data Solução - Data Abertura) / Total Concluídos no período de 7 dias. Não equivale a SLA ou MTTR."
              onClickDetail={() => setShowFormulaModal(true)}
              ctaText="Fórmula"
            />
          </div>
        </section>
      )}

      {/* SEÇÃO PRINCIPAL DE DADOS CONSOLIDADOS EM CARDS (SEM SCROLL) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* CARD 1: AS 3 PRIORIDADES OPERACIONAIS DO PLANTÃO */}
        {visibleWidgets.showPriorities && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 flex flex-col justify-between shadow-xs hover:border-blue-500/50 transition-colors">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    As 3 Prioridades do Plantão
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setMaximizedCard('priorities')}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer"
                  title="Aumentar Visualização das Prioridades"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Lista dos 3 itens em formato micro-card compacto */}
              <div className="space-y-2">
                {top3Priorities.map((ticket, idx) => (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedRiskTicket(ticket)}
                    className="p-2 rounded bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/60 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-mono text-[11px] font-bold text-[#134F9F] dark:text-blue-400">
                        #{ticket.id}
                      </span>
                      <ManagerialPriorityTag priority={ticket.suggestedPriority} />
                    </div>
                    <p className="text-[11px] font-semibold text-slate-900 dark:text-slate-200 group-hover:text-blue-600 line-clamp-1">
                      {ticket.title}
                    </p>
                    <div className="text-[10px] text-slate-400 flex justify-between mt-1">
                      <span className="truncate">{ticket.hospitalLocation}</span>
                      <span>Resp: {ticket.technicianName?.split(' ')[0] || 'Sem técnico'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400">POP-TIN-017 Vigente</span>
              <button
                type="button"
                onClick={() => onNavigateToRoute('chamados')}
                className="font-semibold text-[#134F9F] dark:text-blue-400 hover:underline"
              >
                Ver todos os chamados →
              </button>
            </div>
          </div>
        )}

        {/* CARD 2: SAÚDE OPERACIONAL & SNAPSHOT 04H */}
        {visibleWidgets.showHealth && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 flex flex-col justify-between shadow-xs hover:border-blue-500/50 transition-colors">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#134F9F] dark:text-blue-400 shrink-0" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    Saúde & Snapshot 04h
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setMaximizedCard('health')}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer"
                  title="Aumentar Visualização da Auditoria"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Informações de Saúde Consolidada */}
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                  <div className="flex justify-between items-center text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                    <span>Conformidade Documental</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">88.5%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '88.5%' }} />
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Novas pendências no 04h:</span>
                    <span className="font-mono font-bold text-amber-500">+{latestAudit.newPendingsCount}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Persistentes (&gt;24h sem ação):</span>
                    <span className="font-mono font-bold text-rose-500">{latestAudit.persistentPendingsCount}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">Resolvidas com comprovação:</span>
                    <span className="font-mono font-bold text-emerald-500">{latestAudit.resolvedWithEvidenceCount}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => onNavigateToRoute('auditorias')}
                className="text-[#134F9F] dark:text-blue-400 font-semibold hover:underline"
              >
                Ver Auditoria das 04h →
              </button>

              <button
                type="button"
                onClick={() => onNavigateToRoute('agente-gerencial')}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:text-[#134F9F]"
              >
                <Sparkles className="w-3 h-3 text-[#134F9F]" />
                <span>Gerar Daily</span>
              </button>
            </div>
          </div>
        )}

        {/* CARD 3: CAPACIDADE E DISTRIBUIÇÃO DA EQUIPE */}
        {visibleWidgets.showTeam && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 flex flex-col justify-between shadow-xs hover:border-blue-500/50 transition-colors">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-500 shrink-0" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    Capacidade da Equipe
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setMaximizedCard('team')}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer"
                  title="Aumentar Visualização da Equipe"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Indicadores Consolidados da Equipe */}
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Técnicos Ativos</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">5 operacionais</span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Carga Média</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">6.6 chamados</span>
                  </div>
                </div>

                <div className="p-2 rounded bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 text-[10px] text-blue-900 dark:text-blue-300">
                  <strong>Grupo 48 Gestão:</strong> 2 membros dedicados a processos e auditoria, excluídos de rankings operacionais.
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[10px]">Carga balanceada</span>
              <button
                type="button"
                onClick={() => onNavigateToRoute('equipe')}
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Ver carteiras completas →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE PERSONALIZAR CARDS DA VISÃO GERAL */}
      <Modal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        title="Personalizar Cards da Visão Geral"
        subtitle="Escolha quais blocos consolidados devem permanecer visíveis no seu dashboard sem rolagem"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300">
            Ative ou desative os cartões consolidados para manter o painel executivo perfeitamente contido na sua tela de trabalho:
          </p>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-2.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Faixa Superior: 6 KPIs Essenciais</span>
              <input
                type="checkbox"
                checked={visibleWidgets.showKpis}
                onChange={(e) => setVisibleWidgets({ ...visibleWidgets, showKpis: e.target.checked })}
                className="rounded border-slate-300 text-[#134F9F] focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Card 1: As 3 Prioridades do Plantão</span>
              <input
                type="checkbox"
                checked={visibleWidgets.showPriorities}
                onChange={(e) => setVisibleWidgets({ ...visibleWidgets, showPriorities: e.target.checked })}
                className="rounded border-slate-300 text-[#134F9F] focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Card 2: Saúde Operacional & Snapshot 04h</span>
              <input
                type="checkbox"
                checked={visibleWidgets.showHealth}
                onChange={(e) => setVisibleWidgets({ ...visibleWidgets, showHealth: e.target.checked })}
                className="rounded border-slate-300 text-[#134F9F] focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Card 3: Capacidade da Equipe & Carteiras</span>
              <input
                type="checkbox"
                checked={visibleWidgets.showTeam}
                onChange={(e) => setVisibleWidgets({ ...visibleWidgets, showTeam: e.target.checked })}
                className="rounded border-slate-300 text-[#134F9F] focus:ring-0"
              />
            </label>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={() => setShowConfigModal(false)}
              className="px-4 py-2 font-semibold text-white bg-[#134F9F] hover:bg-blue-800 rounded-md text-xs cursor-pointer"
            >
              Salvar Layout
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL DE AUMENTAR VISUALIZAÇÃO DE UM CARD DA VISÃO GERAL */}
      {maximizedCard && (
        <Modal
          isOpen={true}
          onClose={() => setMaximizedCard(null)}
          title={
            maximizedCard === 'priorities' ? 'Visualização Ampliada: As 3 Prioridades Operacionais' :
            maximizedCard === 'health' ? 'Visualização Ampliada: Saúde Operacional e Snapshot Noturno 04h' :
            'Visualização Ampliada: Capacidade e Distribuição da Equipe Técnica'
          }
          subtitle="Visão aprofundada com histórico, evidências e ações imediatas"
        >
          <div className="space-y-4 text-xs">
            {maximizedCard === 'priorities' && (
              <div className="space-y-3">
                {top3Priorities.map((ticket, idx) => (
                  <div key={ticket.id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#134F9F] dark:text-blue-400">#{ticket.id}</span>
                        <ManagerialPriorityTag priority={ticket.suggestedPriority} />
                        <span className="text-slate-400">· {ticket.hospitalLocation}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setMaximizedCard(null);
                          onNavigateToTicket(ticket.id);
                        }}
                        className="text-xs font-semibold text-[#134F9F] dark:text-blue-400 hover:underline"
                      >
                        Abrir Chamado →
                      </button>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100">{ticket.title}</h4>
                    <p className="text-slate-600 dark:text-slate-300">{ticket.description}</p>
                    <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800 flex justify-between">
                      <span>Responsável: <strong>{ticket.technicianName || 'NÃO ATRIBUÍDO'}</strong></span>
                      <span>Última Ação Humana: {ticket.lastHumanActionDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {maximizedCard === 'health' && (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Trilha do Snapshot Noturno Oficial</h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                    Coleta realizada às 04h00 através da réplica segura do MariaDB GLPI. Avaliados 142 chamados ativos com base nas regras POP-TIN-017 e POP-TIN-008.
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Novas</span>
                      <strong className="text-amber-500 font-mono text-base">+{latestAudit.newPendingsCount}</strong>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Persistentes</span>
                      <strong className="text-rose-500 font-mono text-base">{latestAudit.persistentPendingsCount}</strong>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Resolvidas com Evidência</span>
                      <strong className="text-emerald-500 font-mono text-base">{latestAudit.resolvedWithEvidenceCount}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {maximizedCard === 'team' && (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Distribuição das Carteiras Operacionais</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 rounded bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <span>Mariana Costa (Sistemas Hospitalares)</span>
                      <strong className="font-mono">7 chamados (1 s/ evolução)</strong>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <span>Carlos Eduardo Ramos (Redes & Infra)</span>
                      <strong className="font-mono">9 chamados (2 s/ evolução)</strong>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <span>Rafael Albuquerque (Suporte UTI/CC)</span>
                      <strong className="font-mono">5 chamados (0 s/ evolução)</strong>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <span>Lucas Mendes (Suporte Assistencial PA)</span>
                      <strong className="font-mono">8 chamados (3 s/ evolução)</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setMaximizedCard(null)}
                className="px-4 py-1.5 text-white bg-[#134F9F] hover:bg-blue-800 rounded font-semibold text-xs cursor-pointer"
              >
                Fechar Visualização
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* DRAWER DE DRILLDOWN ANALÍTICO DE KPI SELECIONADO */}
      <DetailDrawer
        isOpen={selectedKpiDrilldown !== null}
        onClose={() => setSelectedKpiDrilldown(null)}
        title={
          selectedKpiDrilldown === 'sem_tecnico' ? 'Chamados sem Técnico Nominal Atribuído' :
          selectedKpiDrilldown === 'sem_evolucao' ? 'Chamados sem Evolução Observável em 24 Horas' :
          selectedKpiDrilldown === 'abertos' ? 'Backlog Ativo de Chamados Abertos' :
          selectedKpiDrilldown === 'novos' ? 'Chamados Novos e em Atendimento Inicial' :
          'Chamados Solucionados com Validação de Evidência'
        }
        subtitle="Detalhamento operacional com histórico, responsáveis e evidências anexadas"
      >
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-lg text-xs text-blue-900 dark:text-blue-300">
            <strong>Critério de Auditoria:</strong> Nunca interpretar <code>date_mod</code> isoladamente como ação humana. Apenas apontamentos de técnicos com relato factual contam para evolução.
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {tickets
              .filter(t => {
                if (selectedKpiDrilldown === 'sem_tecnico') return !t.hasNominalTech;
                if (selectedKpiDrilldown === 'sem_evolucao') return t.isWithoutEvolution24h;
                if (selectedKpiDrilldown === 'novos') return t.status === 'novo' || t.status === 'em_atendimento';
                if (selectedKpiDrilldown === 'solucionados') return t.status === 'solucionado';
                return t.status !== 'fechado';
              })
              .map(ticket => (
                <div key={ticket.id} className="py-3 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#134F9F] dark:text-blue-400">
                        #{ticket.id}
                      </span>
                      <TicketStatusText status={ticket.status} />
                      <ManagerialPriorityTag priority={ticket.suggestedPriority} />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedKpiDrilldown(null);
                        onNavigateToTicket(ticket.id);
                      }}
                      className="text-xs font-semibold text-[#134F9F] dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Abrir chamado</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {ticket.title}
                  </p>

                  <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>Setor: <strong className="text-slate-700 dark:text-slate-300">{ticket.hospitalLocation}</strong></span>
                    <span>Técnico: <strong className="text-slate-700 dark:text-slate-300">{ticket.technicianName || 'Sem técnico atribuído'}</strong></span>
                    <span>Grupo: {ticket.groupName}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </DetailDrawer>

      {/* DRAWER DE DETALHES DE RISCO OPERACIONAL */}
      {selectedRiskTicket && (
        <DetailDrawer
          isOpen={true}
          onClose={() => setSelectedRiskTicket(null)}
          title={`Chamado #${selectedRiskTicket.id} — Detalhamento de Prioridade`}
          subtitle={selectedRiskTicket.hospitalLocation}
          badge={<ManagerialPriorityTag priority={selectedRiskTicket.suggestedPriority} />}
          footerActions={
            <>
              <button
                type="button"
                onClick={() => setSelectedRiskTicket(null)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
              >
                Voltar à Síntese
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = selectedRiskTicket.id;
                  setSelectedRiskTicket(null);
                  onNavigateToTicket(id);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#134F9F] hover:bg-blue-800 rounded"
              >
                Ver no Módulo Chamados
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Descrição do Chamado
              </h3>
              <p className="text-xs text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 p-3 rounded border border-slate-200 dark:border-slate-800">
                {selectedRiskTicket.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 text-[11px]">Prioridade GLPI Oficial</span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 uppercase mt-0.5">
                  {selectedRiskTicket.priorityGLPI}
                </p>
              </div>
              <div className="p-3 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 text-[11px]">Sugestão Gerencial TI</span>
                <p className="font-semibold text-rose-600 dark:text-rose-400 uppercase mt-0.5">
                  {selectedRiskTicket.suggestedPriority} (Urgência Clínica)
                </p>
              </div>
            </div>

            {selectedRiskTicket.evidenceGaps.length > 0 && (
              <div className="p-3 rounded bg-rose-500/10 border border-rose-500/20 text-xs text-rose-700 dark:text-rose-300">
                <strong>Lacunas de Evidência Identificadas:</strong>
                <ul className="list-disc pl-4 mt-1 space-y-0.5">
                  {selectedRiskTicket.evidenceGaps.map((gap, i) => (
                    <li key={i}>{gap}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </DetailDrawer>
      )}

      {/* MODAL DE EXPLICAÇÃO DA FÓRMULA DE TEMPO OBSERVADO */}
      <Modal
        isOpen={showFormulaModal}
        onClose={() => setShowFormulaModal(false)}
        title="Critério Conceitual: Tempo Médio Observado de Abertura a Solução"
        subtitle="Diretriz mandatória de governança da TI do Instituto HEAL"
      >
        <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded text-amber-800 dark:text-amber-300">
            <strong>Aviso de Governança:</strong> Nenhuma métrica de SLA é presumida neste portal. O Tempo Médio Observado <strong>não é SLA nem MTTR contratual</strong>.
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">
              Fórmula de Cálculo
            </h4>
            <div className="p-3 bg-slate-100 dark:bg-slate-950 font-mono text-xs rounded border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
              Tempo Médio = Σ(Data Solução - Data Abertura em horas) / N (Total de Chamados Solucionados no Período de 7 dias)
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
