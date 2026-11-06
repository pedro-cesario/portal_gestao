/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HEAL Ops — DetailDrawer (Drawer Lateral para Nível 2 — Análise e Nível 3 — Evidência)
 * Atende ao contrato de UX: revelação progressiva, suporte ao teclado (ESC), rolagem natural interna
 */

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  widthClass?: string; // padrão max-w-2xl ou max-w-3xl
  footerActions?: React.ReactNode;
}

export const DetailDrawer: React.FC<DetailDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  children,
  widthClass = 'max-w-2xl',
  footerActions,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Fechamento com tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-6">
        <div 
          ref={drawerRef}
          className={`w-screen ${widthClass} bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between transform transition ease-in-out duration-250`}
        >
          {/* Header */}
          <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#134F9F] dark:text-blue-400">
                  Nível 2 — Análise e Evidências
                </span>
                {badge}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Fechar gaveta analítica (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-5">
            {children}
          </div>

          {/* Optional Footer */}
          {footerActions && (
            <div className="px-4 sm:px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 shrink-0 flex items-center justify-end gap-2.5">
              {footerActions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
