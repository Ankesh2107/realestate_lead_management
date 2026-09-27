import React from 'react';

export function TabButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 18px',
        borderRadius: '8px',
        border: 'none',
        background: active ? '#3b82f6' : 'transparent',
        color: active ? '#fff' : '#9ca3af',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {icon} {label}
    </button>
  );
}
