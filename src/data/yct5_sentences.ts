import { Sentence } from '../types';
import { yct5SentencesL1L2 } from './yct5_sentences_l1_l2';
import { yct5SentencesL3 } from './yct5_sentences_l3';
import { yct5SentencesL4 } from './yct5_sentences_l4';
import { yct5SentencesL5L6 } from './yct5_sentences_l5_l6';
import { yct5SentencesL7 } from './yct5_sentences_l7';
import { yct5SentencesL8L9 } from './yct5_sentences_l8_l9';
import { yct5SentencesL10L11 } from './yct5_sentences_l10_l11';
import { yct5SentencesL12L13 } from './yct5_sentences_l12_l13';
import { yct5SentencesL14 } from './yct5_sentences_l14';

export const yct5Sentences: Sentence[] = [
  ...yct5SentencesL1L2,
  ...yct5SentencesL3,
  ...yct5SentencesL4,
  ...yct5SentencesL5L6,
  ...yct5SentencesL7,
  ...yct5SentencesL8L9,
  ...yct5SentencesL10L11,
  ...yct5SentencesL12L13,
  ...yct5SentencesL14
];
