/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Módulo Chamados GLPI
 * Apresentação em CARDS CONSOLIDADOS (sem scroll forçado, com paginação limpa)
 * Controles de densidade, personalização de campos e botão "Aumentar Visualização"
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  UserX, 
  Clock, 
  FileText, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Hospital,
  Sparkles
} from 'lucide-react';
import { Ticket, TicketStatus, GLPIPriority, AuthorshipType } from '../../types';
import { TicketStatusText, PriorityTag, ManagerialPriorityTag } from '../common/StatusTag';
import { DetailDrawer } from '../common/DetailDrawer';
import { Modal } from '../common/Modal';

interface TicketsViewProps {
  tickets: Ticket[];
  initialTicketId?: number | null;
  onClearInitialTicketId?: () => void;
}

export const TicketsView: React.FC<TicketsViewProps> = ({
  tickets,
  initialTicketId,
  onClearInitialTicketId
}) => {
  // Modo de exibição: 'cards' (padrão solicitado) vs 'tabela'
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  
  // Quantidade por página: 4 ou 6 (para garantir 0 scroll no 1440x900) ou 8
  const [pageSize, setPageSize] = useState<number>(6);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Estados de Filtros e Busca
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [filterNoNominalTech, setFilterNoNominalTech] = useState<boolean>(false);
  const [filterNoEvolution24h, setFilterNoEvolution24h] = useState<boolean>(false);

  // Personalização de campos visíveis nos Cards
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [cardFieldsConfig, setCardFieldsConfig] = useState({
    showLocation: true,
    showTech: true,
    showCategory: true,
    showLastAction: true,
    showEvidenceGap: true,
  });

  // Drawer de Detalhe Completo do Chamado (Nível 2 / 3)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(() => {
    if (initialTicketId) {
      return tickets.find(t => t.id === initialTicketId) || null;
    }
    return null;
  });

  // Modal para Aumentar Visualização Rápida de Card
  const [quickPreviewTicket, setQuickPreviewTicket] = useState<Ticket | null>(null);

  // Filtragem
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(query);
        const matchesId = t.id.toString().includes(query);
        const matchesTech = (t.technicianName || '').toLowerCase().includes(query);
        const matchesLocation = t.hospitalLocation.toLowerCase().includes(query);
        if (!matchesTitle && !matchesId && !matchesTech && !matchesLocation) return false;
      }
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && t.priorityGLPI !== priorityFilter) return false;
      if (groupFilter !== 'all' && t.groupName !== groupFilter) return false;
      if (filterNoNominalTech && t.hasNominalTech) return false;
      if (filterNoEvolution24h && !t.isWithoutEvolution24h) return false;
      return true;
    });
  }, [tickets, searchTerm, statusFilter, priorityFilter, groupFilter, filterNoNominalTech, filterNoEvolution24h]);

  // Paginação
  const totalPages = Math.ceil(filteredTickets.length / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedTickets = filteredTickets.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  const uniqueGroups = Array.from(new Set(tickets.map(t => t.groupName)));

  return (
    <div className="h-full flex flex-col p-2.5 sm:p-3.5 max-w-7xl w-full mx-auto lg:overflow-hidden overflow-y-auto gap-2">
      {/* BARRA UNIFICADA: FILTROS CRÍTICOS, BUSCA E CONTROLES (COMPACTA) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 shadow-xs shrink-0 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Filtros Rápidos de Exceção */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-slate-800 dark:text-slate-100 text-[11px]">
              Filtros Críticos:
            </span>
            <button
              type="button"
              onClick={() => {
                setFilterNoNominalTech(!filterNoNominalTech);
                setCurrentPage(1);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                filterNoNominalTech
                  ? 'bg-rose-500 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Sem Técnico ({tickets.filter(t => !t.hasNominalTech).length})
            </button>
            <button
              type="button"
              onClick={() => {
                setFilterNoEvolution24h(!filterNoEvolution24h);
                setCurrentPage(1);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                filterNoEvolution24h
                  ? 'bg-amber-500 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              &gt;24h sem Ação ({tickets.filter(t => t.isWithoutEvolution24h).length})
            </button>
          </div>

          {/* Controles de Densidade e Modo de Visualização */}
          <div className="flex items-center gap-2">
            {/* Seletor de visualização (Cards vs Tabela) */}
            <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-2 py-0.5 rounded text-[11px] flex items-center gap-1 transition-colors cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-slate-900 text-[#134F9F] dark:text-blue-400 font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Exibição em Cards (Sem scroll)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-2 py-0.5 rounded text-[11px] flex items-center gap-1 transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-900 text-[#134F9F] dark:text-blue-400 font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Exibição em Tabela Compacta"
              >
                <List className="w-3.5 h-3.5" />
                <span>Tabela</span>
              </button>
            </div>

            {/* Cards por página */}
            <div className="flex items-center gap-1 text-slate-500 text-[10px]">
              <span>Tela:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value={4}>4 cards</option>
                <option value={6}>6 cards (Sem scroll)</option>
                <option value={8}>8 cards</option>
              </select>
            </div>

            {/* Botão Personalizar */}
            <button
              type="button"
              onClick={() => setShowConfigModal(true)}
              className="p-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded transition-colors flex items-center gap-1 cursor-pointer"
              title="Editar quais dados aparecem nos cards"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span className="hidden sm:inline text-[10px]">Personalizar</span>
            </button>
          </div>
        </div>

        {/* Linha de Busca & Filtros Dropdown */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2" />
            <input
              type="text"
              placeholder="Buscar por número, título, setor ou técnico..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-[11px] pl-7 pr-2.5 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-[11px] px-1.5 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">Status: Todos</option>
            <option value="novo">Novo</option>
            <option value="em_atendimento">Em Atendimento</option>
            <option value="planejado">Planejado</option>
            <option value="pendente">Pendente</option>
            <option value="solucionado">Solucionado</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-[11px] px-1.5 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">Prioridade: Todas</option>
            <option value="muito_alta">Muito Alta</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>

          <select
            value={groupFilter}
            onChange={(e) => {
              setGroupFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-[11px] px-1.5 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">Grupo: Todos</option>
            {uniqueGroups.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || groupFilter !== 'all' || filterNoNominalTech || filterNoEvolution24h) && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPriorityFilter('all');
                setGroupFilter('all');
                setFilterNoNominalTech(false);
                setFilterNoEvolution24h(false);
                setCurrentPage(1);
              }}
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline px-1 cursor-pointer"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* APRESENTAÇÃO EM CARDS CONSOLIDADOS (3x2 SEM SCROLL NO DESKTOP, RESPONSIVO EM TABLET/CELULAR) */}
      {viewMode === 'cards' ? (
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 content-start overflow-y-auto lg:overflow-hidden">
          {paginatedTickets.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
              Nenhum chamado encontrado para os filtros selecionados.
            </div>
          ) : (
            paginatedTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 flex flex-col justify-between hover:border-blue-500/60 cursor-pointer transition-all group shadow-xs hover:shadow-sm"
              >
                <div>
                  {/* Linha 1 do Card: Número, Status e Prioridade */}
                  <div className="flex items-center justify-between gap-1.5 mb-1.5 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-[#134F9F] dark:text-blue-400">
                        #{ticket.id}
                      </span>
                      <TicketStatusText status={ticket.status} />
                    </div>

                    <div className="flex items-center gap-1">
                      <ManagerialPriorityTag priority={ticket.suggestedPriority} />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuickPreviewTicket(ticket);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                        title="Aumentar Visualização do Chamado"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Linha 2 do Card: Título */}
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#134F9F] dark:group-hover:text-blue-400 transition-colors line-clamp-1 leading-snug">
                    {ticket.title}
                  </h3>

                  {/* Informações Customizáveis */}
                  <div className="mt-1.5 space-y-1 text-[11px]">
                    {cardFieldsConfig.showLocation && (
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <Hospital className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{ticket.hospitalLocation}</span>
                      </div>
                    )}

                    {cardFieldsConfig.showTech && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Técnico:</span>
                        {ticket.technicianName ? (
                          <strong className="text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
                            {ticket.technicianName}
                          </strong>
                        ) : (
                          <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1 text-[10px]">
                            <UserX className="w-3 h-3" />
                            Sem Técnico Nominal
                          </span>
                        )}
                      </div>
                    )}

                    {cardFieldsConfig.showLastAction && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Última ação:</span>
                        <span className="font-mono text-slate-700 dark:text-slate-300">
                          {ticket.lastHumanActionDate.slice(5, 16).replace('T', ' ')}
                        </span>
                      </div>
                    )}

                    {ticket.isWithoutEvolution24h && (
                      <div className="p-1 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span>Alerta POP: &gt; 24h sem ação documentada</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rodapé do Card */}
                <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Prioridade GLPI: {ticket.priorityGLPI}
                  </span>

                  <span className="text-xs font-semibold text-[#134F9F] dark:text-blue-400 group-hover:underline flex items-center gap-1">
                    <span>Ver Evidências</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* MODO TABELA COMPACTA (ALTERNATIVO) */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs flex-1 min-h-0">
          <div className="overflow-x-auto h-full">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Nº GLPI</th>
                  <th className="py-2.5 px-3">Título & Setor</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Sugestão Gerencial</th>
                  <th className="py-2.5 px-3">Responsável</th>
                  <th className="py-2.5 px-3">Última Ação</th>
                  <th className="py-2.5 px-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-[#134F9F] dark:text-blue-400">
                      #{ticket.id}
                    </td>
                    <td className="py-2.5 px-3 max-w-xs">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600">
                        {ticket.title}
                      </p>
                      <span className="text-[10px] text-slate-400">{ticket.hospitalLocation}</span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <TicketStatusText status={ticket.status} />
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <ManagerialPriorityTag priority={ticket.suggestedPriority} />
                    </td>
                    <td className="py-2.5 px-3">
                      {ticket.technicianName ? (
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{ticket.technicianName}</span>
                      ) : (
                        <span className="text-rose-600 font-bold text-[11px]">Sem Técnico</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                      {ticket.lastHumanActionDate.slice(5, 16).replace('T', ' ')}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTicket(ticket);
                        }}
                        className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                      >
                        Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BARRA DE PAGINAÇÃO CONECTADA (SEM SCROLL) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 flex items-center justify-between text-xs text-slate-500 shadow-xs shrink-0">
        <div>
          Mostrando <strong className="text-slate-900 dark:text-slate-100 font-mono">{paginatedTickets.length}</strong> de <strong className="font-mono">{filteredTickets.length}</strong> chamados
          <span className="hidden sm:inline text-slate-400"> · Visualização compacta sem scroll vertical</span>
        </div>

        <div className="flex items-center gap-3">
          <span>
            Página <strong className="text-slate-900 dark:text-slate-100 font-mono">{safeCurrentPage}</strong> de <strong className="font-mono">{totalPages}</strong>
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="px-2 py-1 rounded border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>
            <button
              type="button"
              disabled={safeCurrentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Próxima</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL PARA PERSONALIZAR CAMPOS DOS CARDS */}
      <Modal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        title="Personalizar Exibição dos Cards de Chamados"
        subtitle="Escolha quais atributos operacionais devem ficar visíveis no primeiro nível"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300">
            Ajuste os dados exibidos nos cartões para manter a visão limpa e otimizada para tomada de decisão sem rolagem:
          </p>

          <div className="space-y-2.5">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={cardFieldsConfig.showLocation}
                onChange={(e) => setCardFieldsConfig({ ...cardFieldsConfig, showLocation: e.target.checked })}
                className="rounded border-slate-300 text-[#134F9F] focus:ring-0"
              />
              <span className="font-medium text-slate-800 dark:text-slate-200">Exibir Setor Hospitalar / Localização</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={cardFieldsConfig.showTech}
                onChange={(e) => setCardFieldsConfig({ ...cardFieldsConfig, showTech: e.target.checked })}
                className="rounded border-slate-300 text-[#134F9F] focus:ring-0"
              />
              <span className="font-medium text-slate-800 dark:text-slate-200">Exibir Responsável Técnico Nominal / Alerta de Ausência</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={cardFieldsConfig.showLastAction}
                onChange={(e) => setCardFieldsConfig({ ...cardFieldsConfig, showLastAction: e.target.checked })}
                className="rounded border-slate-300 text-[#134F9F] focus:ring-0"
              />
              <span className="font-medium text-slate-800 dark:text-slate-200">Exibir Horário da Última Ação Humana</span>
            </label>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={() => setShowConfigModal(false)}
              className="px-4 py-2 font-semibold text-white bg-[#134F9F] hover:bg-blue-800 rounded-md text-xs cursor-pointer"
            >
              Aplicar Preferências
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL DE AUMENTAR VISUALIZAÇÃO RÁPIDA DE UM CARD */}
      {quickPreviewTicket && (
        <Modal
          isOpen={true}
          onClose={() => setQuickPreviewTicket(null)}
          title={`Visualização Ampliada — Chamado #${quickPreviewTicket.id}`}
          subtitle={quickPreviewTicket.hospitalLocation}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
              <div className="flex items-center gap-2 mb-1.5">
                <TicketStatusText status={quickPreviewTicket.status} />
                <ManagerialPriorityTag priority={quickPreviewTicket.suggestedPriority} />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {quickPreviewTicket.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {quickPreviewTicket.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Técnico Atribuído</span>
                <strong className="text-slate-800 dark:text-slate-200">{quickPreviewTicket.technicianName || 'Sem técnico'}</strong>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Última Ação Humana</span>
                <strong className="text-slate-800 dark:text-slate-200 font-mono">{quickPreviewTicket.lastHumanActionDate}</strong>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setQuickPreviewTicket(null)}
                className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  const t = quickPreviewTicket;
                  setQuickPreviewTicket(null);
                  setSelectedTicket(t);
                }}
                className="px-3.5 py-1.5 text-white bg-[#134F9F] hover:bg-blue-800 font-semibold rounded cursor-pointer"
              >
                Abrir Gaveta de Evidências Completa
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* DRAWER DE DETALHES COMPLETOS (NÍVEL 3) */}
      {selectedTicket && (
        <DetailDrawer
          isOpen={true}
          onClose={() => {
            setSelectedTicket(null);
            if (onClearInitialTicketId) onClearInitialTicketId();
          }}
          title={`Chamado GLPI #${selectedTicket.id}`}
          subtitle={`${selectedTicket.hospitalLocation} · Aberto em ${selectedTicket.dateCreation.slice(0, 10)}`}
          badge={<TicketStatusText status={selectedTicket.status} />}
          footerActions={
            <>
              <a
                href={`#glpi-direct-${selectedTicket.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Redirecionando para GLPI oficial: ticket_id=${selectedTicket.id} (somente-leitura)`);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded font-medium"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir no GLPI Oficial</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setSelectedTicket(null);
                  if (onClearInitialTicketId) onClearInitialTicketId();
                }}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-[#134F9F] hover:bg-blue-800 rounded cursor-pointer"
              >
                Concluir Visualização
              </button>
            </>
          }
        >
          <div className="space-y-4">
            {/* Título e Prioridades */}
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {selectedTicket.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedTicket.description}
              </p>
            </div>

            {/* Grid de Atributos Críticos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 text-[10px] block">Prioridade GLPI</span>
                <span className="font-semibold capitalize text-slate-800 dark:text-slate-200">{selectedTicket.priorityGLPI}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 text-[10px] block">Sugestão Gerencial</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400">{selectedTicket.suggestedPriority}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 text-[10px] block">Técnico Nominal</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedTicket.technicianName || 'NÃO ATRIBUÍDO'}
                </span>
              </div>
            </div>

            {/* Aviso de Auditoria sobre date_mod */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded text-xs text-amber-800 dark:text-amber-300">
              <strong>Regra de Auditoria POP-TIN-017:</strong> A data técnica <code>date_mod</code> ({selectedTicket.dateMod.slice(11, 16)}) não é prova isolada de ação humana. Última ação humana comprovada registrada em <strong>{selectedTicket.lastHumanActionDate.slice(11, 16)}</strong>.
            </div>

            {/* Tarefas Operacionais */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Tarefas do Chamado ({selectedTicket.tasks.length})
              </h4>
              {selectedTicket.tasks.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Nenhuma subtarefa formal cadastrada no GLPI.</p>
              ) : (
                <div className="space-y-1.5">
                  {selectedTicket.tasks.map(task => (
                    <div key={task.id} className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${task.status === 'concluida' ? 'text-emerald-500' : 'text-slate-400'}`} />
                        <span className="text-slate-800 dark:text-slate-200">{task.description}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">{task.assignedTo}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Linha do Tempo com Classificação de Autoria */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Linha do Tempo com Classificação de Autoria
              </h4>
              <div className="space-y-2.5 border-l-2 border-slate-200 dark:border-slate-800 pl-3">
                {selectedTicket.followups.map(f => (
                  <div key={f.id} className="text-xs space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <strong className="text-slate-900 dark:text-slate-100">{f.authorName}</strong>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        f.authorType === 'humana'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : f.authorType === 'automacao'
                            ? 'bg-blue-500/15 text-blue-400'
                            : 'bg-slate-700 text-slate-300'
                      }`}>
                        Autoria: {f.authorType}
                      </span>
                      <span className="text-slate-500 font-mono text-[10px]">{f.date}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 p-2 rounded border border-slate-100 dark:border-slate-800">
                      {f.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Lacunas de Evidência */}
            {selectedTicket.evidenceGaps.length > 0 && (
              <div className="p-3 rounded bg-rose-500/10 border border-rose-500/20 text-xs text-rose-700 dark:text-rose-300">
                <span className="font-bold block mb-1">Lacunas de Evidência Detectadas:</span>
                <ul className="list-disc pl-4 space-y-0.5">
                  {selectedTicket.evidenceGaps.map((gap, i) => (
                    <li key={i}>{gap}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </DetailDrawer>
      )}
    </div>
  );
};
