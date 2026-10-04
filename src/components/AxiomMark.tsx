import React from 'react';

export function AxiomMark({
  size = 28,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-label="AXIOM"
      role="img"
    >
      <path
        d="M20 4L34 34H27.8L24.9 27.1H15.1L12.2 34H6L20 4Z"
        fill="currentColor"
      />
      <path
        d="M14.1 22.4H25.9"
        stroke="#D72F40"
        strokeWidth="2.2"
      />
      <path
        d="M16.7 22.4L20 14.2L23.3 22.4"
        stroke="#F5F1E6"
        strokeWidth="2.2"
      />
    </svg>
  );
}
