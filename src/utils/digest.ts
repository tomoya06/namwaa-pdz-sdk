import _ from 'lodash';
import { FAKE_HAND } from './const';
import { DynamicObject, Hand, HANDTYPE } from './types';

/**
 * check if the hand is single
 * @param cards string[]
 */
export function digestSingle(cards: string[]): Hand {
  if (cards.length !== 1) {
    return FAKE_HAND;
  }
  return {
    dominant: cards[0],
    type: HANDTYPE.Single,
  };
}

/**
 * Check if the hand is a double.
 * @param cards string[]
 * @returns [string, number]
 */
export function digestDouble(cards: string[]): Hand {
  if (cards.length !== 2) {
    return FAKE_HAND;
  }
  if (cards[0][0] !== cards[1][0]) {
    return FAKE_HAND;
  }
  return {
    dominant: _.max(cards) || cards[0],
    type: HANDTYPE.Double,
  };
}

/**
 * Check if the hand is a five-card
 * @param fcards string[]
 */
export function digestFives(fcards: string[]): Hand {
  if (fcards.length !== 5) {
    return FAKE_HAND;
  }
  const cards = _.sortBy(fcards);
  // Check if it's straight or flush
  let sFlag = false;
  let fFlag = false;
  // CHECK FLUSH
  const colors = _.map(cards, _card => _card[1]);
  fFlag = _.uniq(colors).length === 1;

  // CHECK STRAIGHT
  let doubleCards: number[] = [];
  doubleCards = _.concat(doubleCards, cards.map(_card => _card.charCodeAt(0)));
  doubleCards = _.concat(doubleCards, cards.map(_card => _card.charCodeAt(0) + 13));
  let uprisingCnt = 0;
  let dominantIdx = 0;
  for (let i = 0; i < 9; i++) {
    if (doubleCards[i + 1] - doubleCards[i] === 1) {
      uprisingCnt++;
    } else {
      uprisingCnt = 0;
    }
    if (uprisingCnt === 4) {
      dominantIdx = (i + 1) % 5;
      sFlag = true;
      break;
    }
  }

  if (sFlag && fFlag) {
    return {
      dominant: cards[dominantIdx],
      type: HANDTYPE.FS,
    };
  }
  if (sFlag) {
    return {
      dominant: cards[dominantIdx],
      type: HANDTYPE.Straight,
    };
  }
  if (fFlag) {
    return {
      dominant: cards[4],
      type: HANDTYPE.Flush,
    };
  }

  const divides: DynamicObject = {};
  cards.forEach(_card => {
    if (_.includes(Object.keys(divides), _card[0])) {
      divides[_card[0]].push(_card);
    } else {
      divides[_card[0]] = [_card];
    }
  });
  if (Object.keys(divides).length !== 2) {
    return FAKE_HAND;
  }
  const groups = _.values(divides) as string[][];
  switch (groups[0].length) {
    case 2:
    case 3:
      return {
        dominant: _.max(groups[3 - groups[0].length]) || '',
        type: HANDTYPE.House,
      };
    case 1:
    case 4:
      return {
        dominant: _.max(groups[(4 - groups[0].length) >> 1]) || '',
        type: HANDTYPE.Four,
      };
    default:
      return FAKE_HAND;
  }
}
