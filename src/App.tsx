import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wrench, 
  Play, 
  Home, 
  RotateCcw, 
  Pause,
  Zap,
  Timer,
  ChevronLeft,
  Heart
} from 'lucide-react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';

import { yctSentences as sentences } from './data/yct_sentences';
import { Sentence, GameMode, GameState, GameResult, Language } from './types';
import { TOYS, shuffle } from './constants';

// Component Imports
import { DroppableZone } from './components/DroppableZone';
import { SortableItem } from './components/SortableItem';
import { DraggableBeltItem } from './components/DraggableBeltItem';
import { MenuButton } from './components/MenuButton';

// Screen Imports
import { StartScreen } from './components/screens/StartScreen';
import { SelectionScreen } from './components/screens/SelectionScreen';
import { IntroScreen } from './components/screens/IntroScreen';
import { PrepScreen } from './components/screens/PrepScreen';
import { RepairPrepScreen } from './components/screens/RepairPrepScreen';
import { ResultScreen } from './components/screens/ResultScreen';

export default function App() {
  // Game State
  const [gameState, setGameState] = useState<GameState>('start');
  const [gameMode, setGameMode] = useState<GameMode>('none');
  const [language, setLanguage] = useState<Language>('en');
  const [currentRoundSentences, setCurrentRoundSentences] = useState<Sentence[]>([]);
  const [p1Sentences, setP1Sentences] = useState<Sentence[]>([]);
  const [p2Sentences, setP2Sentences] = useState<Sentence[]>([]);
  const [p1Toys, setP1Toys] = useState<typeof TOYS>([]);
  const [p2Toys, setP2Toys] = useState<typeof TOYS>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [score2, setScore2] = useState(0);
  const [lives, setLives] = useState(3);
  const [lives2, setLives2] = useState(3);
  const [combo, setCombo] = useState(0);
  const [combo2, setCombo2] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [finishTime1, setFinishTime1] = useState<number | null>(null);
  const [finishTime2, setFinishTime2] = useState<number | null>(null);
  const [results, setResults] = useState<GameResult[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>(1);
  const [selectedLesson, setSelectedLesson] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Memoize available lessons for the selected level
  const availableLessons = useMemo(() => {
    if (selectedLevel === 'all') return [];
    const lessons = sentences
      .filter(s => s.level === selectedLevel && s.lesson)
      .map(s => s.lesson as string);
    
    const uniqueLessons = Array.from(new Set(lessons));
    const reviewLessonNum = Number(selectedLevel) <= 4 ? 12 : 15;
    const reviewLessonStr = `Lesson ${reviewLessonNum}`;
    
    if (!uniqueLessons.includes(reviewLessonStr)) {
      uniqueLessons.push(reviewLessonStr);
    }

    // Sort lessons numerically (Lesson 1, Lesson 2, ...)
    return uniqueLessons.sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.replace(/\D/g, '')) || 0;
      return numA - numB;
    });
  }, [selectedLevel]);

  // PK Mode State
  const [aiProgress, setAiProgress] = useState(0);
  const [isAiStuck, setIsAiStuck] = useState(false);
  const [isPlayerStuck, setIsPlayerStuck] = useState(false);
  const [showFixedToy, setShowFixedToy] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);

  // Current Sentence State
  const [placedParts, setPlacedParts] = useState<(Sentence['parts'][0] & { id: string })[]>([]);
  const [availableParts, setAvailableParts] = useState<(Sentence['parts'][0] & { id: string })[]>([]);
  // Cooperative Mode State
  const [placedParts2, setPlacedParts2] = useState<(Sentence['parts'][0] & { id: string })[]>([]);
  const [availableParts2, setAvailableParts2] = useState<(Sentence['parts'][0] & { id: string })[]>([]);
  const [showFixedToy2, setShowFixedToy2] = useState(false);
  const [lastCorrect2, setLastCorrect2] = useState(false);
  const [currentIndex2, setCurrentIndex2] = useState(0);
  const [nextQueueIdx, setNextQueueIdx] = useState(2);

  const [activeId, setActiveId] = useState<string | null>(null);

  const availablePartsIds = useMemo(() => availableParts.map(p => p.id), [availableParts]);
  const availableParts2Ids = useMemo(() => availableParts2.map(p => p.id), [availableParts2]);
  const placedPartsIds = useMemo(() => placedParts.map(p => p.id), [placedParts]);
  const placedParts2Ids = useMemo(() => placedParts2.map(p => p.id), [placedParts2]);

  // Check for game end in Dual Mode
  useEffect(() => {
    if (gameState === 'playing' && (gameMode === 'pk' || gameMode === 'coop')) {
      if (currentIndex === -1 && currentIndex2 === -1) {
        setGameState('result');
      }
    }
  }, [currentIndex, currentIndex2, gameState, gameMode]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Unique ID generator to avoid collisions
  const generateId = (prefix: string, text: string) => `${prefix}-${Math.random().toString(36).substr(2, 9)}-${text}`;

  // Initialize Round
  const startNewGame = (mode: GameMode, level: number | 'all' = 'all', lesson?: string) => {
    let pool = sentences;
    
    if (level !== 'all') {
      pool = pool.filter(s => s.level === level);
      if (lesson) {
        const lessonPool = pool.filter(s => s.lesson === lesson);
        const reviewNum = Number(level) <= 4 ? 12 : 15;
        if (lessonPool.length === 0 && (lesson === `Lesson ${reviewNum}` || lesson === 'Review')) {
          // If it's a review lesson and empty, it means we take from the whole level
          // No additional filtering needed, but maybe we want to notify or shuffle differently?
          // Actually, just leaving it as the level pool is fine.
        } else {
          pool = lessonPool;
        }
      }
    }
    
    if (pool.length === 0) {
      setErrorMessage("No sentences found for this selection yet!");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    // Group sentences by grammar point
    const grammarGroups = pool.reduce((acc, s) => {
      const g = s.grammar || 'Uncategorized';
      if (!acc[g]) acc[g] = [];
      acc[g].push(s);
      return acc;
    }, {} as Record<string, Sentence[]>);

    const grammarTags = shuffle(Object.keys(grammarGroups));
    const selected: Sentence[] = [];
    
    // 1. Pick one random sentence from each grammar group (up to 6 groups)
    const limit = (mode === 'pk' || mode === 'coop') ? 10 : 6;
    const tagsToUse = grammarTags.slice(0, limit);
    tagsToUse.forEach(tag => {
      const group = grammarGroups[tag];
      selected.push(shuffle(group)[0]);
    });

    // 2. If we have fewer than sentences (less than grammar points), 
    // fill the rest with random sentences from the pool avoiding duplicates
    if (selected.length < limit) {
      const selectedIds = new Set(selected.map(s => s.id));
      const remainingPool = pool.filter(s => !selectedIds.has(s.id));
      const extraNeeded = limit - selected.length;
      const extras = shuffle(remainingPool).slice(0, extraNeeded);
      selected.push(...extras);
    }

    const finalSelected = shuffle(selected);

    setCurrentRoundSentences(finalSelected);
    if (mode === 'pk') {
      setP1Sentences(shuffle([...finalSelected]));
      setP2Sentences(shuffle([...finalSelected]));
      setP1Toys(shuffle([...TOYS]));
      setP2Toys(shuffle([...TOYS]));
    } else {
      setP1Sentences(finalSelected);
      setP2Sentences(finalSelected);
      const sharedToys = shuffle([...TOYS]);
      setP1Toys(sharedToys);
      setP2Toys(sharedToys);
    }
    
    setGameMode(mode);
    setScore(0);
    setScore2(0);
    setLives(3);
    setLives2(3);
    setTimeLeft(120);
    setFinishTime1(null);
    setFinishTime2(null);
    setCurrentIndex(0);
    if (mode === 'pk') {
      setCurrentIndex2(0);
      setNextQueueIdx(0); // Not used in PK, but reset for safety
    } else {
      setCurrentIndex2(mode === 'coop' ? 1 : 0);
      setNextQueueIdx(mode === 'coop' ? 2 : 1);
    }
    setResults([]);
    setCombo(0);
    setAiProgress(0);
    setGameState('prep');
  };

  const startPlaying = () => {
    // Shuffle the sentences one more time for the actual game order 
    // if requested specifically (different from prep)
    setCurrentRoundSentences(prev => shuffle(prev));
    setGameState('repair_prep');
  };

  const initP1Pool = useCallback(() => {
    if (currentIndex === -1) {
      setAvailableParts([]);
      return;
    }
    const sentence = p1Sentences[currentIndex];
    if (!sentence) return;
    const filteredParts = sentence.parts.filter(p => p.pinyin && p.pinyin.trim() !== "");
    setPlacedParts([]);
    const prefix = gameMode === 'coop' ? 'available-p1' : 'available';
    setAvailableParts(shuffle(filteredParts).map((p: any, i) => ({ text: p.text, pinyin: p.pinyin, id: `${prefix}-${i}-${p.text}-${Math.random()}` })));
  }, [p1Sentences, currentIndex, gameMode]);

  const initP2Pool = useCallback(() => {
    if ((gameMode !== 'coop' && gameMode !== 'pk') || currentIndex2 === -1) {
      setAvailableParts2([]);
      return;
    }
    const sentence = p2Sentences[currentIndex2];
    if (!sentence) return;
    const filteredParts = sentence.parts.filter(p => p.pinyin && p.pinyin.trim() !== "");
    setPlacedParts2([]);
    setAvailableParts2(shuffle(filteredParts).map((p: any, i) => ({ text: p.text, pinyin: p.pinyin, id: `available-p2-${i}-${p.text}-${Math.random()}` })));
  }, [p2Sentences, currentIndex2, gameMode]);

  // Sync pools with indices
  useEffect(() => {
    if (gameState === 'playing') {
      initP1Pool();
    }
  }, [currentIndex, gameState, initP1Pool]);

  useEffect(() => {
    if (gameState === 'playing' && (gameMode === 'coop' || gameMode === 'pk')) {
      initP2Pool();
    }
  }, [currentIndex2, gameState, gameMode, initP2Pool]);

  const initSentence = useCallback(() => {
    initP1Pool();
    if (gameMode === 'coop' || gameMode === 'pk') {
      initP2Pool();
    }
  }, [initP1Pool, initP2Pool, gameMode]);

  // Timer Logic
  useEffect(() => {
    if (gameState === 'playing' && !isPaused && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('result');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, isPaused, timeLeft]);

  // AI Logic for PK Mode
  useEffect(() => {
    if (gameMode === 'pk' && gameState === 'playing' && !isPaused && !isAiStuck) {
      const aiTimer = setInterval(() => {
        setAiProgress(prev => {
          const next = prev + 0.05; // AI speed
          if (next >= currentRoundSentences.length) {
            // In PK mode, don't end game immediately if AI finishes
            if (gameMode !== 'pk') setGameState('result');
            return currentRoundSentences.length;
          }
          return next;
        });
      }, 1000);
      return () => clearInterval(aiTimer);
    }
  }, [gameMode, gameState, isPaused, isAiStuck, currentRoundSentences.length]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Case 1: Dragging from available to placed (Player 1)
    if (activeId.startsWith('available-p1-') && (overId === 'machine-area-1' || overId.startsWith('placed-p1-'))) {
      const part = availableParts.find(p => p.id === activeId);
      if (part) {
        setPlacedParts(prev => [...prev, { ...part, id: generateId('placed-p1', part.text) }]);
        setAvailableParts(prev => prev.filter(p => p.id !== activeId));
      }
    }

    // Case 1.5: Dragging from available to placed (Player 2)
    if (activeId.startsWith('available-p2-') && (overId === 'machine-area-2' || overId.startsWith('placed-p2-'))) {
      const part = availableParts2.find(p => p.id === activeId);
      if (part) {
        setPlacedParts2(prev => [...prev, { ...part, id: generateId('placed-p2', part.text) }]);
        setAvailableParts2(prev => prev.filter(p => p.id !== activeId));
      }
    }

    // Case 2: Dragging from placed back to available
    if (activeId.startsWith('placed-p1-') && (overId === 'conveyor-belt-1' || overId.startsWith('available-p1-'))) {
      const part = placedParts.find(p => p.id === activeId);
      if (part) {
        setPlacedParts(prev => prev.filter(p => p.id !== activeId));
        setAvailableParts(prev => [...prev, { ...part, id: generateId('available-p1', part.text) }]);
      }
    }
    if (activeId.startsWith('placed-p2-') && (overId === 'conveyor-belt-2' || overId.startsWith('available-p2-'))) {
      const part = placedParts2.find(p => p.id === activeId);
      if (part) {
        setPlacedParts2(prev => prev.filter(p => p.id !== activeId));
        setAvailableParts2(prev => [...prev, { ...part, id: generateId('available-p2', part.text) }]);
      }
    }

    // Single mode dragging
    if (activeId.startsWith('available-') && !activeId.startsWith('available-p') && (overId === 'machine-area-1' || overId.startsWith('placed-p1-'))) {
      const part = availableParts.find(p => p.id === activeId);
      if (part) {
        setPlacedParts(prev => [...prev, { ...part, id: generateId('placed-p1', part.text) }]);
        setAvailableParts(prev => prev.filter(p => p.id !== activeId));
      }
    }

    // Case 3: Reordering within placed
    if (activeId.startsWith('placed-p1-')) {
      if (overId.startsWith('placed-p1-') && activeId !== overId) {
        setPlacedParts((items) => {
          const oldIndex = items.findIndex(i => i.id === activeId);
          const newIndex = items.findIndex(i => i.id === overId);
          if (oldIndex !== -1 && newIndex !== -1) {
            return arrayMove(items, oldIndex, newIndex);
          }
          return items;
        });
      }
    }
    if (activeId.startsWith('placed-p2-')) {
      if (overId.startsWith('placed-p2-') && activeId !== overId) {
        setPlacedParts2((items) => {
          const oldIndex = items.findIndex(i => i.id === activeId);
          const newIndex = items.findIndex(i => i.id === overId);
          if (oldIndex !== -1 && newIndex !== -1) {
            return arrayMove(items, oldIndex, newIndex);
          }
          return items;
        });
      }
    }
  }, [availableParts, availableParts2, placedParts, placedParts2]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle reordering within the same container during drag for better UX
    if (activeId.startsWith('placed-')) {
      if (overId.startsWith('placed-') && activeId !== overId) {
        setPlacedParts((items) => {
          const oldIndex = items.findIndex(i => i.id === activeId);
          const newIndex = items.findIndex(i => i.id === overId);
          if (oldIndex !== -1 && newIndex !== -1) {
            return arrayMove(items, oldIndex, newIndex);
          }
          return items;
        });
      } else if (overId === 'machine-area') {
        setPlacedParts((items) => {
          const oldIndex = items.findIndex(i => i.id === activeId);
          if (oldIndex !== -1 && oldIndex !== items.length - 1) {
            return arrayMove(items, oldIndex, items.length - 1);
          }
          return items;
        });
      }
    }
  }, []);

  const handlePartClick = useCallback((part: any, playerNum: 1 | 2 = 1) => {
    if (isPlayerStuck || (playerNum === 1 ? showFixedToy : showFixedToy2)) return;
    if (playerNum === 1 && (lives <= 0 || currentIndex === -1)) return;
    if (playerNum === 2 && (lives2 <= 0 || currentIndex2 === -1)) return;
    
    if (playerNum === 1) {
      setPlacedParts(prev => [...prev, { ...part, id: generateId('placed-p1', part.text) }]);
      setAvailableParts(prev => prev.filter(p => p.id !== part.id));
    } else {
      setPlacedParts2(prev => [...prev, { ...part, id: generateId('placed-p2', part.text) }]);
      setAvailableParts2(prev => prev.filter(p => p.id !== part.id));
    }
  }, [isPlayerStuck, showFixedToy, showFixedToy2, lives, lives2, currentIndex, currentIndex2]);

  const handleRetract = useCallback((playerNum: 1 | 2 = 1) => {
    if (playerNum === 1) {
      if (placedParts.length === 0 || showFixedToy) return;
      const lastPart = placedParts[placedParts.length - 1];
      setPlacedParts(prev => prev.slice(0, -1));
      setAvailableParts(prev => [...prev, { ...lastPart, id: generateId('available-p1', lastPart.text) }]);
    } else {
      if (placedParts2.length === 0 || showFixedToy2) return;
      const lastPart = placedParts2[placedParts2.length - 1];
      setPlacedParts2(prev => prev.slice(0, -1));
      setAvailableParts2(prev => [...prev, { ...lastPart, id: generateId('available-p2', lastPart.text) }]);
    }
  }, [placedParts, placedParts2, showFixedToy, showFixedToy2]);

  const handleRemovePlaced = useCallback((id: string, playerNum: 1 | 2 = 1) => {
    if (playerNum === 1) {
      if (showFixedToy) return;
      const part = placedParts.find(p => p.id === id);
      if (part) {
        setPlacedParts(prev => prev.filter(p => p.id !== id));
        setAvailableParts(prev => [...prev, { ...part, id: generateId('available-p1', part.text) }]);
      }
    } else {
      if (showFixedToy2) return;
      const part = placedParts2.find(p => p.id === id);
      if (part) {
        setPlacedParts2(prev => prev.filter(p => p.id !== id));
        setAvailableParts2(prev => [...prev, { ...part, id: generateId('available-p2', part.text) }]);
      }
    }
  }, [placedParts, placedParts2, showFixedToy, showFixedToy2]);

  const checkSentence = useCallback((playerNum: 1 | 2 = 1) => {
    const idx = playerNum === 1 ? currentIndex : currentIndex2;
    const parts = playerNum === 1 ? placedParts : placedParts2;
    const sentencesPool = playerNum === 1 ? p1Sentences : p2Sentences;
    const toysPool = playerNum === 1 ? p1Toys : p2Toys;
    const sentence = sentencesPool[idx];
    if (!sentence) return;

    const userSentence = parts.map(s => s.text).join('');
    const targetWithoutPunctuation = sentence.chinese.replace(/[，。！？；：“”‘’（）]/g, '');
    const isCorrect = userSentence === targetWithoutPunctuation;
    
    const currentToy = toysPool[idx % toysPool.length] || TOYS[0];
    const toyIndex = TOYS.findIndex(t => t.name === currentToy.name);

    if (isCorrect) {
      if (playerNum === 1) {
        const nextCombo = combo + 1;
        setCombo(nextCombo);
        setScore(prev => prev + (nextCombo >= 3 ? 20 : 10));
        setLastCorrect(true);
        setShowFixedToy(true);
      } else {
        const nextCombo = combo2 + 1;
        setCombo2(nextCombo);
        setScore2(prev => prev + (nextCombo >= 3 ? 20 : 10));
        setLastCorrect2(true);
        setShowFixedToy2(true);
      }
      
      setResults(prev => [...prev, { sentence, userOrder: parts.map(s => s.text), isCorrect: true, playerNum, toyIndex }]);

      setTimeout(() => {
        if (playerNum === 1) {
          setShowFixedToy(false);
          setLastCorrect(false);
          setPlacedParts([]);
          
          if (gameMode === 'pk') {
            const nextIdx = currentIndex + 1;
            if (nextIdx < p1Sentences.length) {
              setCurrentIndex(nextIdx);
            } else {
              setCurrentIndex(-1);
              setFinishTime1(timeLeft);
            }
          } else {
            if (nextQueueIdx < currentRoundSentences.length) {
              setCurrentIndex(nextQueueIdx);
              setNextQueueIdx(prev => prev + 1);
            } else {
              setCurrentIndex(-1);
            }
          }
        } else {
          setShowFixedToy2(false);
          setLastCorrect2(false);
          setPlacedParts2([]);
          
          if (gameMode === 'pk') {
            const nextIdx = currentIndex2 + 1;
            if (nextIdx < p2Sentences.length) {
              setCurrentIndex2(nextIdx);
            } else {
              setCurrentIndex2(-1);
              setFinishTime2(timeLeft);
            }
          } else {
            if (nextQueueIdx < currentRoundSentences.length) {
              setCurrentIndex2(nextQueueIdx);
              setNextQueueIdx(prev => prev + 1);
            } else {
              setCurrentIndex2(-1);
            }
          }
        }
        
        // Game ends when all sentences are processed (Coop) or both players finished (PK)
        const checkBothFinished = () => {
          if (gameMode === 'pk') {
            const resultsP1 = results.filter(r => r.playerNum === 1 || !r.playerNum).length; // Fallback
            // Actually, let's check current indices
            // But we already set indices to -1
            return false; // Handled below
          }
          return false;
        };

        if (gameMode !== 'pk') {
          const finishedCount = results.length + 1;
          if (finishedCount >= currentRoundSentences.length) {
            setGameState('result');
          }
        } else {
           // In PK, check if both reached end
           // Use functional update to check latest state if needed, 
           // but here we just updated state. We check indices.
        }
      }, 1500);
    } else {
      if (playerNum === 1) {
        setCombo(0);
        setScore(prev => Math.max(0, prev - 5));
        setLives(prev => {
          const next = prev - 1;
          if (next <= 0 && gameMode !== 'pk') setGameState('result');
          return next;
        });
        setLastCorrect(false);
        setShowFixedToy(true);
      } else {
        setCombo2(0);
        setScore2(prev => Math.max(0, prev - 5));
        setLives2(prev => {
          const next = prev - 1;
          if (next <= 0 && gameMode !== 'pk') setGameState('result');
          return next;
        });
        setLastCorrect2(false);
        setShowFixedToy2(true);
      }
      
      setResults(prev => [...prev, { sentence, userOrder: parts.map(s => s.text), isCorrect: false, playerNum, toyIndex }]);
      
      setTimeout(() => {
        if (playerNum === 1) {
          setShowFixedToy(false);
          setPlacedParts([]);
          
          if (gameMode === 'pk') {
            const nextIdx = (lives <= 1) ? -1 : currentIndex + 1;
            if (nextIdx !== -1 && nextIdx < p1Sentences.length) {
              setCurrentIndex(nextIdx);
            } else {
              setCurrentIndex(-1);
              setFinishTime1(timeLeft);
            }
          } else {
            if (nextQueueIdx < currentRoundSentences.length) {
              setCurrentIndex(nextQueueIdx);
              setNextQueueIdx(prev => prev + 1);
            } else {
              setCurrentIndex(-1);
            }
          }
        } else {
          setShowFixedToy2(false);
          setPlacedParts2([]);
          
          if (gameMode === 'pk') {
            const nextIdx = (lives2 <= 1) ? -1 : currentIndex2 + 1;
            if (nextIdx !== -1 && nextIdx < p2Sentences.length) {
              setCurrentIndex2(nextIdx);
            } else {
              setCurrentIndex2(-1);
              setFinishTime2(timeLeft);
            }
          } else {
            if (nextQueueIdx < currentRoundSentences.length) {
              setCurrentIndex2(nextQueueIdx);
              setNextQueueIdx(prev => prev + 1);
            } else {
              setCurrentIndex2(-1);
            }
          }
        }
      }, 1500);
    }
  }, [currentIndex, currentIndex2, placedParts, placedParts2, p1Sentences, p2Sentences, p1Toys, p2Toys, combo, combo2, gameMode, nextQueueIdx, currentRoundSentences.length, results.length, lives, lives2, timeLeft]);

  // Views
  const goToNextLevel = () => {
    const levels = Array.from(new Set(sentences.map(s => s.level))).sort((a,b) => a - b);
    const currentLevelLessons = Array.from(new Set(sentences.filter(s => s.level === selectedLevel).map(s => s.lesson))).filter(Boolean).sort((a: any, b: any) => {
      const numA = parseInt(a.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.replace(/\D/g, '')) || 0;
      return numA - numB;
    }) as string[];
    const currentLessonIdx = currentLevelLessons.indexOf(selectedLesson);

    let nextLevel = selectedLevel as number;
    let nextLesson = selectedLesson;

    if (currentLessonIdx < currentLevelLessons.length - 1) {
      // Next lesson in same level
      nextLesson = currentLevelLessons[currentLessonIdx + 1];
    } else {
      // Next level's first lesson
      const currentLevelIdx = levels.indexOf(selectedLevel as number);
      if (currentLevelIdx < levels.length - 1) {
        nextLevel = levels[currentLevelIdx + 1];
        const nextLevelLessons = Array.from(new Set(sentences.filter(s => s.level === nextLevel).map(s => s.lesson))).filter(Boolean).sort((a: any, b: any) => {
          const numA = parseInt(a.replace(/\D/g, '')) || 0;
          const numB = parseInt(b.replace(/\D/g, '')) || 0;
          return numA - numB;
        }) as string[];
        nextLesson = nextLevelLessons[0];
      } else {
        // All levels completed
        setGameState('start');
        return;
      }
    }

    setSelectedLevel(nextLevel);
    setSelectedLesson(nextLesson);
    startNewGame(gameMode, nextLevel, nextLesson);
  };

  const GameScreen = () => {
    const isDual = gameMode === 'coop' || gameMode === 'pk';
    const s1 = currentIndex !== -1 ? p1Sentences[currentIndex] : null;
    const s2 = (isDual && currentIndex2 !== -1) ? p2Sentences[currentIndex2] : null;
    
    const p1Toy = (currentIndex !== -1 && p1Toys[currentIndex % p1Toys.length]) || TOYS[0];
    const p2Toy = (currentIndex2 !== -1 && p2Toys[currentIndex2 % p2Toys.length]) || TOYS[0];
    
    if (!isDual && !s1) return null;
    if (isDual && !s1 && !s2) return null; // Both done

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <div className="min-h-screen bg-[#E4E3E0] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b-4 border-[#141414] bg-white flex items-center justify-between relative h-24">
            {/* Player 1 Stats */}
            <div className={`flex items-center gap-6 ${isDual ? 'flex-1' : ''}`}>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase opacity-50">{isDual ? 'P1 Score' : 'Score'}</span>
                <span className="text-3xl font-black text-[#F27D26] tabular-nums">{score}</span>
              </div>
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <Heart 
                    key={`h1-${i}`}
                    className={`w-6 h-6 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              {combo >= 2 && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-[#F27D26] px-3 py-1 border-2 border-[#141414] flex items-center gap-2"
                >
                  <Zap className="w-3 h-3 fill-current text-white" />
                  <span className="font-black uppercase italic text-xs text-white">x{combo}</span>
                </motion.div>
              )}
            </div>

            {/* Centered Timer & Controls */}
            <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10">
              <div className="bg-[#141414] text-white px-6 py-2 rounded-full border-4 border-white shadow-[0_4px_0_0_rgba(0,0,0,0.1)] flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Timer className={`w-6 h-6 ${timeLeft < 20 ? 'text-red-500 animate-pulse' : ''}`} />
                  <span className={`text-3xl font-black tabular-nums ${timeLeft < 20 ? 'text-red-500' : ''}`}>
                    {timeLeft}s
                  </span>
                </div>
                <div className="flex gap-2 ml-2 border-l border-white/20 pl-4">
                   <button 
                    onClick={() => setIsPaused(!isPaused)}
                    className="hover:text-[#00FF00] transition-colors"
                  >
                    {isPaused ? <Play className="w-5 h-5"/> : <Pause className="w-5 h-5"/>}
                  </button>
                  <button 
                    onClick={() => setGameState('start')}
                    className="hover:text-[#F27D26] transition-colors"
                  >
                    <Home className="w-5 h-5"/>
                  </button>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase italic tracking-widest text-[#141414] opacity-30">
                {gameMode === 'pk' ? 'Battle Mode' : gameMode === 'coop' ? 'Cooperative Mission' : 'Solo Shift'}
              </span>
            </div>

            {/* Player 2 Stats (Dual only) */}
            {isDual ? (
              <div className="flex-1 flex items-center justify-end gap-6 text-right">
                {combo2 >= 2 && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-[#00FF00] px-3 py-1 border-2 border-[#141414] flex items-center gap-2"
                  >
                    <Zap className="w-3 h-3 fill-current text-[#141414]" />
                    <span className="font-black uppercase italic text-xs text-[#141414]">x{combo2}</span>
                  </motion.div>
                )}
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <Heart 
                      key={`h2-${i}`}
                      className={`w-6 h-6 ${i < lives2 ? 'text-red-500 fill-red-500' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase opacity-50">P2 Score</span>
                  <span className="text-3xl font-black text-[#00FF00] tabular-nums">{score2}</span>
                </div>
              </div>
            ) : (
              <div className="flex-1" />
            )}
          </div>

          {/* Main Area */}
          <div className={`flex-1 relative flex flex-col md:flex-row p-4 gap-6 items-stretch overflow-hidden ${!isDual ? 'max-w-screen-2xl mx-auto w-full md:gap-16 justify-center md:pl-12' : ''}`}>
            {/* Player 1 Section */}
            <div className={`flex flex-col gap-4 ${isDual ? 'flex-1' : 'flex-[2] max-w-4xl'}`}>
              <div className="flex-1 relative">
                <DroppableZone 
                  id="machine-area-1"
                  className="w-full h-full bg-[#151619] border-4 border-[#141414] rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center relative"
                >
                  <span className="absolute top-2 left-4 text-[#F27D26] font-black text-xs uppercase italic">{isDual ? 'P1 Machine' : 'Repair Machine'}</span>
                  {s1 && (
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[90%] bg-white/5 border border-white/10 p-2 text-center rounded">
                       <p className="text-sm font-black text-white/40 uppercase tracking-widest mb-1 italic">Target</p>
                       <p className="text-lg font-black text-[#F27D26] italic truncate">
                        {language === 'en' ? s1.english : s1.mongolian}
                       </p>
                    </div>
                  )}
                  {s1 ? (
                    <div className="flex flex-wrap justify-center gap-2 w-full mt-12">
                      <SortableContext 
                        items={placedPartsIds}
                        strategy={rectSortingStrategy}
                      >
                        {placedParts.map((part) => (
                          <SortableItem 
                            key={part.id} 
                            id={part.id} 
                            part={part} 
                            onRemove={(id) => handleRemovePlaced(id, 1)}
                          />
                        ))}
                      </SortableContext>
                      
                      {(() => {
                        const playablePartsCount = s1.parts.filter(p => p.pinyin && p.pinyin.trim() !== "").length;
                        return [...Array(Math.max(0, playablePartsCount - placedParts.length))].map((_, i) => (
                          <div 
                            key={`empty1-${i}`}
                            className="w-24 h-16 border-2 border-dashed border-white/10 rounded-lg flex items-center justify-center"
                          >
                            <span className="text-white/10 text-xl font-black">{placedParts.length + i + 1}</span>
                          </div>
                        ));
                      })()}
                    </div>
                  ) : (
                    <div className="text-center">
                      <Zap className={`w-12 h-12 mx-auto mb-2 ${lives <= 0 ? 'text-gray-500' : 'text-[#F27D26]'}`} />
                      <span className={`font-black uppercase italic ${lives <= 0 ? 'text-gray-500' : 'text-[#F27D26]'}`}>
                        {lives <= 0 ? 'P1 Failed!' : 'P1 Shift Complete!'}
                      </span>
                    </div>
                  )}
                </DroppableZone>
              </div>

              <div className="flex justify-center gap-3">
                <button 
                  disabled={!s1 || placedParts.length === 0 || showFixedToy}
                  onClick={() => handleRetract(1)}
                  className={`flex-1 py-4 text-sm font-black uppercase border-4 border-[#141414] shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] active:shadow-none transition-all flex items-center justify-center gap-2 ${!s1 || placedParts.length === 0 || showFixedToy ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-[#F27D26] hover:bg-white text-[#141414]'}`}
                >
                  <RotateCcw className="w-4 h-4" /> Undo
                </button>
                <button 
                  disabled={!s1 || placedParts.length === 0 || showFixedToy}
                  onClick={() => checkSentence(1)}
                  className={`flex-[2] py-4 text-sm font-black uppercase border-4 border-[#141414] shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] active:shadow-none transition-all ${!s1 || placedParts.length === 0 || showFixedToy ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-[#00FF00] hover:bg-white'}`}
                >
                  {isDual ? 'Fix P1 Piece' : 'Fix Piece'}
                </button>
              </div>
            </div>

            {/* Middle Status Column (Toys) */}
            <div className={`flex flex-col ${isDual ? 'gap-12' : 'gap-4'} shrink-0 ${isDual ? 'w-48 pt-20' : 'w-[32rem] justify-center pt-8'}`}>
              {/* P1 Toy */}
              <div className={`${isDual ? 'p-4 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]' : 'p-6 shadow-[12px_12px_0px_0px_rgba(20,20,20,1)]'} bg-white border-4 border-[#141414] rounded-2xl flex flex-col items-center ${showFixedToy ? 'ring-4 ring-green-400' : ''}`}>
                 <div className={`w-full aspect-square ${s1 ? p1Toy.color : 'bg-gray-100'} border-4 border-[#141414] rounded-xl ${isDual ? 'mb-4' : 'mb-6'} flex items-center justify-center overflow-hidden`}>
                    {s1 ? (
                      <img 
                        src={showFixedToy && lastCorrect ? p1Toy.fixedImg : p1Toy.brokenImg} 
                        className={`max-h-full max-w-full p-1 ${p1Toy.id >= 7 ? (isDual ? 'scale-110' : 'scale-150') : ''}`}
                        alt="toy"
                      />
                    ) : (
                      <Zap className={`${isDual ? 'w-12 h-12' : 'w-24 h-24'} text-gray-200`} />
                    )}
                 </div>
                 <span className={`${isDual ? 'text-xs' : 'text-3xl'} font-black uppercase text-center truncate tracking-widest`}>
                    {isDual ? 'P1: ' : ''}{s1 ? p1Toy.name : 'Resting'}
                 </span>
              </div>

              {/* P2 Toy (Coop/PK) */}
              {isDual && (
                <div className={`p-4 bg-white border-4 border-[#141414] rounded-2xl flex flex-col items-center ${showFixedToy2 ? 'ring-4 ring-green-400' : 'shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]'}`}>
                 <div className={`w-full aspect-square ${s2 ? p2Toy.color : 'bg-gray-100'} border-4 border-[#141414] rounded-xl mb-4 flex items-center justify-center overflow-hidden`}>
                    {s2 ? (
                      <img 
                        src={showFixedToy2 && lastCorrect2 ? p2Toy.fixedImg : p2Toy.brokenImg} 
                        className={`max-h-full max-w-full p-1 ${p2Toy.id >= 7 ? 'scale-110' : ''}`}
                        alt="toy"
                      />
                    ) : (
                      <Zap className="w-12 h-12 text-gray-200" />
                    )}
                 </div>
                 <span className="text-xs font-black uppercase text-center truncate tracking-widest">
                    P2: {s2 ? p2Toy.name : 'Resting'}
                 </span>
                </div>
              )}
            </div>


            {/* Player 2 Section (Coop/PK) */}
            {isDual && (
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex-1 relative">
                  <DroppableZone 
                    id="machine-area-2"
                    className="w-full h-full bg-[#151619] border-4 border-[#141414] rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center relative"
                  >
                    <span className="absolute top-2 right-4 text-[#00FF00] font-black text-xs uppercase italic">P2 Machine</span>
                    {s2 && (
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[90%] bg-white/5 border border-white/10 p-2 text-center rounded">
                        <p className="text-sm font-black text-white/40 uppercase tracking-widest mb-1 italic">Target</p>
                        <p className="text-lg font-black text-[#00FF00] italic truncate">
                          {language === 'en' ? s2.english : s2.mongolian}
                        </p>
                      </div>
                    )}
                    {s2 ? (
                      <div className="flex flex-wrap justify-center gap-2 w-full mt-12">
                        <SortableContext 
                          items={placedParts2Ids}
                          strategy={rectSortingStrategy}
                        >
                          {placedParts2.map((part) => (
                            <SortableItem 
                              key={part.id} 
                              id={part.id} 
                              part={part} 
                              onRemove={(id) => handleRemovePlaced(id, 2)}
                            />
                          ))}
                        </SortableContext>
                        
                        {(() => {
                          const playablePartsCount = s2.parts.filter(p => p.pinyin && p.pinyin.trim() !== "").length;
                          return [...Array(Math.max(0, playablePartsCount - placedParts2.length))].map((_, i) => (
                            <div 
                              key={`empty2-${i}`}
                              className="w-24 h-16 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center"
                            >
                              <span className="text-white/10 text-xl font-black">{placedParts2.length + i + 1}</span>
                            </div>
                          ));
                        })()}
                      </div>
                    ) : (
                      <div className="text-center">
                        <Zap className={`w-12 h-12 mx-auto mb-2 ${lives2 <= 0 ? 'text-gray-500' : 'text-[#00FF00]'}`} />
                        <span className={`font-black uppercase italic ${lives2 <= 0 ? 'text-gray-500' : 'text-[#00FF00]'}`}>
                          {lives2 <= 0 ? 'P2 Failed!' : 'P2 Shift Complete!'}
                        </span>
                      </div>
                    )}
                  </DroppableZone>
                </div>

                <div className="flex justify-center gap-3">
                  <button 
                    disabled={!s2 || placedParts2.length === 0 || showFixedToy2}
                    onClick={() => handleRetract(2)}
                    className={`flex-1 py-3 text-sm font-black uppercase border-4 border-[#141414] shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:shadow-none transition-all flex items-center justify-center gap-2 ${!s2 || placedParts2.length === 0 || showFixedToy2 ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-[#F27D26] hover:bg-white text-[#141414]'}`}
                  >
                    <RotateCcw className="w-4 h-4" /> Undo
                  </button>
                  <button 
                    disabled={!s2 || placedParts2.length === 0 || showFixedToy2}
                    onClick={() => checkSentence(2)}
                    className={`flex-[2] py-3 text-sm font-black uppercase border-4 border-[#141414] shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:shadow-none transition-all ${!s2 || placedParts2.length === 0 || showFixedToy2 ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-[#00FF00] hover:bg-white'}`}
                  >
                    Fix P2 Piece
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Conveyor Belts */}
          <div className="h-40 bg-[#141414] border-t-8 border-[#F27D26] flex items-center w-full overflow-hidden">
            {/* Player 1 Pool */}
            <div className={`relative flex items-center p-4 border-r-4 border-[#F27D26]/30 h-full min-w-0 ${isDual ? 'flex-1 basis-1/2' : 'w-full'}`}>
              <div className="absolute -top-3 left-4 bg-[#F27D26] text-[#141414] text-[10px] font-black px-4 uppercase border-2 border-[#141414] z-10">
                {isDual ? 'P1 Resource Pool' : 'Main Resource Pool'}
              </div>
              
              <button 
                onClick={() => {
                  const el = document.getElementById('belt-scroll-area-1');
                  if (el) el.scrollBy({ left: -200 });
                }}
                className="z-10 bg-[#F27D26] border-4 border-[#141414] p-1 shadow-[2px_2px_0px_0px_rgba(202,202,202,0.5)] active:shadow-none shrink-0"
              >
                <ChevronLeft className="w-6 h-6 text-[#141414]" />
              </button>

              <DroppableZone 
                id="conveyor-belt-1"
                className="flex-1 h-full min-w-0 overflow-x-auto overflow-y-hidden no-scrollbar"
              >
                <div 
                  id="belt-scroll-area-1"
                  className={`flex gap-4 h-full overflow-x-auto no-scrollbar items-center px-4 ${!isDual ? 'justify-center' : ''}`}
                >
                  <SortableContext 
                    items={availablePartsIds}
                    strategy={rectSortingStrategy}
                  >
                    {availableParts.map((part) => (
                      <DraggableBeltItem 
                        key={part.id} 
                        id={part.id} 
                        part={part} 
                        onClick={() => handlePartClick(part, 1)}
                      />
                    ))}
                  </SortableContext>
                </div>
              </DroppableZone>

              <button 
                onClick={() => {
                  const el = document.getElementById('belt-scroll-area-1');
                  if (el) el.scrollBy({ left: 200 });
                }}
                className="z-10 bg-[#F27D26] border-4 border-[#141414] p-1 shadow-[2px_2px_0px_0px_rgba(202,202,202,0.5)] active:shadow-none shrink-0"
              >
                <ChevronLeft className="w-6 h-6 text-[#141414] rotate-180" />
              </button>
            </div>

            {/* Player 2 Pool (Coop/PK) */}
            {isDual && (
              <div className="flex-1 basis-1/2 relative flex items-center p-4 h-full min-w-0">
                <div className="absolute -top-3 left-4 bg-[#00FF00] text-[#141414] text-[10px] font-black px-4 uppercase border-2 border-[#141414] z-10">
                  P2 Resource Pool
                </div>
                
                <button 
                  onClick={() => {
                    const el = document.getElementById('belt-scroll-area-2');
                    if (el) el.scrollBy({ left: -200 });
                  }}
                  className="z-10 bg-[#00FF00] border-4 border-[#141414] p-1 shadow-[2px_2px_0px_0px_rgba(202,202,202,0.5)] active:shadow-none shrink-0"
                >
                  <ChevronLeft className="w-6 h-6 text-[#141414]" />
                </button>

                <DroppableZone 
                  id="conveyor-belt-2"
                  className="flex-1 h-full min-w-0 overflow-x-auto overflow-y-hidden no-scrollbar"
                >
                  <div 
                    id="belt-scroll-area-2"
                    className="flex gap-4 h-full overflow-x-auto no-scrollbar items-center px-4"
                  >
                    <SortableContext 
                      items={availableParts2Ids}
                      strategy={rectSortingStrategy}
                    >
                      {availableParts2.map((part) => (
                        <DraggableBeltItem 
                          key={part.id} 
                          id={part.id} 
                          part={part} 
                          onClick={() => handlePartClick(part, 2)}
                        />
                      ))}
                    </SortableContext>
                  </div>
                </DroppableZone>

                <button 
                  onClick={() => {
                    const el = document.getElementById('belt-scroll-area-2');
                    if (el) el.scrollBy({ left: 200 });
                  }}
                  className="z-10 bg-[#00FF00] border-4 border-[#141414] p-1 shadow-[2px_2px_0px_0px_rgba(202,202,202,0.5)] active:shadow-none shrink-0"
                >
                  <ChevronLeft className="w-6 h-6 text-[#141414] rotate-180" />
                </button>
              </div>
            )}
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeId ? (
              <div className="w-24 h-16 bg-white border-2 border-[#141414] rounded-lg flex flex-col items-center justify-center shadow-2xl scale-110">
                <span className="text-[10px] font-bold text-gray-400">
                  {(placedParts.find(p => p.id === activeId) || placedParts2.find(p => p.id === activeId) || availableParts.find(p => p.id === activeId) || availableParts2.find(p => p.id === activeId))?.pinyin?.toLowerCase() || ''}
                </span>
                <span className="text-2xl font-black text-[#141414]">
                  {(placedParts.find(p => p.id === activeId) || placedParts2.find(p => p.id === activeId) || availableParts.find(p => p.id === activeId) || availableParts2.find(p => p.id === activeId))?.text}
                </span>
              </div>
            ) : null}
          </DragOverlay>

          {/* Transition Overlays */}
          <AnimatePresence>
            {isPaused && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center"
              >
                <div className="text-center">
                  <h2 className="text-5xl font-black text-white uppercase italic mb-8">Factory Paused</h2>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setIsPaused(false)}
                      className="bg-[#00FF00] text-[#141414] px-8 py-3 text-xl font-black uppercase border-4 border-white cursor-pointer"
                    >
                      Resume
                    </button>
                    <button 
                      onClick={() => {
                        setIsPaused(false);
                        startNewGame(gameMode, selectedLevel, selectedLesson);
                      }}
                      className="bg-[#F27D26] text-white px-8 py-3 text-xl font-black uppercase border-4 border-[#141414] cursor-pointer"
                    >
                      Restart
                    </button>
                    <button 
                      onClick={() => setGameState('start')}
                      className="bg-white text-[#141414] px-8 py-3 text-xl font-black uppercase border-4 border-[#141414] cursor-pointer"
                    >
                      Quit
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DndContext>
    );
  };


  return (
    <div className="min-h-screen">
      {gameState === 'start' && (
        <StartScreen 
          language={language}
          setLanguage={setLanguage}
          setGameMode={setGameMode}
          setGameState={setGameState}
        />
      )}
      {gameState === 'selection' && (
        <SelectionScreen 
          language={language}
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
          selectedLesson={selectedLesson}
          setSelectedLesson={setSelectedLesson}
          availableLessons={availableLessons}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          setGameState={setGameState}
          gameMode={gameMode}
          startNewGame={startNewGame}
        />
      )}
      {gameState === 'intro' && (
        <IntroScreen 
          language={language}
          setLanguage={setLanguage}
          onBack={() => setGameState('start')}
        />
      )}
      {gameState === 'prep' && (
        <PrepScreen 
          language={language}
          currentRoundSentences={currentRoundSentences}
          onStartPlaying={startPlaying}
        />
      )}
      {gameState === 'playing' && <GameScreen />}
      {gameState === 'repair_prep' && (
        <RepairPrepScreen 
          toy1={p1Toys[currentIndex % p1Toys.length] || TOYS[0]}
          toy2={(gameMode === 'coop' || gameMode === 'pk') ? (p2Toys[currentIndex2 % p2Toys.length] || TOYS[1]) : null}
          onStart={() => {
            setGameState('playing');
            initSentence();
          }}
        />
      )}
      {gameState === 'result' && (
        <ResultScreen 
          language={language}
          results={results}
          score={score}
          score2={score2}
          gameMode={gameMode}
          timeLeft={timeLeft}
          finishTime1={finishTime1}
          finishTime2={finishTime2}
          lives={lives}
          lives2={lives2}
          onRestart={() => startNewGame(gameMode, selectedLevel, selectedLesson)}
          onHome={() => setGameState('start')}
          onNextLevel={goToNextLevel}
        />
      )}
    </div>
  );
}
