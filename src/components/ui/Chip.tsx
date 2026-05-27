import React from 'react';

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  isActive?: boolean;
  muted?: boolean;
  count?: number;
}

export function Chip({
  label,
  isActive = false,
  muted = false,
  count,
  className = '',
  ...props
}: ChipProps) {
  const baseClass = 'chip';
  const stateClass = muted ? 'chip-muted' : isActive ? 'is-active' : '';

  return (
    <button
      className={`${baseClass} ${stateClass} ${className}`.trim()}
      {...props}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className="text-xs font-mono ml-1 opacity-60">{count}</span>
      )}
    </button>
  );
}
