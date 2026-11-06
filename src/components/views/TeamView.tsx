/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Módulo Equipe Técnica & Carteiras
 * Nível 1: Visão sintética da capacidade e desequilíbrios em CARDS SEM SCROLL
 * Paginação conectada e tabs de governança (Operacional vs Grupo 48 Gestão)
 */

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Info, 
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Clock,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Technician, Ticket } from '../../types';
import { DetailDrawer } from '../common/DetailDrawer';
import { Modal } from '../common/Modal';

interface TeamViewProps {
  technicians: Technician[];
  tickets: Ticket[];
  onOpenAgenteForFeedback: (techName: string) => void;
}

export const TeamView: React.FC<TeamViewProps> = ({
  technicians,
  tickets,
  onOpenAgenteForFeedback
}) => {
  const [selectedTech, setSelectedTech] = useState<Technician | null>(null);
  const [quickPreviewTech, setQuickPreviewTech] = useState<Technician | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [groupFilter, setGroupFilter] = useState<'all' | 'operational' | 'management'>('operational');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6; // 6 cards para garantia de zero scroll na tela 1440x900

  const [feedbackDraft, setFeedbackDraft] = useState<{ positive: string; improvement: string; agreement: string }>({
    positive: '',
    improvement: '',
    agreement: ''
  });
  const [savedFeedbackNotice, setSavedFeedbackNotice] = useState<string | null>(null);

  // Separar técnicos operacionais do Grupo 48 Gestão
  const operationalTechnicians = technicians.filter(t => !t.isManagementGroup);
  const managementTechnicians = technicians.filter(t => t.isManagementGroup);

  // Totais consolidados operacionais
  const totalActive = operationalTechnicians.reduce((acc, t) => acc + t.activeTicketsCount, 0);
  const totalStalled = operationalTechnicians.reduce((acc, t) => acc + t.ticketsWithoutEvolution24hCount, 0);

  // Filtragem da lista
  const filteredTechnicians = useMemo(() => {
    if (groupFilter === 'operational') return operationalTechnicians;
    if (groupFilter === 'management') return managementTechnicians;
    return technicians;
  }, [technicians, operationalTechnicians, managementTechnicians, groupFilter]);

  // Paginação
  const totalPages = Math.ceil(filteredTechnicians.length / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedTechnicians = filteredTechnicians.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  const handleOpenFeedback = (tech: Technician) => {
    setSelectedTech(tech);
    setFeedbackDraft({
      positive: `Demonstrou agilidade na resolução de chamados assistenciais críticos e boa relação com a equipe assistencial.`,
      improvement: `Necessário registrar atualizações intermediárias no GLPI antes das 17h para manter conformidade no snapshot noturno das 04h.`,
      agreement: `Combinado de alinhar os 3 chamados prioritários do plantão diariamente às 08h30.`
    });
    setShowFeedbackModal(true);
  };

  const handleSaveFeedback = () => {
    setSavedFeedbackNotice(`Feedback fundamentado para ${selectedTech?.name} salvo com sucesso no dossiê.`);
    setShowFeedbackModal(false);
    setTimeout(() => setSavedFeedbackNotice(null), 4000);
  };

  return (
    <div className="h-full flex flex-col p-2.5 sm:p-3.5 max-w-7xl w-full mx-auto lg:overflow-hidden overflow-y-auto gap-2">
      {/* NÍVEL 1 SINTÉTICO: BANNER DE CAPACIDADE & AVISO GRUPO 48 (COMPACTO) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 shadow-xs shrink-0 space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#134F9F] dark:text-blue-400 shrink-0" />
            <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Panorama de Capacidade e Carteiras da Equipe
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">
              · Carga: <strong className="text-slate-800 dark:text-slate-200">{totalActive} ativos</strong> · &gt;24h s/ ação: <strong className="text-amber-500">{totalStalled}</strong>
            </span>
          </div>

          {/* Seletor Segmentado de Visualização */}
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-xs">
            <button
              type="button"
              onClick={() => {
                setGroupFilter('operational');
                setCurrentPage(1);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                groupFilter === 'operational'
                  ? 'bg-white dark:bg-slate-900 text-[#134F9F] dark:text-blue-400 font-bold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Operacional ({operationalTechnicians.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setGroupFilter('management');
                setCurrentPage(1);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                groupFilter === 'management'
                  ? 'bg-white dark:bg-slate-900 text-[#134F9F] dark:text-blue-400 font-bold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Grupo 48 Gestão ({managementTechnicians.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setGroupFilter('all');
                setCurrentPage(1);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                groupFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-[#134F9F] dark:text-blue-400 font-bold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Todos ({technicians.length})
            </button>
          </div>
        </div>

        {/* Nota Explicativa Obrigatória sobre Grupo 48 Gestão */}
        <div className="flex items-center gap-2 px-2 py-1 rounded bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-[11px] text-blue-950 dark:text-blue-300">
          <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
          <p className="truncate">
            <strong>Regra Institucional:</strong> Membros do <strong>Grupo 48 Gestão</strong> constam para transparência, mas estão <em>estritamente excluídos dos rankings operacionais</em>.
          </p>
        </div>
      </div>

      {savedFeedbackNotice && (
        <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded text-xs flex items-center gap-2 shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{savedFeedbackNotice}</span>
        </div>
      )}

      {/* GRADE DE CARDS DOS TÉCNICOS (2x3 SEM SCROLL NO DESKTOP, RESPONSIVO EM TABLET/CELULAR) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 content-start overflow-y-auto lg:overflow-hidden">
        {paginatedTechnicians.map(tech => (
          <div
            key={tech.id}
            className={`bg-white dark:bg-slate-900 border rounded-lg p-3 flex flex-col justify-between hover:border-blue-500/60 transition-all shadow-xs group ${
              tech.isManagementGroup ? 'border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40' : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div>
              {/* Cabeçalho do Card */}
              <div className="flex items-start justify-between gap-2 mb-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center font-mono shrink-0 ${
                    tech.isManagementGroup 
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300' 
                      : 'bg-[#134F9F]/15 dark:bg-[#134F9F]/30 text-[#134F9F] dark:text-blue-400'
                  }`}>
                    {tech.avatarInitials}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#134F9F] dark:group-hover:text-blue-400 transition-colors truncate">
                      {tech.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 truncate">
                      {tech.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    tech.isManagementGroup ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  }`}>
                    {tech.groupName}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuickPreviewTech(tech)}
                    className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                    title="Aumentar Visualização do Técnico"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Métricas do Técnico */}
              {tech.isManagementGroup ? (
                <div className="py-2.5 px-3 bg-slate-50 dark:bg-slate-950/60 rounded border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Atribuição:</span>
                    <strong className="text-slate-800 dark:text-slate-200">Supervisão & Processos</strong>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Status no ranking:</span>
                    <span className="text-blue-500 font-semibold text-[10px]">Excluído de Produtividade</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-1.5 py-2 border-y border-slate-100 dark:border-slate-800 text-center text-xs">
                  <div className="p-1 bg-slate-50 dark:bg-slate-950 rounded">
                    <span className="text-[9px] text-slate-400 block">Ativos</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">
                      {tech.activeTicketsCount}
                    </span>
                  </div>

                  <div className="p-1 bg-slate-50 dark:bg-slate-950 rounded">
                    <span className="text-[9px] text-slate-400 block">&gt;24h s/ Ação</span>
                    <span className={`font-mono font-bold text-xs ${tech.ticketsWithoutEvolution24hCount > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                      {tech.ticketsWithoutEvolution24hCount}
                    </span>
                  </div>

                  <div className="p-1 bg-slate-50 dark:bg-slate-950 rounded">
                    <span className="text-[9px] text-slate-400 block" title="Média ponderada observada">Média</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">
                      {tech.avgObservedResolutionHours}h
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Rodapé do Card com Ações */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setSelectedTech(tech)}
                className="text-[#134F9F] dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Dossiê da Carteira</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>

              <button
                type="button"
                onClick={() => handleOpenFeedback(tech)}
                className="px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors cursor-pointer"
              >
                Novo Feedback
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BARRA DE PAGINAÇÃO CONECTADA (SEM SCROLL) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 flex items-center justify-between text-xs text-slate-500 shadow-xs shrink-0">
        <div>
          Mostrando <strong className="text-slate-900 dark:text-slate-100 font-mono">{paginatedTechnicians.length}</strong> de <strong className="font-mono">{filteredTechnicians.length}</strong> técnicos
          <span className="hidden sm:inline text-slate-400"> · Visualização em cards sem scroll vertical</span>
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

      {/* MODAL DE AUMENTAR VISUALIZAÇÃO RÁPIDA DE UM TÉCNICO */}
      {quickPreviewTech && (
        <Modal
          isOpen={true}
          onClose={() => setQuickPreviewTech(null)}
          title={`Visualização Ampliada — ${quickPreviewTech.name}`}
          subtitle={`${quickPreviewTech.role} · ${quickPreviewTech.groupName}`}
        >
          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded">
                <span className="text-slate-400 text-[10px] block">Chamados Ativos</span>
                <span className="text-lg font-mono font-bold text-slate-900 dark:text-slate-100">
                  {quickPreviewTech.activeTicketsCount}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded">
                <span className="text-slate-400 text-[10px] block">Resolvidos Mês</span>
                <span className="text-lg font-mono font-bold text-emerald-500">
                  {quickPreviewTech.resolvedInPeriodCount}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded">
                <span className="text-slate-400 text-[10px] block">Tempo Médio Obs.</span>
                <span className="text-lg font-mono font-bold text-slate-900 dark:text-slate-100">
                  {quickPreviewTech.avgObservedResolutionHours}h
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                Especialidades & Atuação
              </h4>
              <p className="text-slate-600 dark:text-slate-300">
                Atuação em suporte presencial a unidades assistenciais de internação, pronto-socorro e ambulatórios. Responsável pelo cumprimento do POP-TIN-017 de registros no GLPI.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setQuickPreviewTech(null)}
                className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  const t = quickPreviewTech;
                  setQuickPreviewTech(null);
                  setSelectedTech(t);
                }}
                className="px-3.5 py-1.5 text-white bg-[#134F9F] hover:bg-blue-800 font-semibold rounded cursor-pointer"
              >
                Abrir Dossiê Completo
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* NÍVEL 2 — DRAWER DE DOSSIÊ DA CARTEIRA TÉCNICA */}
      {selectedTech && (
        <DetailDrawer
          isOpen={true}
          onClose={() => setSelectedTech(null)}
          title={`Carteira Técnica: ${selectedTech.name}`}
          subtitle={`${selectedTech.role} · ${selectedTech.groupName}`}
          footerActions={
            <>
              <button
                type="button"
                onClick={() => setSelectedTech(null)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer"
              >
                Fechar Dossiê
              </button>
              <button
                type="button"
                onClick={() => {
                  const name = selectedTech.name;
                  setSelectedTech(null);
                  onOpenAgenteForFeedback(name);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-[#134F9F] hover:bg-blue-800 rounded cursor-pointer"
              >
                Gerar Dossiê TPL-03 no Agente
              </button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            {/* Resumo de Desempenho Factual */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded">
                <span className="text-slate-400 text-[10px] block">Chamados Ativos</span>
                <span className="text-lg font-mono font-bold text-slate-900 dark:text-slate-100">
                  {selectedTech.activeTicketsCount}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded">
                <span className="text-slate-400 text-[10px] block">Resolvidos no Mês</span>
                <span className="text-lg font-mono font-bold text-emerald-500">
                  {selectedTech.resolvedInPeriodCount}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded">
                <span className="text-slate-400 text-[10px] block">Tempo Médio Obs.</span>
                <span className="text-lg font-mono font-bold text-slate-900 dark:text-slate-100">
                  {selectedTech.avgObservedResolutionHours}h
                </span>
              </div>
            </div>

            {/* Aviso contra Conclusões Disciplinares Automáticas */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded text-amber-800 dark:text-amber-300 leading-relaxed">
              <strong>Diretriz Ética Mandatória:</strong> Métricas operacionais têm finalidade de dimensionamento de carga e apoio ao técnico. É <em>estritamente vedada qualquer conclusão disciplinar automática</em> sem contextualização assistencial e entrevista com o colaborador.
            </div>

            {/* Lista dos Chamados Ativos Atribuídos */}
            <div>
              <h4 className="font-bold uppercase tracking-wider text-slate-400 mb-2">
                Chamados Vinculados a {selectedTech.name}
              </h4>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {tickets
                  .filter(t => t.technicianId === selectedTech.id)
                  .map(t => (
                    <div key={t.id} className="py-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[#134F9F] dark:text-blue-400">#{t.id}</span>
                        <span className="text-[11px] text-slate-500">{t.hospitalLocation}</span>
                      </div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                        {t.title}
                      </p>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                        <span>Última ação: {t.lastHumanActionDate.slice(11, 16)}</span>
                        {t.isWithoutEvolution24h && (
                          <span className="text-amber-600 dark:text-amber-400 font-bold">&gt;24h sem ação</span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </DetailDrawer>
      )}

      {/* MODAL DE FEEDBACK INDIVIDUAL FUNDAMENTADO */}
      {selectedTech && (
        <Modal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          title={`Novo Feedback Estruturado — ${selectedTech.name}`}
          subtitle="Formulação contextual baseada em fatos e combinados operacionais (TPL-03)"
        >
          <div className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                1. Pontos Positivos e Fatos Comprovados
              </label>
              <textarea
                value={feedbackDraft.positive}
                onChange={(e) => setFeedbackDraft({ ...feedbackDraft, positive: e.target.value })}
                rows={3}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                2. Oportunidades de Desenvolvimento & Documentação POP-TIN-017
              </label>
              <textarea
                value={feedbackDraft.improvement}
                onChange={(e) => setFeedbackDraft({ ...feedbackDraft, improvement: e.target.value })}
                rows={3}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                3. Combinados e Próximo Acompanhamento
              </label>
              <textarea
                value={feedbackDraft.agreement}
                onChange={(e) => setFeedbackDraft({ ...feedbackDraft, agreement: e.target.value })}
                rows={2}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowFeedbackModal(false)}
                className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveFeedback}
                className="px-4 py-1.5 font-semibold text-white bg-[#134F9F] hover:bg-blue-800 rounded cursor-pointer"
              >
                Salvar Feedback Estruturado
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
