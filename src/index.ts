import * as _ from "lodash";

// a = 4, b = 5, ..., k = A, l = 2, m = 3
const allNumbers: string[] = _.range(13).map((_val) =>
  String.fromCharCode(97 + _val),
);
// A = ♦, B = ♣, C = ♥, D = ♠
const allColors: string[] = _.range(4).map((_val) =>
  String.fromCharCode(65 + _val),
);

// aA = ♦4, ...
const allCards = _.flatten(
  allNumbers.map((_num) =>
    allColors.map((_color) =>
      `${_num}${_color}`,
    ),
  ),
);

export const MIN_4 = "aA";
export const BIG_A = "kD";
export const BIG_3 = "mD";

const FAKE_HAND: Hand = {
  dominant: '',
  type: HANDTYPE.Fake,
}

/**
 * Shuffle cards for a new game.
 */
export function shuffleCards(): any[][] {
  const sCards = _.shuffle(allCards);
  const starter = _.findIndex(sCards, MIN_4) / 13;
  return [
    sCards.slice(0, 13),
    sCards.slice(13, 26),
    sCards.slice(26, 39),
    sCards.slice(39, 52),
    [starter],
  ];
};

/**
 * Check if the hand is a double.
 * @param cards string[]
 * @returns [string, number]
 */
const digestDouble = (cards: string[]): Hand => {
  if (cards.length !== 2) { return FAKE_HAND; }
  if (cards[0][0] !== cards[1][0]) { return FAKE_HAND; }
  return {
    dominant: _.max(cards) || "",
    type: HANDTYPE.Double,
  };
};

/**
 * Check if the hand is a five-card
 * @param cards string[]
 */
const digestFives = (cards: string[]): Hand => {
  if (cards.length !== 5) { return FAKE_HAND; }
  cards = cards.sort();
  // Check if it's straight or flush
  let sFlag = true;
  let fFlag = true;
  // for (let i = 0; i < 4; i++) {
  //   if (
  //     cards[i].charCodeAt(0) - cards[i + 1].charCodeAt(0) !== -1
  //   ) {
  //     sFlag = false;
  //   }
  //   if (
  //     cards[i].charCodeAt(0) - cards[i + 1].charCodeAt(0) !== -9
  //   ) {
  //     sFlag = false;
  //   }
  //   if (cards[i][1] !== cards[i + 1][1]) {
  //     fFlag = false;
  //   }
  // }
  // if (sFlag && fFlag) { return [cards[4], 3]; }
  // if (sFlag) { return [cards[4], 1]; }
  // if (fFlag) { return [cards[4], 0]; }
  // CHECK FLUSH
  const colors = _.map(cards, (_card) => _card[1]);
  fFlag = _.union(colors).length === 1;

  // CHECK STRAIGHT
  const doubleCards: any[] = [];
  doubleCards.concat(cards.map(_card => _card.charCodeAt(0)));
  doubleCards.concat(cards.map(_card => _card.charCodeAt(0) + 13))
  let uprisingCnt = 0;
  let dominantIdx = 0;
  for (let i = 0; i < 9; i++) {
    if (doubleCards[i + 1] - doubleCards[i] === 1) {
      uprisingCnt++;
    } else {
      uprisingCnt = 0;
    }
    if (uprisingCnt === 4) {
      dominantIdx = uprisingCnt % 5;
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

  const divides: DynamicObj = {};
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
    // case 2: return [_.max(groups[1]), 1];
    // case 3: return [_.max(groups[0]), 1];
    // case 1: return [_.max(groups[1]), 2];
    // case 4: return [_.max(groups[0]), 2];
    case 2: case 3:
      return {
        dominant: _.max(groups[3 - groups[0].length]) || "",
        type: HANDTYPE.House,
      };
    case 1: case 4:
      return {
        dominant: _.max(groups[(5 - groups[0].length) >> 1]) || "",
        type: HANDTYPE.Four,
      };
    default: return FAKE_HAND;
  }
};

const isCardLegal = (cards: string[]): boolean => {
  if (_.union(cards).length !== cards.length) {
    return false;
  }
  if (!_.includes([1, 2, 5], cards.length)) {
    return false;
  }
  const everyCardRes = !_.every(cards, (_card) => {
    return _card.length === 2
      && _card[0] <= "m" && cards[0] >= "a"
      && _card[1] <= "D" && _card[1] >= "A";
  });
  if (everyCardRes) {
    return false;
  }
  return true;
};

export const isHandLegal = (cards: string[], lastHand: string[]): boolean => {
  if (!isCardLegal(cards)) {
    return false;
  }
  if (lastHand.length !== 0 && lastHand.length !== cards.length) {
    return false;
  }
  if (lastHand.length === 0) {
    return _.includes(cards, MIN_4) && (
      cards.length === 1
      || digestDouble(cards).type === HANDTYPE.Single
      || digestFives(cards).type > HANDTYPE.Five
    );
  } else {
    switch (cards.length) {
      case 1: return cards[0] > lastHand[0];
      case 2: return digestDouble(cards).dominant > digestDouble(lastHand).dominant;
      case 5:
        const dc = digestFives(cards);
        const dh = digestFives(lastHand);
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
};
