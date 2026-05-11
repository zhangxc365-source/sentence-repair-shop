import { Sentence } from '../types';
import { yct4SentencesL1 } from './yct4_sentences_l1';
import { yct4SentencesL3 } from './yct4_sentences_l3';
import { yct4SentencesL4L5 } from './yct4_sentences_l4_l5';
import { yct4SentencesL6 } from './yct4_sentences_l6';
import { yct4SentencesL7L8 } from './yct4_sentences_l7_l8';
import { yct4SentencesL9L10 } from './yct4_sentences_l9_l10';
import { yct4SentencesL11 } from './yct4_sentences_l11';
import { yct4SentencesExisting } from './yct4_sentences_existing';

export const yct4Sentences: Sentence[] = [
  ...yct4SentencesL1,
  ...yct4SentencesL3,
  ...yct4SentencesL4L5,
  ...yct4SentencesL6,
  ...yct4SentencesL7L8,
  ...yct4SentencesL9L10,
  ...yct4SentencesL11,
  ...yct4SentencesExisting
];

