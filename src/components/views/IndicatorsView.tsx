/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Módulo Indicadores & Analytics
 * Gráficos consolidados em CARDS sem scroll no desktop
 * Controles para Aumentar Visualização (Modal Ampliado) e Editar quais aparecem
 */

import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  FileCheck, 
  Layers, 
  Clock, 
  Info,
  Calendar,
  Filter,
  Maximize2,
  SlidersHorizontal,
  CheckCircle2,
  PieChart
} from 'lucide-react';
import { MOCK_INDICATORS_DATA } from '../../data/mockData';
import { SyntheticMetricCard } from '../common/SyntheticMetricCard';
import { DetailDrawer } from '../common/DetailDrawer';
import { Modal } from '../common/Modal';

export const IndicatorsView: React.FC = () => {
  const data = MOCK_INDICATORS_DATA;

  // Estado para Drawer Analítico de Métricas
  const [selectedIndicatorDetail, setSelectedIndicatorDetail] = useState<string | null>(null);

  // Estado para Modal de Aumentar Visualização de Gráfico Específico
  const [maximizedChart, setMaximizedChart] = useState<'balance' | 'category' | 'quality' | 'status' | null>(null);

  // Modal para Editar quais Gráficos Aparecem
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [visibleCharts, setVisibleCharts] = useState({
    showBalance: true,
    showCategory: true,
    showQuality: true,
    showStatus: true
  });

  return (
    <div className="p-2.5 sm:p-4 max-w-7xl w-full mx-auto space-y-3">
      {/* BARRA SUPERIOR: CONTROLE DE EXIBIÇÃO DE GRÁFICOS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
        <div>
          <h2 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#134F9F] dark:text-blue-400" />
            <span>Indicadores Operacionais & Qualidade Documental</span>
          </h2>
          <p className="text-[11px] text-slate-500">
            Visualização sintética em cards sem rolagem vertical · Clique em qualquer gráfico para ampliar
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowConfigModal(true)}
            className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Editar Gráficos Exibidos</span>
          </button>
        </div>
      </div>

      {/* NÍVEL 1 SINTÉTICO: 3 KPIS ESSENCIAIS EM CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <SyntheticMetricCard
          label="Taxa de Resolução Sem Reabertura"
          value="98.3%"
          subtext="Últimos 30 dias (1 reabertura em 58)"
          trend={{ value: "+0.8% no mês", isPositive: true }}
          onClickDetail={() => setSelectedIndicatorDetail('reabertura')}
          ctaText="Detalhar"
        />

        <SyntheticMetricCard
          label="Índice de Qualidade Documental"
          value={`${data.documentQualityIndex.overallRate}%`}
          subtext="Aderência integral às 4 regras POP-TIN-017"
          trend={{ value: "Meta >= 85%", isPositive: true }}
          onClickDetail={() => setSelectedIndicatorDetail('qualidade_doc')}
          ctaText="Ver Regras"
        />

        <SyntheticMetricCard
          label="Tempo Médio Observado (7d)"
          value={`${data.kpis.avgObservedResolutionHours}h`}
          subtext="Abertura a solução (não é SLA/MTTR)"
          formulaExplanation={data.kpis.avgResolutionFormulaNotice}
          onClickDetail={() => setSelectedIndicatorDetail('tempo_medio')}
          ctaText="Fórmula"
        />
      </div>

      {/* GRADE DE GRÁFICOS EM CARDS COMPACTOS (SEM SCROLL) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* CARD GRÁFICO 1: BALANÇO DIÁRIO (ABERTURA VS SOLUÇÃO) */}
        {visibleCharts.showBalance && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 flex flex-col justify-between shadow-xs hover:border-blue-500/50 transition-colors">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#134F9F] dark:text-blue-400" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    Balanço Diário (7 dias)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setMaximizedChart('balance')}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer"
                  title="Aumentar Visualização do Gráfico"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-3 text-[10px] text-slate-500 mb-2">
                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Novos ({data.trendSeries.reduce((a,b)=>a+b.abertos,0)})
                </span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Solucionados ({data.trendSeries.reduce((a,b)=>a+b.solucionados,0)})
                </span>
              </div>

              {/* Barras Compactas sem scroll */}
              <div className="space-y-1.5 text-xs">
                {data.trendSeries.slice(-5).map(item => (
                  <div key={item.day} className="flex items-center gap-2">
                    <span className="w-12 text-[10px] font-mono text-slate-400 truncate">{item.day}</span>
                    <div className="flex-1 flex items-center gap-1 h-4">
                      <div 
                        className="bg-blue-500 rounded text-[9px] text-white font-mono flex items-center justify-end px-1"
                        style={{ width: `${item.abertos * 4.5}%` }}
                        title={`${item.abertos} abertos`}
                      >
                        {item.abertos}
                      </div>
                      <div 
                        className="bg-emerald-500 rounded text-[9px] text-white font-mono flex items-center justify-end px-1"
                        style={{ width: `${item.solucionados * 4.5}%` }}
                        title={`${item.solucionados} solucionados`}
                      >
                        {item.solucionados}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px]">
              <span className="text-slate-400 font-mono">Vazão estável</span>
              <button
                type="button"
                onClick={() => setMaximizedChart('balance')}
                className="text-[#134F9F] dark:text-blue-400 font-semibold hover:underline"
              >
                Aumentar gráfico →
              </button>
            </div>
          </div>
        )}

        {/* CARD GRÁFICO 2: MACRO-CATEGORIAS DE TI */}
        {visibleCharts.showCategory && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 flex flex-col justify-between shadow-xs hover:border-blue-500/50 transition-colors">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    Macro-Categorias de TI
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setMaximizedChart('category')}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer"
                  title="Aumentar Visualização do Gráfico"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Barras de Categoria Compactas */}
              <div className="space-y-2 text-xs">
                {data.categoryDistribution.map(cat => (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-700 dark:text-slate-300">
                      <span className="truncate max-w-[170px]">{cat.name}</span>
                      <span className="font-mono font-bold">{cat.count}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all" 
                        style={{ width: `${(cat.count / 33) * 100}%`, backgroundColor: cat.color }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Total: 33 chamados</span>
              <button
                type="button"
                onClick={() => setMaximizedChart('category')}
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                Aumentar gráfico →
              </button>
            </div>
          </div>
        )}

        {/* CARD GRÁFICO 3: AUDITORIA DE QUALIDADE DOCUMENTAL (POP-TIN-017) */}
        {visibleCharts.showQuality && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 flex flex-col justify-between shadow-xs hover:border-blue-500/50 transition-colors">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    Qualidade Documental (POP-017)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setMaximizedChart('quality')}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer"
                  title="Aumentar Visualização do Gráfico"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Critérios POP-TIN-017 */}
              <div className="space-y-2 text-xs">
                {data.documentQualityIndex.criteria.slice(0, 3).map(crit => (
                  <div key={crit.name} className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-700 dark:text-slate-300">
                      <span className="truncate max-w-[170px]">{crit.name}</span>
                      <span className={`font-mono font-bold ${crit.compliance >= 85 ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {crit.compliance}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${crit.compliance >= 85 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                        style={{ width: `${crit.compliance}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px]">
              <span className="text-emerald-600 font-bold font-mono">Média: {data.documentQualityIndex.overallRate}%</span>
              <button
                type="button"
                onClick={() => setMaximizedChart('quality')}
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                Aumentar gráfico →
              </button>
            </div>
          </div>
        )}

        {/* CARD GRÁFICO 4: DISTRIBUIÇÃO POR STATUS OPERACIONAL */}
        {visibleCharts.showStatus && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 flex flex-col justify-between shadow-xs hover:border-blue-500/50 transition-colors">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <PieChart className="w-4 h-4 text-sky-500" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    Status dos Chamados Ativos
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setMaximizedChart('status')}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer"
                  title="Aumentar Visualização do Gráfico"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {data.statusDistribution.map(s => (
                  <div key={s.name} className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block truncate">{s.name}</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">{s.count}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({s.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px]">
              <span className="text-slate-400 font-mono">33 chamados totais</span>
              <button
                type="button"
                onClick={() => setMaximizedChart('status')}
                className="text-sky-600 dark:text-sky-400 font-semibold hover:underline"
              >
                Aumentar gráfico →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE PERSONALIZAR QUAIS GRÁFICOS APARECEM */}
      <Modal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        title="Personalizar Gráficos Operacionais"
        subtitle="Escolha quais cards de indicadores devem permanecer visíveis no painel principal"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300">
            Selecione os gráficos ativos para otimizar o seu viewport de gestão sem gerar rolagem vertical:
          </p>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-2.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
              <span className="font-semibold text-slate-800 dark:text-slate-200">1. Balanço Diário (Novos vs Solucionados)</span>
              <input
                type="checkbox"
                checked={visibleCharts.showBalance}
                onChange={(e) => setVisibleCharts({ ...visibleCharts, showBalance: e.target.checked })}
                className="rounded border-slate-300 text-[#134F9F] focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
              <span className="font-semibold text-slate-800 dark:text-slate-200">2. Macro-Categorias de TI Hospitalar</span>
              <input
                type="checkbox"
                checked={visibleCharts.showCategory}
                onChange={(e) => setVisibleCharts({ ...visibleCharts, showCategory: e.target.checked })}
                className="rounded border-slate-300 text-[#134F9F] focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
              <span className="font-semibold text-slate-800 dark:text-slate-200">3. Auditoria de Qualidade Documental (POP-017)</span>
              <input
                type="checkbox"
                checked={visibleCharts.showQuality}
                onChange={(e) => setVisibleCharts({ ...visibleCharts, showQuality: e.target.checked })}
                className="rounded border-slate-300 text-[#134F9F] focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
              <span className="font-semibold text-slate-800 dark:text-slate-200">4. Distribuição de Status dos Chamados</span>
              <input
                type="checkbox"
                checked={visibleCharts.showStatus}
                onChange={(e) => setVisibleCharts({ ...visibleCharts, showStatus: e.target.checked })}
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
              Salvar Configuração de Gráficos
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL PARA AUMENTAR VISUALIZAÇÃO DE GRÁFICO (MODAL AMPLIADO) */}
      {maximizedChart && (
        <Modal
          isOpen={true}
          onClose={() => setMaximizedChart(null)}
          title={
            maximizedChart === 'balance' ? 'Visualização Ampliada: Balanço Diário de Abertura vs Solução' :
            maximizedChart === 'category' ? 'Visualização Ampliada: Macro-Categorias de TI Hospitalar' :
            maximizedChart === 'quality' ? 'Visualização Ampliada: Critérios de Qualidade Documental POP-TIN-017' :
            'Visualização Ampliada: Distribuição de Status dos Chamados Ativos'
          }
          subtitle="Análise aprofundada com séries históricas completas e métricas comparativas"
        >
          <div className="space-y-4 text-xs">
            {maximizedChart === 'balance' && (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">
                    Histórico Diário Detalhado
                  </h4>
                  <div className="space-y-2">
                    {data.trendSeries.map(item => (
                      <div key={item.day} className="flex items-center justify-between p-2 rounded bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200 w-28">{item.day}</span>
                        <div className="flex items-center gap-6 font-mono text-xs">
                          <span className="text-blue-600 font-semibold">Novos: {item.abertos}</span>
                          <span className="text-emerald-600 font-semibold">Solucionados: {item.solucionados}</span>
                          <span className="text-slate-400">Tempo Médio: {item.tempoMedio}h</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {maximizedChart === 'category' && (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">
                    Detalhamento por Macro-Categoria
                  </h4>
                  <div className="space-y-2.5">
                    {data.categoryDistribution.map(cat => (
                      <div key={cat.name} className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1">
                        <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                          <span>{cat.name}</span>
                          <span className="font-mono">{cat.count} chamados ({Math.round((cat.count/33)*100)}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all" 
                            style={{ width: `${(cat.count / 33) * 100}%`, backgroundColor: cat.color }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {maximizedChart === 'quality' && (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">
                    Conformidade das 4 Regras Canônicas POP-TIN-017
                  </h4>
                  <div className="space-y-2.5">
                    {data.documentQualityIndex.criteria.map(crit => (
                      <div key={crit.name} className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                          <span>{crit.name}</span>
                          <span className={`font-mono ${crit.compliance >= 85 ? 'text-emerald-500' : 'text-amber-500'}`}>{crit.compliance}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${crit.compliance >= 85 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                            style={{ width: `${crit.compliance}%` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {maximizedChart === 'status' && (
              <div className="grid grid-cols-2 gap-3">
                {data.statusDistribution.map(s => (
                  <div key={s.name} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-xs text-slate-500 block">{s.name}</span>
                    <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1 block">{s.count}</span>
                    <span className="text-xs font-mono text-[#134F9F] dark:text-blue-400 font-semibold">{s.percentage}% do total</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setMaximizedChart(null)}
                className="px-4 py-1.5 text-white bg-[#134F9F] hover:bg-blue-800 rounded font-semibold text-xs cursor-pointer"
              >
                Fechar Visualização Ampliada
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* DRAWER ANALÍTICO DE INDICADORES */}
      {selectedIndicatorDetail && (
        <DetailDrawer
          isOpen={true}
          onClose={() => setSelectedIndicatorDetail(null)}
          title="Detalhamento do Indicador"
          subtitle="Composição de cálculo, regras aplicáveis e limitações de governança"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Definição Operacional
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedIndicatorDetail === 'tempo_medio' && data.kpis.avgResolutionFormulaNotice}
                {selectedIndicatorDetail === 'qualidade_doc' && 'Mede o percentual de chamados fechados que contêm evidência técnica explícita anexada, atribuição nominal válida e relato técnico circunstanciado sem depender apenas de date_mod.'}
                {selectedIndicatorDetail === 'reabertura' && 'Mede o índice de chamados que foram reabertos pelo solicitante após encerramento técnico no período de 30 dias.'}
              </p>
            </div>
          </div>
        </DetailDrawer>
      )}
    </div>
  );
};
