/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Módulo Configurações, Parâmetros e Gestão do POP-TIN-017
 * Ajuste de todos os cálculos, fórmulas, limiares, edição/criação de regras do POP e publicação de novas versões
 */

import React, { useState } from 'react';
import { 
  Settings, 
  Server, 
  Clock, 
  ShieldCheck, 
  Database,
  Moon,
  Sun,
  SlidersHorizontal,
  Calculator,
  PlusCircle,
  FileCheck2,
  Edit3,
  History,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  Users,
  Bot,
  Info,
  Layers,
  Sparkles,
  Tag,
  Calendar,
  Lock,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  LayoutList,
  GripVertical
} from 'lucide-react';
import { 
  CurrentUser, 
  PopSpecification, 
  PopRule, 
  OperationalCalculationSettings, 
  SettingsAuditLog,
  EvidenceLevel,
  NavMenuItemConfig,
  NavigationRoute
} from '../../types';
import { DEFAULT_MENU_CONFIG } from '../../data/settingsDefaults';
import { EvidenceBadge } from '../common/EvidenceBadge';
import { Modal } from '../common/Modal';

interface SettingsViewProps {
  currentUser: CurrentUser;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  dataSource: 'REALTIME' | 'SNAPSHOT_04H';
  onToggleDataSource: () => void;
  popSpec: PopSpecification;
  onUpdatePopSpec: (newSpec: PopSpecification) => void;
  calculationSettings: OperationalCalculationSettings;
  onUpdateCalculationSettings: (newSettings: OperationalCalculationSettings) => void;
  menuConfig?: NavMenuItemConfig[];
  onUpdateMenuConfig?: (newConfig: NavMenuItemConfig[]) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  isDarkMode,
  onToggleTheme,
  dataSource,
  onToggleDataSource,
  popSpec,
  onUpdatePopSpec,
  calculationSettings,
  onUpdateCalculationSettings,
  menuConfig,
  onUpdateMenuConfig
}) => {
  // Aba ativa nas configurações
  const [activeTab, setActiveTab] = useState<'pop-rules' | 'calculations' | 'team' | 'automation' | 'menu-order' | 'audit-log'>('pop-rules');

  // Estado local para edições pendentes
  const [localPopSpec, setLocalPopSpec] = useState<PopSpecification>(popSpec);
  const [localSettings, setLocalSettings] = useState<OperationalCalculationSettings>(calculationSettings);
  const [localMenuConfig, setLocalMenuConfig] = useState<NavMenuItemConfig[]>(menuConfig || DEFAULT_MENU_CONFIG);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  React.useEffect(() => {
    if (menuConfig) {
      setLocalMenuConfig(menuConfig);
    }
  }, [menuConfig]);

  // Modais de Gestão do POP
  const [editingRule, setEditingRule] = useState<PopRule | null>(null);
  const [showNewRuleModal, setShowNewRuleModal] = useState<boolean>(false);
  const [showNewVersionModal, setShowNewVersionModal] = useState<boolean>(false);

  // Form para nova regra
  const [newRuleForm, setNewRuleForm] = useState<Omit<PopRule, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    description: '',
    defaultEvidenceLevel: 'Indício de desconformidade',
    thresholdHours: 24,
    severity: 'ALTA',
    isActive: true,
    applicableExceptions: ''
  });

  // Form para nova versão do POP-TIN-017
  const [newVersionForm, setNewVersionForm] = useState({
    version: 'v2.5',
    effectiveDate: '01/12/2026',
    changeNotes: 'Ajuste operacional de tolerâncias para chamados assistenciais e validação do comitê de governança.',
    homologatedBy: `${currentUser.name} (${currentUser.department})`
  });

  // Logs locais de auditoria
  const [auditLogs, setAuditLogs] = useState<SettingsAuditLog[]>([
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
  ]);

  // Salvar todas as configurações
  const handleSaveAll = () => {
    onUpdatePopSpec(localPopSpec);
    onUpdateCalculationSettings(localSettings);
    if (onUpdateMenuConfig) {
      onUpdateMenuConfig(localMenuConfig);
    }

    const newLog: SettingsAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + ' (Brasília)',
      user: currentUser.name,
      section: 'Parâmetros Gerais',
      changeDescription: 'Atualização geral de limiares operacionais, fórmulas de cálculo e ordem do menu lateral.'
    };
    setAuditLogs(prev => [newLog, ...prev]);

    setSaveSuccessNotice('Todas as configurações, ordem do menu lateral e regras operacionais foram salvas com sucesso.');
    setTimeout(() => setSaveSuccessNotice(null), 4000);
  };

  // Reordenação de Itens do Menu Lateral
  const handleMoveMenuItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= localMenuConfig.length) return;
    const updated = [...localMenuConfig];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setLocalMenuConfig(updated);
    if (onUpdateMenuConfig) {
      onUpdateMenuConfig(updated);
    }
  };

  // Alternar Visibilidade de Item do Menu Lateral
  const handleToggleMenuVisibility = (id: string) => {
    if (id === 'configuracoes') return; // Impossível ocultar a própria central de configurações
    const updated = localMenuConfig.map(item => {
      if (item.id === id) {
        return { ...item, isVisible: !item.isVisible };
      }
      return item;
    });
    setLocalMenuConfig(updated);
    if (onUpdateMenuConfig) {
      onUpdateMenuConfig(updated);
    }
  };

  // Restaurar Ordem Padrão do Menu Lateral
  const handleResetMenuConfig = () => {
    setLocalMenuConfig(DEFAULT_MENU_CONFIG);
    if (onUpdateMenuConfig) {
      onUpdateMenuConfig(DEFAULT_MENU_CONFIG);
    }
    setSaveSuccessNotice('Ordem e visibilidade padrão do menu lateral restauradas com sucesso.');
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  // Atualizar Rótulo de Item do Menu
  const handleUpdateMenuLabel = (id: string, newLabel: string) => {
    if (!newLabel.trim()) return;
    const updated = localMenuConfig.map(item => {
      if (item.id === id) {
        return { ...item, label: newLabel };
      }
      return item;
    });
    setLocalMenuConfig(updated);
    if (onUpdateMenuConfig) {
      onUpdateMenuConfig(updated);
    }
  };

  // Toggle ativo/inativo de uma regra do POP
  const handleToggleRuleActive = (ruleId: string) => {
    const updatedRules = localPopSpec.rules.map(r => {
      if (r.id === ruleId) {
        return { ...r, isActive: !r.isActive, updatedAt: '06/11/2026' };
      }
      return r;
    });
    setLocalPopSpec({ ...localPopSpec, rules: updatedRules });
  };

  // Salvar edição de uma regra existente
  const handleSaveEditedRule = () => {
    if (!editingRule) return;
    const updatedRules = localPopSpec.rules.map(r => (r.id === editingRule.id ? { ...editingRule, updatedAt: '06/11/2026' } : r));
    setLocalPopSpec({ ...localPopSpec, rules: updatedRules });
    
    const newLog: SettingsAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: '06/11/2026 11:15',
      user: currentUser.name,
      section: 'Regras POP-TIN-017',
      changeDescription: `Regra ${editingRule.id} ajustada: tolerância ${editingRule.thresholdHours}h, camada ${editingRule.defaultEvidenceLevel}.`
    };
    setAuditLogs(prev => [newLog, ...prev]);

    setEditingRule(null);
    setSaveSuccessNotice(`Regra ${editingRule.id} atualizada com sucesso.`);
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  // Criar e adicionar nova regra
  const handleCreateNewRule = () => {
    if (!newRuleForm.title.trim()) return;
    const nextIndex = localPopSpec.rules.length + 1;
    const newRule: PopRule = {
      ...newRuleForm,
      id: `POP-TIN-017-R${nextIndex}`,
      createdAt: '06/11/2026',
      updatedAt: '06/11/2026'
    };

    const updatedRules = [...localPopSpec.rules, newRule];
    setLocalPopSpec({ ...localPopSpec, rules: updatedRules });

    const newLog: SettingsAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: '06/11/2026 11:18',
      user: currentUser.name,
      section: 'Regras POP-TIN-017',
      changeDescription: `Nova regra criada: ${newRule.id} — "${newRule.title}".`
    };
    setAuditLogs(prev => [newLog, ...prev]);

    setShowNewRuleModal(false);
    setNewRuleForm({
      title: '',
      description: '',
      defaultEvidenceLevel: 'Indício de desconformidade',
      thresholdHours: 24,
      severity: 'ALTA',
      isActive: true,
      applicableExceptions: ''
    });
    setSaveSuccessNotice(`Regra ${newRule.id} homologada e incluída no POP-TIN-017 com sucesso.`);
    setTimeout(() => setSaveSuccessNotice(null), 4000);
  };

  // Publicar nova versão do POP-TIN-017
  const handlePublishNewVersion = () => {
    const revision = {
      version: newVersionForm.version,
      date: newVersionForm.effectiveDate,
      author: newVersionForm.homologatedBy,
      summary: newVersionForm.changeNotes,
      rulesCount: localPopSpec.rules.length
    };

    const newSpec: PopSpecification = {
      ...localPopSpec,
      version: newVersionForm.version,
      effectiveDate: newVersionForm.effectiveDate,
      homologatedBy: newVersionForm.homologatedBy,
      changeNotes: newVersionForm.changeNotes,
      status: 'VIGENTE',
      revisionHistory: [revision, ...localPopSpec.revisionHistory]
    };

    setLocalPopSpec(newSpec);
    onUpdatePopSpec(newSpec);

    const newLog: SettingsAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: '06/11/2026 11:20',
      user: currentUser.name,
      section: 'Publicação de Versão POP',
      changeDescription: `Publicada nova versão canônica ${newVersionForm.version} do POP-TIN-017 com ${localPopSpec.rules.length} regras ativas.`
    };
    setAuditLogs(prev => [newLog, ...prev]);

    setShowNewVersionModal(false);
    setSaveSuccessNotice(`Nova versão ${newVersionForm.version} do POP-TIN-017 publicada e vigente em todo o Portal!`);
    setTimeout(() => setSaveSuccessNotice(null), 5000);
  };

  return (
    <div className="h-full flex flex-col p-3 sm:p-4 max-w-7xl w-full mx-auto overflow-hidden gap-2.5">
      {/* CABEÇALHO DO MÓDULO & AÇÕES RÁPIDAS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded bg-blue-500/10 text-[#134F9F] dark:text-blue-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Central de Governança, Fórmulas & Regras do POP-TIN-017
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                {localPopSpec.code} {localPopSpec.version}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Todos os cálculos, limiares, regras do POP e parâmetros são 100% ajustáveis pelo gestor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#134F9F] hover:bg-blue-800 rounded-md transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salvar Parâmetros</span>
          </button>
        </div>
      </div>

      {saveSuccessNotice && (
        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded text-xs flex items-center gap-2 shrink-0 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="font-medium">{saveSuccessNotice}</span>
        </div>
      )}

      {/* BARRA DE NAVEGAÇÃO DE ABAS */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 shrink-0 text-xs overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('pop-rules')}
          className={`px-3 py-2 font-medium border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'pop-rules'
              ? 'border-[#134F9F] text-[#134F9F] dark:border-blue-400 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Regras do POP-TIN-017 ({localPopSpec.rules.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('calculations')}
          className={`px-3 py-2 font-medium border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'calculations'
              ? 'border-[#134F9F] text-[#134F9F] dark:border-blue-400 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Fórmulas & Tempo Médio</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('team')}
          className={`px-3 py-2 font-medium border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'team'
              ? 'border-[#134F9F] text-[#134F9F] dark:border-blue-400 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Governança da Equipe</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('automation')}
          className={`px-3 py-2 font-medium border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'automation'
              ? 'border-[#134F9F] text-[#134F9F] dark:border-blue-400 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Automação & Horários Oficiais</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('menu-order')}
          className={`px-3 py-2 font-medium border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'menu-order'
              ? 'border-[#134F9F] text-[#134F9F] dark:border-blue-400 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <LayoutList className="w-4 h-4" />
          <span>Menu Lateral & Ordem ({localMenuConfig.filter(m => m.isVisible).length}/{localMenuConfig.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit-log')}
          className={`px-3 py-2 font-medium border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'audit-log'
              ? 'border-[#134F9F] text-[#134F9F] dark:border-blue-400 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Histórico & Auditoria</span>
        </button>
      </div>

      {/* ÁREA DE CONTEÚDO SCROLLÁVEL INTERNO (NÃO PROVOCA SCROLL NA PÁGINA) */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-3">
        {/* ======================================================== */}
        {/* ABA 1: REGRAS & VERSÕES DO POP-TIN-017                    */}
        {/* ======================================================== */}
        {activeTab === 'pop-rules' && (
          <div className="space-y-3">
            {/* Banner da Versão Vigente */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                    Norma Procedimental {localPopSpec.code}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-500">
                    Versão Atual: {localPopSpec.version}
                  </span>
                  <span className="text-slate-400 text-xs">·</span>
                  <span className="text-slate-500 text-xs">Vigência desde {localPopSpec.effectiveDate}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Homologada por: <strong className="text-slate-700 dark:text-slate-300">{localPopSpec.homologatedBy}</strong>
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 italic">
                  "{localPopSpec.changeNotes}"
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewRuleModal(true)}
                  className="px-3 py-1.5 rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-[#134F9F] dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Criar Nova Regra</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowNewVersionModal(true)}
                  className="px-3 py-1.5 rounded bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Publicar Nova Versão</span>
                </button>
              </div>
            </div>

            {/* Lista das Regras Vigentes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="font-bold uppercase tracking-wider text-[10px]">
                  Regras Ativas e Critérios de Auditoria ({localPopSpec.rules.length})
                </span>
                <span>Clique em "Editar" para alterar tolerância horária, camada ou exceções</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {localPopSpec.rules.map(rule => (
                  <div
                    key={rule.id}
                    className={`bg-white dark:bg-slate-900 border rounded-lg p-3 flex flex-col justify-between transition-all shadow-xs ${
                      rule.isActive
                        ? 'border-slate-200 dark:border-slate-800 hover:border-blue-500/50'
                        : 'border-slate-200 dark:border-slate-800 opacity-60 bg-slate-50/50 dark:bg-slate-950/40'
                    }`}
                  >
                    <div>
                      {/* Cabeçalho da Regra */}
                      <div className="flex items-center justify-between gap-2 mb-1.5 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#134F9F] dark:text-blue-400">
                            {rule.id}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            rule.severity === 'CRITICA'
                              ? 'bg-rose-500/15 text-rose-500'
                              : rule.severity === 'ALTA'
                                ? 'bg-amber-500/15 text-amber-500'
                                : 'bg-blue-500/15 text-blue-500'
                          }`}>
                            {rule.severity}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Toggle Ativo/Inativo */}
                          <label className="flex items-center gap-1 cursor-pointer text-[10px]">
                            <input
                              type="checkbox"
                              checked={rule.isActive}
                              onChange={() => handleToggleRuleActive(rule.id)}
                              className="rounded border-slate-300 text-[#134F9F] focus:ring-0"
                            />
                            <span className={rule.isActive ? 'text-emerald-500 font-bold' : 'text-slate-400'}>
                              {rule.isActive ? 'Ativa' : 'Inativa'}
                            </span>
                          </label>

                          <button
                            type="button"
                            onClick={() => setEditingRule({ ...rule })}
                            className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                            title="Editar Regra"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Título e Descrição */}
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
                        {rule.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                        {rule.description}
                      </p>

                      {/* Tolerância e Camada de Evidência */}
                      <div className="grid grid-cols-2 gap-1.5 p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-[10px]">
                        <div>
                          <span className="text-slate-400 block">Tolerância Operacional:</span>
                          <strong className="text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                            {rule.thresholdHours === 0 ? 'Imediato (0h)' : `${rule.thresholdHours} horas`}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Camada de Conclusão:</span>
                          <EvidenceBadge level={rule.defaultEvidenceLevel} size="sm" />
                        </div>
                      </div>

                      {/* Exceções */}
                      {rule.applicableExceptions && (
                        <p className="text-[10px] text-slate-400 mt-2 italic">
                          <strong className="not-italic text-slate-500">Exceção:</strong> {rule.applicableExceptions}
                        </p>
                      )}
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Última revisão: {rule.updatedAt}</span>
                      <button
                        type="button"
                        onClick={() => setEditingRule({ ...rule })}
                        className="text-[#134F9F] dark:text-blue-400 font-semibold hover:underline"
                      >
                        Ajustar Regra
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Histórico de Revisões Canônicas */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-[#134F9F] dark:text-blue-400" />
                <span>Histórico de Versões e Homologações DTI</span>
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {localPopSpec.revisionHistory.map((rev, idx) => (
                  <div key={idx} className="py-2 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{rev.version}</span>
                        <span className="text-slate-400 text-[10px]">{rev.date}</span>
                        <span className="text-slate-400 text-[10px]">· {rev.author}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{rev.summary}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded shrink-0">
                      {rev.rulesCount} regras
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA 2: FÓRMULAS & TEMPO MÉDIO OBSERVADO                   */}
        {/* ======================================================== */}
        {activeTab === 'calculations' && (
          <div className="space-y-3">
            {/* Cartão Explicativo da Fórmula do Tempo Médio */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#134F9F] dark:text-blue-400" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Fórmula do Tempo Médio Observado de Abertura a Solução
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-bold">
                  NÃO EQUIVALE A SLA / MTTR CONTRATUAL
                </span>
              </div>

              <div className="p-3 rounded bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 overflow-x-auto">
                <code>
                  Tempo Médio Observado = Σ [ (Data_Solucao - Data_Criacao) - Descontos_Parametrizados ] / Total_Chamados_Solucionados
                </code>
              </div>

              {/* Parâmetros Ajustáveis da Fórmula */}
              <div className="space-y-2.5 text-xs">
                <span className="font-bold text-slate-900 dark:text-slate-100 block">
                  Ajuste de Parâmetros e Descontos no Cálculo:
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex items-start gap-2.5 p-2.5 rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.avgResolutionTime.excludeWeekends}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        avgResolutionTime: { ...localSettings.avgResolutionTime, excludeWeekends: e.target.checked }
                      })}
                      className="mt-0.5 rounded border-slate-300 text-[#134F9F] focus:ring-0"
                    />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-100 block">Descontar finais de semana e feriados</span>
                      <span className="text-[11px] text-slate-400">Embora a assistência hospitalar funcione 24/7, setores de desenvolvimento e terceiros operam sob plantão sobreaviso.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2.5 rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.avgResolutionTime.excludeWaitingExternal}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        avgResolutionTime: { ...localSettings.avgResolutionTime, excludeWaitingExternal: e.target.checked }
                      })}
                      className="mt-0.5 rounded border-slate-300 text-[#134F9F] focus:ring-0"
                    />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-100 block">Descontar tempo em estado WAITING_EXTERNAL</span>
                      <span className="text-[11px] text-slate-400">Subtrai as horas em que o chamado aguardava retorno de ordem técnica do fornecedor externo (ex: Philips/Tasy).</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2.5 rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.avgResolutionTime.excludeUnassignedTime}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        avgResolutionTime: { ...localSettings.avgResolutionTime, excludeUnassignedTime: e.target.checked }
                      })}
                      className="mt-0.5 rounded border-slate-300 text-[#134F9F] focus:ring-0"
                    />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-100 block">Descontar fila antes da atribuição técnica nominal</span>
                      <span className="text-[11px] text-slate-400">Calcula a média a partir da primeira ação do técnico responsável, isolando a demora de triagem inicial.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2.5 rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.avgResolutionTime.excludeReopened}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        avgResolutionTime: { ...localSettings.avgResolutionTime, excludeReopened: e.target.checked }
                      })}
                      className="mt-0.5 rounded border-slate-300 text-[#134F9F] focus:ring-0"
                    />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-100 block">Isolar chamados reabertos</span>
                      <span className="text-[11px] text-slate-400">Trata chamados reabertos em fila analítica separada para evitar distorção estatística na rotina padrão.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Janela de Amostragem */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 dark:text-slate-300">Janela Padrão de Dias para Cálculo da Média:</span>
                <select
                  value={localSettings.avgResolutionTime.calculationWindowDays}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    avgResolutionTime: { ...localSettings.avgResolutionTime, calculationWindowDays: Number(e.target.value) }
                  })}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-xs text-slate-900 dark:text-slate-100"
                >
                  <option value={7}>Últimos 7 dias (Turno Operacional)</option>
                  <option value={15}>Últimos 15 dias (Quinzena)</option>
                  <option value={30}>Últimos 30 dias (Mês Canônico)</option>
                  <option value={60}>Últimos 60 dias (Bimestre)</option>
                </select>
              </div>
            </div>

            {/* Limiar Geral de Estagnação de Chamados */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Limiar Oficial de Estagnação sem Evolução Humana</span>
                </h3>
                <span className="font-mono text-sm font-bold text-amber-500">
                  {localSettings.stagnationThresholdHours} Horas
                </span>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Qualquer chamado aberto que complete este intervalo sem um apontamento humano comprovado aciona automaticamente o indicador <code>isWithoutEvolution</code> e passa a compor a auditoria de pendências.
              </p>

              <div className="flex items-center gap-4 pt-1">
                <input
                  type="range"
                  min={6}
                  max={72}
                  step={6}
                  value={localSettings.stagnationThresholdHours}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    stagnationThresholdHours: Number(e.target.value)
                  })}
                  className="flex-1 cursor-pointer accent-[#134F9F]"
                />
                <div className="flex items-center gap-1 font-mono text-xs">
                  <input
                    type="number"
                    value={localSettings.stagnationThresholdHours}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      stagnationThresholdHours: Math.max(1, Number(e.target.value))
                    })}
                    className="w-16 p-1 rounded border border-slate-200 dark:border-slate-800 text-center bg-slate-50 dark:bg-slate-950"
                  />
                  <span>horas</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA 3: GOVERNANÇA DA EQUIPE & CARTEIRAS                   */}
        {/* ======================================================== */}
        {activeTab === 'team' && (
          <div className="space-y-3">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#134F9F] dark:text-blue-400" />
                  <span>Diretrizes de Governança do Grupo 48 Gestão & Rankings</span>
                </h3>
                <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                  REGRA INSTITUCIONAL VIGENTE
                </span>
              </div>

              <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 rounded text-[11px] text-blue-950 dark:text-blue-300 leading-relaxed">
                <strong>Mandato de Transparência:</strong> Os profissionais pertencentes ao <strong>Grupo 48 Gestão</strong> desempenham atribuições de coordenação, homologação e conformidade documental. Eles devem ser exibidos nas visões gerais de equipe, mas estão estritamente excluídos dos rankings operacionais de velocidade e produtividade para evitar distorções comparativas com técnicos de campo.
              </div>

              <div className="space-y-2.5 pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.teamGovernance.excludeManagementGroup48}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      teamGovernance: { ...localSettings.teamGovernance, excludeManagementGroup48: e.target.checked }
                    })}
                    className="rounded border-slate-300 text-[#134F9F] focus:ring-0"
                  />
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Excluir automaticamente membros do Grupo 48 dos rankings e cartões de produtividade
                  </span>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="p-3 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      Limite de Sobrecarga por Técnico:
                    </label>
                    <p className="text-[11px] text-slate-400 mb-2">Dispara aviso visual quando a carteira nominal exceder esta quantidade:</p>
                    <div className="flex items-center gap-2 font-mono">
                      <input
                        type="number"
                        value={localSettings.teamGovernance.maxActiveTicketsPerTechThreshold}
                        onChange={(e) => setLocalSettings({
                          ...localSettings,
                          teamGovernance: { ...localSettings.teamGovernance, maxActiveTicketsPerTechThreshold: Number(e.target.value) }
                        })}
                        className="w-20 p-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center font-bold"
                      />
                      <span>chamados simultâneos</span>
                    </div>
                  </div>

                  <div className="p-3 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      Alerta de Chamados Estagnados por Carteira:
                    </label>
                    <p className="text-[11px] text-slate-400 mb-2">Dispara badge de atenção quando houver chamados &gt; 24h sem ação:</p>
                    <div className="flex items-center gap-2 font-mono">
                      <input
                        type="number"
                        value={localSettings.teamGovernance.stalledTicketsAlertThreshold}
                        onChange={(e) => setLocalSettings({
                          ...localSettings,
                          teamGovernance: { ...localSettings.teamGovernance, stalledTicketsAlertThreshold: Number(e.target.value) }
                        })}
                        className="w-20 p-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center font-bold"
                      />
                      <span>chamados sem evolução</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA 4: AUTOMAÇÃO, PALAVRAS-CHAVE & HORÁRIOS               */}
        {/* ======================================================== */}
        {activeTab === 'automation' && (
          <div className="space-y-3">
            {/* Horários dos Snapshots Oficiais */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>Cronograma Oficial de Snapshots (Fuso America/Sao_Paulo)</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Brasília (BRT)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Snapshot Noturno Oficial:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="time"
                      value={localSettings.snapshotSchedules.nightlyAuditTime}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        snapshotSchedules: { ...localSettings.snapshotSchedules, nightlyAuditTime: e.target.value }
                      })}
                      className="p-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono font-bold text-xs"
                    />
                    <span className="text-[11px] text-slate-500">Varredura de hashes</span>
                  </div>
                </div>

                <div className="p-3 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Briefing Matinal:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="time"
                      value={localSettings.snapshotSchedules.morningBriefTime}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        snapshotSchedules: { ...localSettings.snapshotSchedules, morningBriefTime: e.target.value }
                      })}
                      className="p-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono font-bold text-xs"
                    />
                    <span className="text-[11px] text-slate-500">Prévia Daily</span>
                  </div>
                </div>

                <div className="p-3 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Cut-Off Plantão Diurno:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="time"
                      value={localSettings.snapshotSchedules.shiftCutoffTime}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        snapshotSchedules: { ...localSettings.snapshotSchedules, shiftCutoffTime: e.target.value }
                      })}
                      className="p-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono font-bold text-xs"
                    />
                    <span className="text-[11px] text-slate-500">Limite GLPI</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Classificação de Autoria Humana vs Automação */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-indigo-500" />
                  <span>Regras de Distinção: Ação Humana vs Robô / Automação</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">POP-TIN-017 R6</span>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Apontamentos no GLPI cujos autores ou conteúdos correspondam a estas chaves são classificados como <code>automacao</code> e <strong>não</strong> renovam a contagem de 24h sem ação humana:
              </p>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {localSettings.authorshipRules.automationKeywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]"
                  >
                    <span>{kw}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const filtered = localSettings.authorshipRules.automationKeywords.filter((_, i) => i !== idx);
                        setLocalSettings({
                          ...localSettings,
                          authorshipRules: { ...localSettings.authorshipRules, automationKeywords: filtered }
                        });
                      }}
                      className="text-slate-400 hover:text-rose-500 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Mínimo de caracteres */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300 text-[11px]">
                  Tamanho mínimo de texto para validar evidência substantiva:
                </span>
                <div className="flex items-center gap-2 font-mono">
                  <input
                    type="number"
                    value={localSettings.authorshipRules.minCharsForValidHumanEvidence}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      authorshipRules: { ...localSettings.authorshipRules, minCharsForValidHumanEvidence: Number(e.target.value) }
                    })}
                    className="w-16 p-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center text-xs"
                  />
                  <span className="text-slate-400 text-[11px]">caracteres</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA 5: PERSONALIZAÇÃO DO MENU LATERAL & ORDEM            */}
        {/* ======================================================== */}
        {activeTab === 'menu-order' && (
          <div className="space-y-3">
            {/* Cabeçalho da Seção */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <LayoutList className="w-4 h-4 text-[#134F9F] dark:text-blue-400" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Ordem e Visibilidade dos Itens do Menu Lateral
                  </h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-[#134F9F] dark:text-blue-400">
                    {localMenuConfig.filter(m => m.isVisible).length} Ativos no Sidebar
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Mova os itens para cima ou para baixo para personalizar a sequência de acesso rápido. Ocultar módulos não apaga dados.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetMenuConfig}
                  className="px-3 py-1.5 rounded border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Restaurar a ordem original de fábrica"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Ordem Padrão</span>
                </button>
              </div>
            </div>

            {/* Aviso de Governança */}
            <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 rounded text-[11px] text-blue-950 dark:text-blue-300 leading-relaxed flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-[#134F9F] dark:text-blue-400" />
              <span>
                <strong>Governança de Acesso:</strong> As alterações são aplicadas instantaneamente no menu da esquerda. O item <strong>Configurações</strong> é protegido para garantir que o gestor sempre tenha acesso às diretrizes.
              </span>
            </div>

            {/* Lista Interativa de Itens */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 sm:p-3 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider px-2 pb-1 border-b border-slate-100 dark:border-slate-800">
                <span>Posição & Módulo</span>
                <span>Ações de Reordenação</span>
              </div>

              <div className="space-y-1.5">
                {localMenuConfig.map((item, index) => {
                  const isFirst = index === 0;
                  const isLast = index === localMenuConfig.length - 1;

                  return (
                    <div
                      key={item.id}
                      className={`flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 p-2.5 rounded-md border transition-all ${
                        item.isVisible
                          ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 shadow-2xs hover:border-blue-400/50'
                          : 'bg-slate-50/60 dark:bg-slate-950/40 border-dashed border-slate-200 dark:border-slate-800 opacity-60'
                      }`}
                    >
                      {/* Posição, Ícone e Nome */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="font-mono text-xs font-bold w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                          #{index + 1}
                        </span>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                              {item.label}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                              /{item.id}
                            </span>
                            {item.isLocked && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5" /> Fixo
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {item.isVisible ? '● Exibido no sidebar' : '○ Oculto da navegação'}
                          </span>
                        </div>
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                        {/* Toggle Visibilidade */}
                        <button
                          type="button"
                          disabled={item.isLocked}
                          onClick={() => handleToggleMenuVisibility(item.id)}
                          className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                            item.isLocked
                              ? 'text-slate-400 opacity-50 cursor-not-allowed'
                              : item.isVisible
                                ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
                                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-500'
                          }`}
                          title={item.isLocked ? 'Item obrigatório do sistema' : item.isVisible ? 'Ocultar item do menu' : 'Tornar item visível'}
                        >
                          {item.isVisible ? <Eye className="w-3.5 h-3.5 text-blue-500" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                          <span className="text-[11px] hidden sm:inline">{item.isVisible ? 'Visível' : 'Oculto'}</span>
                        </button>

                        <div className="h-4 w-px bg-slate-200 dark:border-slate-800" />

                        {/* Mover para Cima */}
                        <button
                          type="button"
                          disabled={isFirst}
                          onClick={() => handleMoveMenuItem(index, 'up')}
                          className="p-1.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#134F9F] dark:hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          title="Mover para cima (posição anterior)"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>

                        {/* Mover para Baixo */}
                        <button
                          type="button"
                          disabled={isLast}
                          onClick={() => handleMoveMenuItem(index, 'down')}
                          className="p-1.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#134F9F] dark:hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          title="Mover para baixo (próxima posição)"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Prévia da Barra Lateral */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs space-y-2">
              <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px] block">
                Prévia da Sequência Ativa no Sidebar:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {localMenuConfig.filter(m => m.isVisible).map((item, idx) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-[11px] font-medium shadow-2xs"
                  >
                    <span className="font-mono text-[9px] text-[#134F9F] dark:text-blue-400 font-bold">
                      {idx + 1}.
                    </span>
                    <span>{item.label}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ABA 6: HISTÓRICO & AUDITORIA DE CONFIGURAÇÕES            */}
        {/* ======================================================== */}
        {activeTab === 'audit-log' && (
          <div className="space-y-3">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <History className="w-4 h-4 text-[#134F9F] dark:text-blue-400" />
                  <span>Trilha de Auditoria e Governança de Configurações</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Rastreabilidade Mandatória</span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {auditLogs.map(log => (
                  <div key={log.id} className="py-2.5 flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 dark:text-slate-100 font-semibold">{log.user}</strong>
                        <span className="text-slate-400">·</span>
                        <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.2 rounded">
                          {log.section}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        {log.changeDescription}
                      </p>
                    </div>

                    <span className="font-mono text-[10px] text-slate-400 shrink-0">
                      {log.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: EDITAR REGRA EXISTENTE DO POP-TIN-017           */}
      {/* ======================================================== */}
      {editingRule && (
        <Modal
          isOpen={true}
          onClose={() => setEditingRule(null)}
          title={`Editar Regra: ${editingRule.id}`}
          subtitle="Ajuste os parâmetros operacionais, limiares e exceções aplicáveis"
        >
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Título da Regra</label>
              <input
                type="text"
                value={editingRule.title}
                onChange={(e) => setEditingRule({ ...editingRule, title: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Descrição & Fundamentação</label>
              <textarea
                value={editingRule.description}
                onChange={(e) => setEditingRule({ ...editingRule, description: e.target.value })}
                rows={2}
                className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Tolerância Horária (horas)</label>
                <input
                  type="number"
                  step="0.5"
                  value={editingRule.thresholdHours}
                  onChange={(e) => setEditingRule({ ...editingRule, thresholdHours: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Severidade Operacional</label>
                <select
                  value={editingRule.severity}
                  onChange={(e) => setEditingRule({ ...editingRule, severity: e.target.value as any })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100"
                >
                  <option value="CRITICA">CRÍTICA</option>
                  <option value="ALTA">ALTA</option>
                  <option value="MEDIA">MÉDIA</option>
                  <option value="BAIXA">BAIXA</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Camada de Conclusão / Evidência</label>
              <select
                value={editingRule.defaultEvidenceLevel}
                onChange={(e) => setEditingRule({ ...editingRule, defaultEvidenceLevel: e.target.value as EvidenceLevel })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100"
              >
                <option value="Fato confirmado">Fato confirmado</option>
                <option value="Indício de desconformidade">Indício de desconformidade</option>
                <option value="Verificação necessária">Verificação necessária</option>
                <option value="Desconformidade confirmada">Desconformidade confirmada</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Exceções Homologadas Aplicáveis</label>
              <textarea
                value={editingRule.applicableExceptions}
                onChange={(e) => setEditingRule({ ...editingRule, applicableExceptions: e.target.value })}
                rows={2}
                className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100"
                placeholder="Descreva situações em que a regra não gera não-conformidade..."
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingRule(null)}
                className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveEditedRule}
                className="px-4 py-1.5 font-semibold text-white bg-[#134F9F] hover:bg-blue-800 rounded cursor-pointer"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: CRIAR NOVA REGRA NO POP-TIN-017                 */}
      {/* ======================================================== */}
      {showNewRuleModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowNewRuleModal(false)}
          title="Homologar Nova Regra Operacional no POP-TIN-017"
          subtitle={`A nova regra receberá o código canônico POP-TIN-017-R${localPopSpec.rules.length + 1}`}
        >
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Título da Regra *</label>
              <input
                type="text"
                placeholder="Ex: Chamado sem categoria clínica atribuída em 2h"
                value={newRuleForm.title}
                onChange={(e) => setNewRuleForm({ ...newRuleForm, title: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Descrição e Justificativa *</label>
              <textarea
                placeholder="Descreva o procedimento operacional exigido e o critério de auditoria no GLPI..."
                value={newRuleForm.description}
                onChange={(e) => setNewRuleForm({ ...newRuleForm, description: e.target.value })}
                rows={2}
                className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Tolerância Horária (horas)</label>
                <input
                  type="number"
                  step="0.5"
                  value={newRuleForm.thresholdHours}
                  onChange={(e) => setNewRuleForm({ ...newRuleForm, thresholdHours: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Severidade Operacional</label>
                <select
                  value={newRuleForm.severity}
                  onChange={(e) => setNewRuleForm({ ...newRuleForm, severity: e.target.value as any })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100"
                >
                  <option value="CRITICA">CRÍTICA</option>
                  <option value="ALTA">ALTA</option>
                  <option value="MEDIA">MÉDIA</option>
                  <option value="BAIXA">BAIXA</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Camada de Conclusão / Evidência</label>
              <select
                value={newRuleForm.defaultEvidenceLevel}
                onChange={(e) => setNewRuleForm({ ...newRuleForm, defaultEvidenceLevel: e.target.value as EvidenceLevel })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100"
              >
                <option value="Fato confirmado">Fato confirmado</option>
                <option value="Indício de desconformidade">Indício de desconformidade</option>
                <option value="Verificação necessária">Verificação necessária</option>
                <option value="Desconformidade confirmada">Desconformidade confirmada</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Exceções Homologadas Aplicáveis</label>
              <textarea
                placeholder="Exceções justificadas que suspendem a geração de pendência..."
                value={newRuleForm.applicableExceptions}
                onChange={(e) => setNewRuleForm({ ...newRuleForm, applicableExceptions: e.target.value })}
                rows={2}
                className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowNewRuleModal(false)}
                className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!newRuleForm.title.trim()}
                onClick={handleCreateNewRule}
                className="px-4 py-1.5 font-semibold text-white bg-[#134F9F] hover:bg-blue-800 disabled:opacity-40 rounded cursor-pointer"
              >
                Homologar Regra
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: PUBLICAR NOVA VERSÃO DO POP-TIN-017             */}
      {/* ======================================================== */}
      {showNewVersionModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowNewVersionModal(false)}
          title={`Publicar Nova Versão do ${localPopSpec.code}`}
          subtitle={`Substituir a versão ${localPopSpec.version} vigente pela nova revisão oficial`}
        >
          <div className="space-y-3.5 text-xs">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 rounded leading-relaxed">
              <strong>Atenção de Governança:</strong> A publicação de uma nova versão atualizará automaticamente todos os relatórios, auditorias diárias de 04h e as diretrizes do Agente Gerencial.
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Novo Número da Versão *</label>
                <input
                  type="text"
                  placeholder="Ex: v2.5 ou v3.0"
                  value={newVersionForm.version}
                  onChange={(e) => setNewVersionForm({ ...newVersionForm, version: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100 font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Data de Início da Vigência *</label>
                <input
                  type="text"
                  placeholder="DD/MM/AAAA"
                  value={newVersionForm.effectiveDate}
                  onChange={(e) => setNewVersionForm({ ...newVersionForm, effectiveDate: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Responsável / Órgão Homologador *</label>
              <input
                type="text"
                value={newVersionForm.homologatedBy}
                onChange={(e) => setNewVersionForm({ ...newVersionForm, homologatedBy: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Notas de Homologação / Sumário de Mudanças *</label>
              <textarea
                value={newVersionForm.changeNotes}
                onChange={(e) => setNewVersionForm({ ...newVersionForm, changeNotes: e.target.value })}
                rows={3}
                placeholder="Descreva as alterações aprovadas em ata pela Diretoria de TI..."
                className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowNewVersionModal(false)}
                className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!newVersionForm.version.trim()}
                onClick={handlePublishNewVersion}
                className="px-4 py-1.5 font-semibold text-white bg-[#134F9F] hover:bg-blue-800 disabled:opacity-40 rounded cursor-pointer"
              >
                Confirmar Publicação de Versão
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
