import { allColors, allNumbers, allPoints, allSuits } from './utils/const';
import { PokerCard } from './utils/types';

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
