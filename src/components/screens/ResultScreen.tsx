import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Home, RotateCcw, ChevronLeft, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Language, GameResult } from '../../types';
import { TOYS } from '../../constants';

interface ResultScreenProps {
  language: Language;
  results: GameResult[];
  score: number;
  score2: number;
  gameMode: string;
  timeLeft: number;
  finishTime1: number | null;
  finishTime2: number | null;
  lives: number;
  lives2: number;
  onRestart: () => void;
  onHome: () => void;
  onNextLevel: () => void;
}

export function ResultScreen({
  language,
  results,
  score,
  score2,
  gameMode,
  timeLeft,
  finishTime1,
  finishTime2,
  lives,
  lives2,
  onRestart,
  onHome,
  onNextLevel
}: ResultScreenProps) {
  const p1Results = results.filter(r => r.playerNum === 1 || !r.playerNum);
  const p2Results = results.filter(r => r.playerNum === 2);
  const correctCount1 = p1Results.filter(r => r.isCorrect).length;
  const correctCount2 = p2Results.filter(r => r.isCorrect).length;
  
  const isWin = lives > 0 && timeLeft > 0;
  
  let winner: 1 | 2 | 0 = 0;
  if (gameMode === 'pk') {
    if (correctCount1 > correctCount2) winner = 1;
    else if (correctCount2 > correctCount1) winner = 2;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#E4E3E0] p-6 lg:p-12 overflow-y-auto">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-6xl w-full bg-white border-4 border-[#141414] p-8 lg:p-12 shadow-[16px_16px_0px_0px_rgba(20,20,20,1)] relative overflow-hidden"
      >
        {/* Banner Decors */}
        <div className="absolute top-0 left-0 w-full h-4 bg-[#F27D26]" />
        <div className="absolute top-4 left-0 w-full h-1 bg-[#141414]" />

        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-[#F27D26] border-4 border-[#141414] rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] -rotate-3">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-5xl font-black text-[#141414] uppercase italic tracking-tighter leading-none">
                Mission Over
              </h2>
              <p className="text-xl text-[#F27D26] font-black uppercase tracking-widest mt-1">
                Repair Summary
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRestart}
              className="bg-white border-4 border-[#141414] p-4 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:bg-gray-100 transition-colors"
            >
              <RotateCcw className="w-8 h-8" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onHome}
              className="bg-white border-4 border-[#141414] p-4 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:bg-gray-100 transition-colors"
            >
              <Home className="w-8 h-8" />
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Player 1 Stats */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b-4 border-[#141414] pb-4">
              <h3 className="text-2xl font-black uppercase italic text-[#F27D26]">P1 Shift Report</h3>
              <div className="flex bg-[#141414] text-white px-4 py-1 font-black text-sm uppercase italic">
                {lives <= 0 ? 'MIA' : (gameMode === 'pk' && winner === 1 ? 'WINNER' : 'COMPLETE')}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 border-2 border-[#141414] p-4">
                <span className="block text-[10px] font-black uppercase opacity-40 mb-1">Total Score</span>
                <span className="text-4xl font-black tabular-nums">{score}</span>
              </div>
              <div className="bg-gray-50 border-2 border-[#141414] p-4">
                <span className="block text-[10px] font-black uppercase opacity-40 mb-1">Fixed Parts</span>
                <span className="text-4xl font-black tabular-nums">{correctCount1}/{p1Results.length}</span>
              </div>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {p1Results.map((r, i) => (
                <div key={i} className={`flex items-center gap-4 p-3 border-2 ${r.isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'} rounded-xl`}>
                  <div className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-lg border-2 border-[#141414] ${r.isCorrect ? 'bg-[#00FF00]' : 'bg-red-500'}`}>
                    {r.isCorrect ? <CheckCircle2 className="w-4 h-4 text-[#141414]" /> : <XCircle className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-5xl truncate">{r.userOrder.join('')}</p>
                    {!r.isCorrect && <p className="text-2xl text-gray-500 truncate font-medium">Target: {r.sentence.chinese}</p>}
                  </div>
                  <div className="w-10 h-10 shrink-0 bg-white border-2 border-[#141414] rounded-lg p-1">
                    <img 
                      src={r.isCorrect ? TOYS[r.toyIndex || 0].fixedImg : TOYS[r.toyIndex || 0].brokenImg} 
                      alt="toy" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Player 2 Stats / Shared Stats */}
          {gameMode === 'pk' || gameMode === 'coop' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b-4 border-[#141414] pb-4">
                <h3 className="text-2xl font-black uppercase italic text-[#00FF00]">P2 Shift Report</h3>
                <div className="flex bg-[#141414] text-white px-4 py-1 font-black text-sm uppercase italic">
                  {lives2 <= 0 ? 'MIA' : (gameMode === 'pk' && winner === 2 ? 'WINNER' : 'COMPLETE')}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 border-2 border-[#141414] p-4">
                  <span className="block text-[10px] font-black uppercase opacity-40 mb-1">Total Score</span>
                  <span className="text-4xl font-black tabular-nums">{score2}</span>
                </div>
                <div className="bg-gray-50 border-2 border-[#141414] p-4">
                  <span className="block text-[10px] font-black uppercase opacity-40 mb-1">Fixed Parts</span>
                  <span className="text-4xl font-black tabular-nums">{correctCount2}/{p2Results.length}</span>
                </div>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {p2Results.map((r, i) => (
                  <div key={i} className={`flex items-center gap-4 p-3 border-2 ${r.isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'} rounded-xl`}>
                    <div className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-lg border-2 border-[#141414] ${r.isCorrect ? 'bg-[#00FF00]' : 'bg-red-500'}`}>
                      {r.isCorrect ? <CheckCircle2 className="w-4 h-4 text-[#141414]" /> : <XCircle className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-5xl truncate">{r.userOrder.join('')}</p>
                      {!r.isCorrect && <p className="text-2xl text-gray-500 truncate font-medium">Target: {r.sentence.chinese}</p>}
                    </div>
                    <div className="w-10 h-10 shrink-0 bg-white border-2 border-[#141414] rounded-lg p-1">
                      <img 
                        src={r.isCorrect ? TOYS[r.toyIndex || 0].fixedImg : TOYS[r.toyIndex || 0].brokenImg} 
                        alt="toy" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
             <div className="bg-gray-100 border-4 border-[#141414] p-8 flex flex-col items-center justify-center text-center">
                <Trophy className={`w-32 h-32 mb-6 ${lives > 0 ? 'text-[#F27D26]' : 'text-gray-400'}`} />
                <h3 className="text-4xl font-black uppercase mb-4">{lives > 0 ? 'Promotion Earned!' : 'Shift Failed'}</h3>
                <p className="text-gray-500 italic max-w-sm">
                  {lives > 0 
                    ? "Your repair work has been officially certified by the factory. Ready for the next level?" 
                    : "The machine broke down too many times. Safety training required."}
                </p>
             </div>
          )}
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNextLevel}
          className="w-full bg-[#141414] text-white py-6 text-3xl font-black uppercase tracking-[0.2em] border-4 border-[#141414] hover:bg-[#00FF00] hover:text-[#141414] transition-all flex items-center justify-center gap-4"
        >
          {language === 'en' ? 'Next Mission' : 'Дараагийн даалгавар'}
          <ChevronLeft className="w-8 h-8 rotate-180" />
        </motion.button>
      </motion.div>
    </div>
  );
}
