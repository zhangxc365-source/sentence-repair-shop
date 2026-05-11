import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableItemProps {
  id: string;
  part: { text: string; pinyin: string };
  onRemove: (id: string) => void;
}

export const SortableItem = React.memo(({ id, part, onRemove }: SortableItemProps) => {
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
    zIndex: isDragging ? 100 : 1,
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
        onRemove(id);
      }}
      className="w-32 h-24 bg-white border-4 border-[#141414] rounded-xl flex flex-col items-center justify-center cursor-pointer active:cursor-grabbing shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] relative group"
    >
      <div className="absolute top-1 right-1 opacity-20 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-4 h-4" />
      </div>
      <span className="text-base font-bold text-gray-400">{part?.pinyin?.toLowerCase() || ''}</span>
      <span className="text-4xl font-black text-[#141414]">{part.text}</span>
    </div>
  );
});
