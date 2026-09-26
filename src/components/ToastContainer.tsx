import React from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToast } from '../context/AppContext';

const iconMap = {
  success: <CheckCircle className="w-5 h-5 text-sage-600" />,
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
};

const bgMap = {
  success: 'bg-white border-sage-200',
  error: 'bg-white border-red-200',
  info: 'bg-white border-blue-200',
  warning: 'bg-white border-amber-200',
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-premium animate-slide-up ${bgMap[toast.type]}`}
        >
          <div className="flex-shrink-0 mt-0.5">{iconMap[toast.type]}</div>
          <p className="text-sm font-medium text-charcoal-800 flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
