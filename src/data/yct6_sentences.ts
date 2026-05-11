import { Sentence } from '../types';
import { yct6SentencesL1L2 } from './yct6_sentences_l1_l2';
import { yct6SentencesL3L5 } from './yct6_sentences_l3_l5';
import { yct6SentencesL6L7 } from './yct6_sentences_l6_l7';
import { yct6SentencesL8L9 } from './yct6_sentences_l8_l9';
import { yct6SentencesL10L11 } from './yct6_sentences_l10_l11';
import { yct6SentencesL12L14 } from './yct6_sentences_l12_l14';

export const yct6Sentences: Sentence[] = [
  ...yct6SentencesL1L2,
  ...yct6SentencesL3L5,
  ...yct6SentencesL6L7,
  ...yct6SentencesL8L9,
  ...yct6SentencesL10L11,
  ...yct6SentencesL12L14
];
