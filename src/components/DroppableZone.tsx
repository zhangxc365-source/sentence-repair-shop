import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableZoneProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function DroppableZone({ id, children, className }: DroppableZoneProps) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={className}>
      {children}
    </div>
  );
}
