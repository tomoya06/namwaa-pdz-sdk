import _ from 'lodash';
import { allCards, allColors, allNumbers, allPoints, allSuits, FAKE_HAND, MIN_4 } from './utils/const';
import { digestDouble, digestFives, digestSingle } from './utils/digest';
import { Hand, HANDTYPE, PokerCard, ShuffleResult } from './utils/types';

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
 * check if your cards can form a legal hand. including single, double and fives.
 * @param cards string[] cards to be check
 */
export function digestHand(cards: string[]): Hand {
  // CHECK if repeats
  if (_.uniq(cards).length !== cards.length) {
    return FAKE_HAND;
  }
  // CHECK if every card is a CARD.
  const everyCardRes = _.every(cards, _card => {
    return _card.length === 2 && _card[0] <= 'm' && cards[0] >= 'a' && _card[1] <= 'D' && _card[1] >= 'A';
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
    return _.includes(hands, MIN_4) && digestHand(hands).type !== HANDTYPE.Fake;
  }
  const dc = digestHand(hands);
  const dh = digestHand(lastHand);
  switch (hands.length) {
    case 1:
      return hands[0] > lastHand[0];
    case 2:
      return dc.dominant > dh.dominant;
    case 5:
      return (
        // Larger type
        dc.type > dh.type ||
        // Flush, larger color
        (dc.type === dh.type &&
          (dc.type === HANDTYPE.Flush || dc.type === HANDTYPE.FS) &&
          (dc.dominant[1] > dh.dominant[1] || (dc.dominant[1] === dh.dominant[1] && dc.dominant > dh.dominant))) ||
        // Other, larger dominant card
        (dc.type === dh.type && (dc.type !== HANDTYPE.Flush && dc.type !== HANDTYPE.FS) && dc.dominant > dh.dominant)
      );
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

export function cardDecoderForDisplay(card: string): string {
  const cd = cardDecoder(card);
  return `${cd.suit}${cd.point}`;
}

export function displayHands(hands: string[]): string {
  return hands.map(card => cardDecoderForDisplay(card)).join(' ');
}

export function cardEncoder(poker: PokerCard): string {
  const numberIdx = allPoints.indexOf(poker.point);
  const colorIdx = allSuits.indexOf(poker.suit);

  return `${allNumbers[numberIdx]}${allColors[colorIdx]}`;
}
