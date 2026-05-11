import { Sentence } from '../types';
import { yct1Sentences } from './yct1_sentences';
import { yct1SentencesPart2 } from './yct1_sentences_part2';
import { yct2Sentences } from './yct2_sentences';
import { yct3Sentences } from './yct3_sentences';
import { yct4Sentences } from './yct4_sentences';
import { yct5Sentences } from './yct5_sentences';
import { yct6Sentences } from './yct6_sentences';

export const yctSentences: Sentence[] = [
  ...yct1Sentences,
  ...yct1SentencesPart2,
  ...yct2Sentences,
  ...yct3Sentences,
  ...yct4Sentences,
  ...yct5Sentences,
  ...yct6Sentences
];
