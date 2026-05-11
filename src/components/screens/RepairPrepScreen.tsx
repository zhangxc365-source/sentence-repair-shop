import React from 'react';
import { motion } from 'motion/react';
import { Wrench } from 'lucide-react';
import { TOYS } from '../../constants';

interface RepairPrepScreenProps {
  toy1: any;
  toy2: any;
  onStart: () => void;
}

export function RepairPrepScreen({ toy1, toy2, onStart }: RepairPrepScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#E4E3E0] p-8">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-4xl w-full bg-white border-4 border-[#141414] p-8 shadow-[12px_12px_0px_0px_rgba(20,20,20,1)] text-center"
      >
        <div className={`grid ${toy2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-8 mb-8`}>
            <div className="flex flex-col items-center">
              <div className={`w-full aspect-square md:h-64 ${toy1.color} border-4 border-[#141414] flex items-center justify-center relative overflow-hidden mb-4`}>
                <img src={toy1.brokenImg} alt={toy1.name} className={`max-h-full max-w-full object-contain p-4 ${toy1.id >= 7 ? 'scale-150' : ''}`} />
                <div className="absolute top-2 left-2 bg-[#F27D26] text-white text-[12px] font-black px-3 py-1 uppercase">{toy2 ? 'P1 Toy' : 'Broken Toy'}</div>
              </div>
              <span className="text-2xl font-black uppercase tracking-widest">{toy1.name}</span>
            </div>
            {toy2 && (
              <div className="flex flex-col items-center">
                <div className={`w-full aspect-square md:h-64 ${toy2.color} border-4 border-[#141414] flex items-center justify-center relative overflow-hidden mb-4`}>
                  <img src={toy2.brokenImg} alt={toy2.name} className={`max-h-full max-w-full object-contain p-4 ${toy2.id >= 7 ? 'scale-150' : ''}`} />
                  <div className="absolute top-2 left-2 bg-[#00FF00] text-[#141414] text-[12px] font-black px-3 py-1 uppercase">P2 Toy</div>
                </div>
                <span className="text-2xl font-black uppercase tracking-widest">{toy2.name}</span>
              </div>
            )}
          </div>
        
        <h3 className="text-3xl font-black uppercase italic mb-2 tracking-tighter">Broken Piece Detected!</h3>
        <p className="text-gray-500 mb-8 font-serif italic text-lg decoration-wavy underline decoration-[#F27D26] underline-offset-4">
          Structural repair required for toy components.
        </p>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="w-full bg-[#141414] text-white py-5 text-2xl font-black uppercase tracking-[0.2em] border-4 border-[#141414] hover:bg-[#F27D26] hover:text-[#141414] transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <Wrench className="w-8 h-8" />
          START REPAIR
        </motion.button>
      </motion.div>
    </div>
  );
}
