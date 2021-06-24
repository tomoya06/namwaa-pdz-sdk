import { expect } from 'chai';
import { describe } from 'mocha';
import { extractAllPlayableHands } from '../bot';
import { digestHand, shuffleCards } from '../play';
import { cardEncoder, displayHands } from '../transform';
import { HANDTYPE } from '../utils/types';

function printHands(hands?: string[][]): string {
  if (!hands || !hands.length) {
    return '-';
  }
  return hands.map(hand => displayHands(hand)).join(' | ');
}

describe('+ Bot', () => {
  const shuffleRes = shuffleCards();
  const { hands: allPlayersHands, starter } = shuffleRes;
  allPlayersHands.forEach(hands => {
    checkHands(hands);
  });
});

describe('+ custom', () => {
  const customHands = '♦4 ♥4 ♠4 ♠5 ♠6 ♣7 ♥7 ♠7 ♥8 ♦10 ♠Q ♦2 ♥3';
  const realHands = customHands.split(' ').map(card => cardEncoder({ point: card.slice(1), suit: card[0] }));
  checkHands(realHands);
});

function checkHands(hands: string[]) {
  describe(`- Player hands extraction: `, () => {
    console.log('---');
    console.log('my cards: ');
    console.log(displayHands(hands));

    const extractRes = extractAllPlayableHands(hands);

    const testArr: Array<[HANDTYPE, string]> = [
      [HANDTYPE.Double, 'Double'],
      [HANDTYPE.Flush, 'Flush'],
      [HANDTYPE.Straight, 'Straight'],
      [HANDTYPE.House, 'House'],
      [HANDTYPE.Four, 'Four'],
      [HANDTYPE.FS, 'FS'],
    ];

    testArr.forEach(([type, msg]) => {
      const curRes = extractRes.get(type);
      console.log(`- ${msg}: `, printHands(curRes));
      if (curRes && curRes.length) {
        it(msg, () => {
          expect(curRes).to.satisfy((res: string[][]) => {
            return res.every(r => digestHand(r).type === type);
          });
        });
      }
    });
  });
}
