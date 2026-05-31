'use client';

import { ReactNode } from 'react';

interface CardsGridProps {
  children: ReactNode;
  className?: string;
}

/**
 * Responsive centered grid for gym detail cards (classes, plans, etc.)
 */
export default function CardsGrid({ children, className = '' }: CardsGridProps) {
  return <div className={`cards-grid ${className}`.trim()}>{children}</div>;
}
