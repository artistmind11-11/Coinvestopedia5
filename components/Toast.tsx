import React from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { cn } from '../utils/helpers';

interface ToastItemProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: (id: string) => void;
}

const ToastItem = ({ id, message, type, onClose }: ToastItemProps) => {
  const baseClasses =
    'flex items-start gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm animate-slide-in-up';

  const typeClasses = {
    success: 'bg-green-500/10 border-green-500/30 text-green-400',
    error: 'bg-red-500/10 border-red-500/30 text-red-400',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  };

  const icons = {
    success: <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />,
    error: <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />,
    warning: <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />,
    info: <Info size={20} className="flex-shrink-0 mt-0.5" />,
  };

  return (
    <div
      className={cn(baseClasses, typeClasses[type])}
      role="alert"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
          onClose(id);
        }
      }}
    >
      {icons[type]}
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 mt-0.5 hover:opacity-70 transition-opacity"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useAppContext();

  return (
    <div
      className="fixed bottom-4 right-4 z-notification max-w-md space-y-2"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;