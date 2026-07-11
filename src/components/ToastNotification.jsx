import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export default function ToastNotification({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  return (
    <div className={`toast ${toast.type || 'info'}`}>
      <span className="toast-icon">{getIcon()}</span>
      <div className="toast-message-wrap">
        <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{toast.title}</p>
        <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>{toast.message}</p>
      </div>
      <button 
        onClick={() => onClose(toast.id)} 
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          opacity: 0.7
        }}
      >
        <X size={16} />
      </button>
      <div 
        className="toast-progress" 
        style={{
          animation: `shrinkWidth ${toast.duration || 4000}ms linear forwards`
        }}
      />
    </div>
  );
}

// Add CSS animation dynamically if not present
const styleSheet = document.styleSheets[0];
try {
  styleSheet.insertRule(`
    @keyframes shrinkWidth {
      from { width: 100%; }
      to { width: 0%; }
    }
  `, styleSheet.cssRules.length);
} catch (e) {
  // Silent fallback
}
