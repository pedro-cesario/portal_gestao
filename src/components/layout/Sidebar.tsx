/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — Sidebar de Navegação Executiva
 * Totalmente adaptada para Desktop, Tablet e Celular (Drawer Off-Canvas)
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Ticket as TicketIcon, 
  Users, 
  AlertCircle, 
  ShieldCheck, 
  BarChart3, 
  Bot, 
  FileSpreadsheet, 
  Layers, 
  Settings, 
  Moon, 
  Sun,
  LogOut,
  Hospital,
  X,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { NavigationRoute, CurrentUser, NavMenuItemConfig } from '../../types';

interface SidebarProps {
  currentRoute: NavigationRoute;
  onRouteChange: (route: NavigationRoute) => void;
  currentUser: CurrentUser;
  onSwitchUser: (user: CurrentUser) => void;
  allUsers: CurrentUser[];
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
  unassignedCount: number;
  pendingAlertsCount: number;
  dataSource: 'REALTIME' | 'SNAPSHOT_04H';
  onToggleDataSource: () => void;
  menuConfig?: NavMenuItemConfig[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const ROUTE_ICONS: Record<NavigationRoute, React.ElementType> = {
  'visao-geral': LayoutDashboard,
  'chamados': TicketIcon,
  'equipe': Users,
  'pendencias': AlertCircle,
  'auditorias': ShieldCheck,
  'indicadores': BarChart3,
  'agente-gerencial': Bot,
  'daily-paineis': FileSpreadsheet,
  'templates': Layers,
  'configuracoes': Settings,
};

const DEFAULT_ITEMS: { id: NavigationRoute; label: string }[] = [
  { id: 'visao-geral', label: 'Visão Geral' },
  { id: 'chamados', label: 'Chamados GLPI' },
  { id: 'equipe', label: 'Equipe Técnica' },
  { id: 'pendencias', label: 'Pendências & POP' },
  { id: 'auditorias', label: 'Auditorias (04h)' },
  { id: 'indicadores', label: 'Indicadores' },
  { id: 'agente-gerencial', label: 'Agente Gerencial' },
  { id: 'daily-paineis', label: 'Daily e Painéis' },
  { id: 'templates', label: 'Catálogo de Templates' },
  { id: 'configuracoes', label: 'Configurações' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onRouteChange,
  currentUser,
  onSwitchUser,
  allUsers,
  isDarkMode,
  onToggleTheme,
  onLogout,
  unassignedCount,
  pendingAlertsCount,
  dataSource,
  onToggleDataSource,
  menuConfig,
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const effectiveConfig = (menuConfig && menuConfig.length > 0)
    ? menuConfig.filter(m => m.isVisible || m.id === 'configuracoes')
    : DEFAULT_ITEMS;

  const navItems = effectiveConfig.map(cfg => {
    const isChamados = cfg.id === 'chamados';
    const isPendencias = cfg.id === 'pendencias';
    return {
      id: cfg.id,
      label: cfg.label,
      icon: ROUTE_ICONS[cfg.id] || LayoutDashboard,
      badgeCount: isChamados ? unassignedCount : isPendencias ? pendingAlertsCount : undefined,
      badgeAlert: isChamados ? unassignedCount > 0 : isPendencias ? pendingAlertsCount > 0 : false,
    };
  });

  const handleNavClick = (route: NavigationRoute) => {
    onRouteChange(route);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Overlay Backdrop para Mobile e Tablet */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer: Off-canvas no Mobile/Tablet, Fixo/Recolhível no Desktop */}
      <aside 
        className={`
          fixed lg:static top-0 bottom-0 left-0 z-50
          ${isCollapsed ? 'lg:w-16 w-72' : 'lg:w-64 w-72'} h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
          text-slate-700 dark:text-slate-300 flex flex-col justify-between shrink-0 select-none 
          transition-all duration-200 ease-in-out
          ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Top Brand Header */}
        <div>
          <div className={`border-b border-slate-200 dark:border-slate-800 flex items-center ${isCollapsed ? 'p-3 flex-col gap-2' : 'p-4 justify-between'}`}>
            <div className={`flex items-center ${isCollapsed ? 'flex-col gap-1.5' : 'gap-2.5'}`}>
              <div 
                onClick={isCollapsed && onToggleCollapse ? onToggleCollapse : undefined}
                className={`w-8 h-8 rounded bg-[#134F9F] flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0 ${isCollapsed ? 'cursor-pointer hover:bg-blue-800' : ''}`}
                title={isCollapsed ? 'Clique para expandir o menu lateral' : undefined}
              >
                <Hospital className="w-4 h-4" />
              </div>
              {!isCollapsed && (
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight">HEAL Ops</span>
                    <span className="text-[10px] font-semibold text-[#134F9F] dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">TI</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Instituto HEAL Hospitalar</p>
                </div>
              )}
            </div>

            {/* Botão de Recolher/Expandir no Desktop */}
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="hidden lg:flex p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={isCollapsed ? "Expandir barra lateral" : "Recolher barra lateral"}
              >
                {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
              </button>
            )}

            {/* Botão de Fechar Drawer no Mobile/Tablet */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Data Source & Clock Bar */}
          <div className={`bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800/80 text-[11px] ${isCollapsed ? 'p-2 flex flex-col items-center gap-1' : 'px-4 py-2 space-y-1'}`}>
            {isCollapsed ? (
              <button
                type="button"
                onClick={onToggleDataSource}
                className={`w-7 h-7 rounded flex items-center justify-center font-mono text-[11px] font-bold transition-colors cursor-pointer ${
                  dataSource === 'REALTIME' 
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25' 
                    : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 hover:bg-blue-500/25'
                }`}
                title={`Fonte Ativa: ${dataSource} (Clique para alternar)`}
              >
                {dataSource === 'REALTIME' ? '●' : '◷'}
              </button>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Fonte ativa:</span>
                  <button
                    type="button"
                    onClick={onToggleDataSource}
                    className={`font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                      dataSource === 'REALTIME' 
                        ? 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20' 
                        : 'bg-blue-500/10 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20'
                    }`}
                    title="Clique para alternar entre dados em tempo real e snapshot oficial 04h"
                  >
                    {dataSource === 'REALTIME' ? '● REALTIME' : '◷ SNAPSHOT 04H'}
                  </button>
                </div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>Horário BRT:</span>
                  <span className="font-mono text-[10px] text-slate-700 dark:text-slate-300">10:10 (Brasília)</span>
                </div>
              </>
            )}
          </div>

          {/* Navigation Items */}
          <nav className={`space-y-0.5 overflow-y-auto max-h-[calc(100vh-17rem)] ${isCollapsed ? 'p-1.5' : 'p-2'}`} aria-label="Navegação Principal">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  title={item.label}
                  className={`w-full rounded-md text-xs font-medium transition-colors cursor-pointer relative ${
                    isCollapsed 
                      ? 'p-2.5 flex items-center justify-center' 
                      : 'flex items-center justify-between px-3 py-2.5'
                  } ${
                    isActive
                      ? 'bg-[#134F9F] text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5 min-w-0'}`}>
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {item.badgeCount !== undefined && item.badgeCount > 0 && (
                    isCollapsed ? (
                      <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${
                        isActive ? 'bg-white' : item.badgeAlert ? 'bg-rose-500 ring-2 ring-white dark:ring-slate-900' : 'bg-slate-400'
                      }`} />
                    ) : (
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : item.badgeAlert 
                            ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}>
                        {item.badgeCount}
                      </span>
                    )
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile, Theme and System Health */}
        <div className={`border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 ${isCollapsed ? 'p-2 space-y-2 flex flex-col items-center' : 'p-3 space-y-2'}`}>
          {isCollapsed ? (
            <>
              {/* Collapsed Avatar Circle */}
              <div 
                className="w-8 h-8 rounded-full bg-blue-500/15 text-[#134F9F] dark:text-blue-300 font-bold text-xs flex items-center justify-center cursor-pointer border border-blue-200 dark:border-blue-800"
                title={`${currentUser.name} (${currentUser.role}) — ${currentUser.department}`}
              >
                {currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>

              {/* Theme & Logout Icons */}
              <button
                type="button"
                onClick={onToggleTheme}
                className="p-1.5 rounded text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={isDarkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-600" />}
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 rounded text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Sair da sessão"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              {/* User Switcher for Testing Profiles */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-2 shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Perfil Ativo</span>
                  <span className="text-[10px] font-semibold text-[#134F9F] dark:text-blue-400 bg-blue-500/10 px-1 rounded">
                    {currentUser.role}
                  </span>
                </div>
                <select
                  value={currentUser.id}
                  onChange={(e) => {
                    const u = allUsers.find(x => x.id === e.target.value);
                    if (u) onSwitchUser(u);
                  }}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  {allUsers.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                  {currentUser.department}
                </div>
              </div>

              {/* Controls row */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2 py-1 rounded hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                  title="Alternar entre modo escuro e claro"
                >
                  {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-blue-600" />}
                  <span className="text-[11px]">{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 px-2 py-1 rounded hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                  title="Sair da sessão"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Sair</span>
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
};
