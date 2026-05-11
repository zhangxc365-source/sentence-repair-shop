import { Sentence } from '../types';
import { yct3SentencesL1L2 } from './yct3_sentences_l1_l2';
import { yct3SentencesL2L5 } from './yct3_sentences_l2_l5';
import { yct3SentencesL4 } from './yct3_sentences_l4';
import { yct3SentencesL6L7 } from './yct3_sentences_l6_l7';
import { yct3SentencesL8L11 } from './yct3_sentences_l8_l11';
import { yct3SentencesL9L11Part2 } from './yct3_sentences_l9_l11_part2';

export const yct3Sentences: Sentence[] = [
  ...yct3SentencesL1L2,
  ...yct3SentencesL2L5,
  ...yct3SentencesL4,
  ...yct3SentencesL6L7,
  ...yct3SentencesL8L11,
  ...yct3SentencesL9L11Part2
];
