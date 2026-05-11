import React from 'react';
import { motion } from 'motion/react';
import { Wrench, Play, Trophy, Info } from 'lucide-react';
import { MenuButton } from '../MenuButton';
import { Language, GameMode, GameState } from '../../types';

interface StartScreenProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  setGameMode: (mode: GameMode) => void;
  setGameState: (state: GameState) => void;
}

export function StartScreen({ language, setLanguage, setGameMode, setGameState }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#E4E3E0] p-6 font-sans">
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center mb-4">
          <Wrench className="w-16 h-16 text-[#141414] mr-4" />
          <h1 className="text-6xl font-black text-[#141414] tracking-tighter uppercase italic">
            Sentence Repair Shop
          </h1>
        </div>
        <p className="text-xl text-[#141414] opacity-60 font-serif italic">
          Fix the broken grammar, save the factory!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-8">
        <MenuButton 
          icon={<Play />} 
          label="Solo Mode" 
          color="bg-[#F27D26]" 
          onClick={() => { setGameMode('solo'); setGameState('selection'); }} 
        />
        <MenuButton 
          icon={<Trophy />} 
          label="PK Mode" 
          color="bg-[#00FF00]" 
          textColor="text-black"
          onClick={() => { setGameMode('pk'); setGameState('selection'); }} 
        />
        <MenuButton 
          icon={<Info />} 
          label="Introduction" 
          color="bg-[#141414]" 
          onClick={() => setGameState('intro')} 
        />
      </div>

      <div className="flex gap-4">
        {(['en', 'mn'] as const).map((lang) => (
          <button 
            key={lang}
            onClick={() => setLanguage(lang as Language)}
            className={`px-6 py-3 rounded-xl border-4 border-[#141414] font-black uppercase transition-all ${language === lang ? 'bg-[#141414] text-white shadow-[4px_4px_0px_0px_rgba(202,202,202,1)]' : 'bg-white text-[#141414]'}`}
          >
            {lang === 'en' ? 'English' : 'Монгол'}
          </button>
        ))}
      </div>
    </div>
  );
}
