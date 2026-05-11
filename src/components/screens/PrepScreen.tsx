import React from 'react';
import { motion } from 'motion/react';
import { Sentence, Language } from '../../types';

interface PrepScreenProps {
  language: Language;
  currentRoundSentences: Sentence[];
  onStartPlaying: () => void;
}

export function PrepScreen({ language, currentRoundSentences, onStartPlaying }: PrepScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#E4E3E0] p-8">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-5xl w-full bg-white border-4 border-[#141414] p-10 shadow-[12px_12px_0px_0px_rgba(20,20,20,1)]"
      >
        <h2 className="text-4xl font-black mb-4 uppercase italic border-b-4 border-[#141414] pb-4 tracking-tighter">
          Mission Briefing
        </h2>
        <p className="text-gray-500 mb-8 font-serif italic text-lg decoration-wavy underline decoration-[#F27D26] underline-offset-4">
          Review the {currentRoundSentences.length} target components before repairing the toys.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {currentRoundSentences.map((s, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 border-2 border-[#141414] hover:bg-white transition-colors relative group rounded-lg">
              <span className="w-10 h-10 flex items-center justify-center bg-[#141414] text-white font-black italic rounded-lg shrink-0 group-hover:bg-[#F27D26] group-hover:text-[#141414] transition-colors text-lg">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-3xl font-black text-[#141414] mb-1">{s.chinese}</p>
                <div className="flex flex-col">
                  <p className="text-sm font-bold text-[#F27D26] mb-1">{s.parts.map(p => p.pinyin).join(' ').toLowerCase()}</p>
                  <p className="text-base font-medium text-gray-500 italic">"{language === 'en' ? s.english : s.mongolian}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStartPlaying}
          className="w-full bg-[#00FF00] text-[#141414] py-6 text-3xl font-black uppercase tracking-[0.2em] border-4 border-[#141414] hover:bg-[#F27D26] transition-all shadow-[8px_8px_0px_0px_rgba(202,202,202,1)] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer"
        >
          {language === 'en' ? 'Check Toys' : 'Тоглоомыг шалгах'}
        </motion.button>
      </motion.div>
    </div>
  );
}
