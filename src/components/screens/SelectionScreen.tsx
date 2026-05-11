import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Play } from 'lucide-react';
import { Language, GameMode, GameState } from '../../types';

interface SelectionScreenProps {
  language: Language;
  selectedLevel: number | 'all';
  setSelectedLevel: (level: number | 'all') => void;
  selectedLesson: string;
  setSelectedLesson: (lesson: string) => void;
  availableLessons: string[];
  errorMessage: string;
  setErrorMessage: (msg: string) => void;
  setGameState: (state: GameState) => void;
  gameMode: GameMode;
  startNewGame: (mode: GameMode, level: number | 'all', lesson?: string) => void;
}

export function SelectionScreen({
  language,
  selectedLevel,
  setSelectedLevel,
  selectedLesson,
  setSelectedLesson,
  availableLessons,
  errorMessage,
  setErrorMessage,
  setGameState,
  gameMode,
  startNewGame
}: SelectionScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#E4E3E0] p-6">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-4xl w-full bg-white border-4 border-[#141414] p-6 shadow-[12px_12px_0px_0px_rgba(20,20,20,1)]"
      >
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setGameState('start')} className="p-2 hover:bg-gray-100 rounded-full border-2 border-[#141414]">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-3xl font-black text-[#141414] uppercase italic tracking-tighter">
            {language === 'en' ? 'Choose Mission' : 'Даалгавараа сонгох'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#F27D26] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#F27D26] text-[#141414] flex items-center justify-center text-[10px]">1</span>
              {language === 'en' ? 'Select Level' : 'Түвшин сонгох'}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map(lvl => (
                <motion.button
                  key={lvl}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedLevel(lvl);
                    setSelectedLesson("");
                    setErrorMessage("");
                  }}
                  className={`py-3 text-xl font-black border-4 border-[#141414] transition-all rounded-xl shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] cursor-pointer ${selectedLevel === lvl ? 'bg-[#F27D26] text-[#141414]' : 'bg-white hover:bg-gray-50'}`}
                >
                  YCT {lvl}
                </motion.button>
              ))}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedLevel('all');
                  setSelectedLesson("");
                  setErrorMessage("");
                }}
                className={`col-span-3 py-3 text-lg font-black border-4 border-[#141414] transition-all rounded-xl shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] cursor-pointer ${selectedLevel === 'all' ? 'bg-[#141414] text-white' : 'bg-white hover:bg-gray-50'}`}
              >
                Mixed Challenges
              </motion.button>
            </div>
          </div>

          <div className={`space-y-4 transition-all ${selectedLevel === 'all' ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
            <h3 className="text-sm font-black uppercase tracking-widest text-[#00FF00] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#00FF00] text-[#141414] flex items-center justify-center text-[10px]">2</span>
              Select Lesson
            </h3>
            <div className="grid grid-cols-3 gap-3 max-h-[340px] overflow-y-auto pr-2 custom-scrollbar p-1">
              {availableLessons.map(lessonStr => {
                const num = parseInt(lessonStr.replace(/\D/g, ''));
                const isReview = (selectedLevel !== 'all' && Number(selectedLevel) <= 4 && num === 12) || 
                                 (selectedLevel !== 'all' && Number(selectedLevel) >= 5 && num === 15);
                return (
                  <motion.button
                    key={lessonStr}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedLesson(lessonStr);
                      setErrorMessage("");
                    }}
                    className={`py-4 text-base md:text-lg font-black border-2 border-[#141414] transition-all rounded-lg shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] cursor-pointer ${selectedLesson === lessonStr ? 'bg-[#00FF00] text-[#141414]' : 'bg-white hover:bg-gray-50'}`}
                  >
                    {isReview ? (language === 'en' ? "Review" : "Давтах") : (language === 'en' ? `L${num}` : `Х${num}`)}
                  </motion.button>
                );
              })}
              {selectedLevel !== 'all' && availableLessons.length === 0 && (
                <div className="col-span-3 py-8 text-center text-gray-400 font-bold italic">
                  {language === 'en' ? 'No lessons available for this level yet.' : 'Энэ түвшинд одоогоор хичээл байхгүй байна.'}
                </div>
              )}
            </div>
          </div>
        </div>

        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-4 bg-red-100 border-4 border-red-500 text-red-700 font-black text-center uppercase tracking-tight"
          >
            {errorMessage}
          </motion.div>
        )}

        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <motion.button 
            whileHover={!( !selectedLevel || (selectedLevel !== 'all' && !selectedLesson) ) ? { scale: 1.02 } : {}}
            whileTap={!( !selectedLevel || (selectedLevel !== 'all' && !selectedLesson) ) ? { scale: 0.98 } : {}}
            disabled={!selectedLevel || (selectedLevel !== 'all' && !selectedLesson)}
            onClick={() => startNewGame(gameMode, selectedLevel, selectedLesson)}
            className={`flex-1 ${(!selectedLevel || (selectedLevel !== 'all' && !selectedLesson)) ? 'bg-gray-400 text-gray-600' : 'bg-[#00FF00] text-[#141414] cursor-pointer'} py-6 text-2xl font-black uppercase tracking-widest border-4 border-[#141414] shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] hover:bg-[#F27D26] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:translate-x-1 active:translate-y-1 active:shadow-none relative overflow-hidden`}
          >
            <div className="relative z-10 flex items-center justify-center gap-3">
              <Play className="w-6 h-6 fill-current" />
              Start Mission
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
