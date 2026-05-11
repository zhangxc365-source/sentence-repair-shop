import { Sentence } from '../types';
import { yct2SentencesL1L2 } from './yct2_sentences_l1_l2';
import { yct2SentencesL3L4 } from './yct2_sentences_l3_l4';
import { yct2SentencesL5L7 } from './yct2_sentences_l5_l7';
import { yct2SentencesL8L9 } from './yct2_sentences_l8_l9';
import { yct2SentencesL10L11 } from './yct2_sentences_l10_l11';

export const yct2Sentences: Sentence[] = [
  ...yct2SentencesL1L2,
  ...yct2SentencesL3L4,
  ...yct2SentencesL5L7,
  ...yct2SentencesL8L9,
  ...yct2SentencesL10L11
];
