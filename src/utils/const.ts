import _ from 'lodash';
import { Hand, HANDTYPE } from './types';

export const MIN_4 = 'aA';
export const BIG_A = 'kD';
export const BIG_3 = 'mD';

export const FAKE_HAND: Hand = {
  dominant: '',
  type: HANDTYPE.Fake,
};

// a = 4, b = 5, ..., k = A, l = 2, m = 3
export const allNumbers: string[] = _.range(13).map(_val => String.fromCharCode(97 + _val));
// A = ♦, B = ♣, C = ♥, D = ♠
export const allColors: string[] = _.range(4).map(_val => String.fromCharCode(65 + _val));

// For Poker.js
export const allPoints = ['4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2', '3'];
export const allSuits = ['♦', '♣', '♥', '♠'];

// aA = ♦4, ...
export const allCards = _.flatten(allNumbers.map(_num => allColors.map(_color => `${_num}${_color}`)));
