import React from 'react';
import { motion } from 'motion/react';

interface MenuButtonProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
  textColor?: string;
}

export function MenuButton({ icon, label, color, onClick, textColor = 'text-white' }: MenuButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, rotate: -1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${color} ${textColor} p-8 rounded-2xl border-4 border-[#141414] shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] flex flex-col items-center gap-4 transition-all hover:shadow-none hover:translate-x-1 hover:translate-y-1 group`}
    >
      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
        {React.cloneElement(icon as React.ReactElement, { className: 'w-10 h-10' })}
      </div>
      <span className="text-2xl font-black uppercase italic tracking-tighter">{label}</span>
    </motion.button>
  );
}
