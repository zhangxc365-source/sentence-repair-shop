export type Language = 'en' | 'mn' | 'zh';

export interface Sentence {
  id: number;
  chinese: string;
  parts: {
    text: string;
    pinyin: string;
  }[];
  english: string;
  mongolian: string;
  level: number;
  grammar?: string;
  lesson?: string;
}

export type GameMode = 'solo' | 'coop' | 'pk' | 'intro' | 'none';
export type GameState = 'start' | 'intro' | 'prep' | 'repair_prep' | 'playing' | 'result' | 'selection';

export interface GameResult {
  sentence: Sentence;
  userOrder: string[];
  isCorrect: boolean;
  playerNum?: 1 | 2;
  toyIndex?: number;
}
