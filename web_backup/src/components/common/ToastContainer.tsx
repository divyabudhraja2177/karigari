import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
        width: 'calc(100% - 48px)',
        pointerEvents: 'none'
      }}
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        const borderColor = isSuccess ? 'var(--sage-green)' : isError ? '#D8A7AD' : 'var(--light-border)';
        const bgIconColor = isSuccess ? 'var(--sage-green)' : isError ? 'var(--dusty-pink-dark)' : 'var(--deep-brown)';

        return (
          <div
            key={toast.id}
            className="animate-fade-in"
            style={{
              pointerEvents: 'auto',
              background: 'var(--white)',
              border: `1.5px solid ${borderColor}`,
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              position: 'relative'
            }}
          >
            {isSuccess && <CheckCircle2 size={20} color={bgIconColor} style={{ flexShrink: 0 }} />}
            {isError && <AlertCircle size={20} color={bgIconColor} style={{ flexShrink: 0 }} />}
            {!isSuccess && !isError && <Info size={20} color={bgIconColor} style={{ flexShrink: 0 }} />}

            <div style={{ flex: 1, fontSize: '14px', fontWeight: 500, color: 'var(--deep-brown)', lineHeight: 1.4 }}>
              {toast.message}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--muted-grey)',
                padding: '4px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
