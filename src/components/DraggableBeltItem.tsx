import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DraggableBeltItemProps {
  id: string;
  part: { text: string; pinyin: string };
  onClick: () => void;
}

export const DraggableBeltItem = React.memo(({ id, part, onClick }: DraggableBeltItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    touchAction: 'none'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        if (isDragging) return;
        onClick();
      }}
      className="w-28 h-20 bg-white border-4 border-[#141414] rounded-lg flex flex-col items-center justify-center cursor-pointer shadow-[4px_4px_0px_0px_rgba(242,125,38,1)] shrink-0"
    >
      <span className="text-sm font-bold text-gray-400">{part?.pinyin?.toLowerCase() || ''}</span>
      <span className="text-3xl font-black text-[#141414]">{part.text}</span>
    </div>
  );
});
