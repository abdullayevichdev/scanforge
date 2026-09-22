import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message?: string;
}

export type ToastItem = ToastMessage;

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      onDismiss(toasts[0].id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toasts, onDismiss]);

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-[11000] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let Icon = CheckCircle2;
          let iconColor = 'text-emerald-500';
          let borderColor = 'border-emerald-500/30';

          if (toast.type === 'warning') {
            Icon = AlertTriangle;
            iconColor = 'text-amber-500';
            borderColor = 'border-amber-500/30';
          } else if (toast.type === 'info') {
            Icon = Info;
            iconColor = 'text-[#1FD0C2]';
            borderColor = 'border-[#1FD0C2]/30';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -16, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.92 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              layout
              className={`pointer-events-auto liquid-glass-elevated bg-white/95 backdrop-blur-xl border ${borderColor} rounded-[20px] p-4 shadow-2xl flex items-start gap-3`}
            >
              <div className="p-1.5 rounded-full bg-white shadow-sm shrink-0 mt-0.5">
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-[#0A143A] leading-tight">
                  {toast.title}
                </h4>
                {toast.message && (
                  <p className="text-[11px] text-[#4A577D] mt-0.5 leading-snug">
                    {toast.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="text-[#4A577D] hover:text-[#0A143A] p-1 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
