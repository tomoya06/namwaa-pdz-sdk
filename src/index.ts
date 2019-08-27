import * as _ from 'lodash';

// export enum SUIT {
//   hearts,
//   diamonds,
//   spades,
//   clubs,
// }

export enum HANDTYPE {
  Fake = -1,
  Single = 1,
  Double = 2, // 对子
  Five = 5, // 无意义，作为分界
  Flush, // 同花
  Straight, // 顺子
  House, // 富庶
  Four, // 福禄
  FS, // 同花顺
}

interface DynamicObject {
  [key: string]: any;
}

export interface ShuffleResult {
  hands: string[][];
  starter: number;
}

export interface Hand {
  dominant: string;
  type: HANDTYPE;
}

export interface PokerCard {
  suit: string;
  point: string;
}

// a = 4, b = 5, ..., k = A, l = 2, m = 3
const allNumbers: string[] = _.range(13).map((_val) =>
  String.fromCharCode(97 + _val),
);
// A = ♦, B = ♣, C = ♥, D = ♠
const allColors: string[] = _.range(4).map((_val) =>
  String.fromCharCode(65 + _val),
);

// For Poker.js
const allPoints = ['4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2', '3'];
const allSuits = ['diamonds', 'clubs', 'hearts', 'spades'];

// aA = ♦4, ...
const allCards = _.flatten(
  allNumbers.map((_num) =>
    allColors.map((_color) =>
      `${_num}${_color}`,
    ),
  ),
);

export const MIN_4 = 'aA';
export const BIG_A = 'kD';
export const BIG_3 = 'mD';

const FAKE_HAND: Hand = {
  dominant: '',
  type: HANDTYPE.Fake,
};

/**
 * Shuffle cards for a new game.
 */
export function shuffleCards(): ShuffleResult {
  const sCards = _.shuffle(allCards);
  const starter = Math.floor(sCards.indexOf(MIN_4) / 13);
  return {
    hands: [
      sCards.slice(0, 13).sort(),
      sCards.slice(13, 26).sort(),
      sCards.slice(26, 39).sort(),
      sCards.slice(39, 52).sort(),
    ],
    starter,
  };
}

/**
 * check if the hand is single
 * @param cards string[]
 */
function digestSingle(cards: string[]): Hand {
  if (cards.length !== 1) { return FAKE_HAND; }
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
function digestDouble(cards: string[]): Hand {
  if (cards.length !== 2) { return FAKE_HAND; }
  if (cards[0][0] !== cards[1][0]) { return FAKE_HAND; }
  return {
    dominant: _.max(cards) || cards[0],
    type: HANDTYPE.Double,
  };
}

/**
 * Check if the hand is a five-card
 * @param fcards string[]
 */
function digestFives(fcards: string[]): Hand {
  if (fcards.length !== 5) { return FAKE_HAND; }
  const cards = _.sortBy(fcards);
  // Check if it's straight or flush
  let sFlag = false;
  let fFlag = false;
  // CHECK FLUSH
  const colors = _.map(cards, (_card) => _card[1]);
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
  cards.forEach((_card) => {
    if (_.includes(Object.keys(divides), _card[0])) {
      divides[_card[0]].push(_card);
    } else {
      divides[_card[0]] = [_card];
    }
  });
  if (Object.keys(divides).length !== 2) { return FAKE_HAND; }
  const groups = _.values(divides) as string[][];
  switch (groups[0].length) {
    case 2: case 3:
      return {
        dominant: _.max(groups[3 - groups[0].length]) || '',
        type: HANDTYPE.House,
      };
    case 1: case 4:
      return {
        dominant: _.max(groups[(4 - groups[0].length) >> 1]) || '',
        type: HANDTYPE.Four,
      };
    default: return FAKE_HAND;
  }
}

/**
 * check if your cards can form a legal hand. including single, double and fives.
 * @param cards string[] cards to be check
 */
export function digestHand(cards: string[]): Hand {
  // CHECK if repeats
  if (_.uniq(cards).length !== cards.length) {
    return FAKE_HAND;
  }
  // CHECK if every card is a CARD.
  const everyCardRes = _.every(cards, (_card) => {
    return _card.length === 2
      && _card[0] <= 'm' && cards[0] >= 'a'
      && _card[1] <= 'D' && _card[1] >= 'A';
  });
  if (!everyCardRes) {
    return FAKE_HAND;
  }
  // CHECK if this is a literal hand
  switch (cards.length) {
    case 1:
      return digestSingle(cards);
    case 2:
      return digestDouble(cards);
    case 5:
      return digestFives(cards);
    default:
      return FAKE_HAND;
  }
}

/**
 * compare if current hand is larger than the last one. if lasthand is empty array, it means current hand is playing at the first place.
 * @param hands string[] current hands
 * @param lastHand string[] last hands
 */
export function compareHands(hands: string[], lastHand: string[]): boolean {
  if (lastHand.length !== 0 && lastHand.length !== hands.length) {
    return false;
  }
  if (lastHand.length === 0) {
    return _.includes(hands, MIN_4) &&
      digestHand(hands).type !== HANDTYPE.Fake;
  } {
    const dc = digestHand(hands);
    const dh = digestHand(lastHand);
    switch (hands.length) {
      case 1: return hands[0] > lastHand[0];
      case 2: return dc.dominant > dh.dominant;
      case 5:
        return (
          // Larger type
          dc.type > dh.type
          // Flush, larger color
          || dc.type === dh.type && (dc.type === HANDTYPE.Flush || dc.type === HANDTYPE.FS)
          && (dc.dominant[1] > dh.dominant[1] || dc.dominant[1] === dh.dominant[1] && dc.dominant > dh.dominant)
          // Other, larger dominant card
          || dc.type === dh.type && (dc.type !== HANDTYPE.Flush && dc.type !== HANDTYPE.FS) && dc.dominant > dh.dominant
        );
    }
  }
  return false;
}

export function cardDecoder(card: string): PokerCard {
  const pointIdx = allNumbers.indexOf(card.charAt(0));
  const suitIdx = allColors.indexOf(card.charAt(1));

  return {
    point: allPoints[pointIdx],
    suit: allSuits[suitIdx],
  };
}

export function cardEncoder(poker: PokerCard): string {
  const numberIdx = allPoints.indexOf(poker.point);
  const colorIdx = allSuits.indexOf(poker.suit);

  return `${allNumbers[numberIdx]}${allColors[colorIdx]}`;
}
