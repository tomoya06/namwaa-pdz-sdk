import combinations from 'combinations';
import _ from 'lodash';
import { legalStraights, MIN_4 } from './utils/const';
import { HANDTYPE } from './utils/types';

export type CardStack = Array<[string, string[][]]>;
export type HandPool = Map<HANDTYPE, string[][]>;

export interface BotConfig {
  fromSmallRate: number;
}

function cardMapper(myCards: string[]) {
  const pointCardMap: { [pt: string]: string[] } = {};
  
  // 单张牌 无脑出
  myCards.forEach(card => {
    const curPoint = card[0];
    pointCardMap[curPoint] = pointCardMap[curPoint]
    ? [...pointCardMap[curPoint], card]
    : [card];
  });

  return pointCardMap;
}

function suitMapper(myCards: string[]) {
  const suitCardMap: {[suit: string]: string[]} = {};

  for (const suit of 'ABCD') {
    suitCardMap[suit] = myCards.filter(card => card[1] === suit);
  }

  return suitCardMap;
}

function isStraight(hands: string[]): boolean {
  hands.sort();
  return hands.every((card, idx) => card.charCodeAt(0) - idx === hands[0].charCodeAt(0) - 0);
}

export function extractAllPlayableHands(myCards: string[]): HandPool {
  const res: HandPool = new Map();
  myCards.sort();

  const cardMap = cardMapper(myCards);
  const suitMap = suitMapper(myCards);

  const h1s = myCards.map(card => [card]);
  const h2s = Object.values(cardMap).filter((val) => val.length >= 2);
  const h3s = Object.values(cardMap).filter((val) => val.length >= 3);
  const h4s = Object.values(cardMap).filter((val) => val.length >= 4);
  
  res.set(HANDTYPE.Single, h1s);

  if (h2s.length) {
    const dbRes: string[][] = []
    h2s.forEach(cards => {
      const curRes = combinations(cards, 2, 2);
      dbRes.push(...curRes);
    })
    res.set(HANDTYPE.Double, dbRes);
  }

  // 同花 & 同花顺
  const fsRes: string[][] = [];
  const flushRes: string[][] = [];
  Object.values(suitMap).forEach(cards => {
    if (cards.length >= 5) {
      const combRes = combinations(cards, 5, 5);
      combRes.forEach(hands => {
        if (isStraight(hands)) {
          fsRes.push(hands);
        } else {
          flushRes.push(hands);
        }
      })
    }
  })
  res.set(HANDTYPE.Flush, flushRes);
  res.set(HANDTYPE.FS, fsRes);

  // 顺子(不包含同花顺)
  // 同一串数字的顺子 只取消耗最小的一副
  const straightRes: string[][] = [];
  legalStraights.forEach(ls => {
    const lsEnough = ls.every(lsKey => cardMap[lsKey]);
    if (lsEnough) {
      const cards = ls.map(lsKey => cardMap[lsKey][0]);
      if (!cards.every(card => card[1] === cards[0][1])) {
        straightRes.push(cards);
      }
    }
  })
  res.set(HANDTYPE.Straight, straightRes);

  // 富庶
  // 只取消耗最小的一副
  const houseRes: string[][] = [];
  if (h3s.length && h2s.length) {
    h3s.forEach(cards => {
      const res3 = cards.slice(0,3);

      h2s.forEach(cards2 => {
        if (cards2[0][0] === cards[0][0]) { return; }
        const res2 = cards2.slice(0,2);
        houseRes.push([...res2, ...res3].sort());
      })
    })
  }
  res.set(HANDTYPE.House, houseRes);

  // 福禄
  // 只取消耗最小的一副
  const fourRes: string[][] = [];
  if (h4s.length) {
    h4s.forEach(cards => {
      h1s.forEach(cards1 => {
        if (cards1[0][0] === cards[0][0]) { return; }
        fourRes.push([cards1[0], ...cards]);
      })
    })
  }
  res.set(HANDTYPE.Four, fourRes);

  return res;
}

function canIplayFirst(stacks: CardStack, myCards: string[]): boolean {
  if (stacks.length !== 0) { return false; }
  return _.includes(myCards, MIN_4);
}

function playFirst(myCards: string[], botConfig: BotConfig): string[] {
  // TODO: 先发
  return [];
}

// 情况2
function canIplayAnything(stacks: CardStack, myId: string): [boolean, number] {
  // 堆栈里肯定要有至少4条记录
  const len = stacks.length;
  if (len < 4) { return [false, len - 1]; }

  function isHePass(idx: number) {
    return stacks[idx] && stacks[idx][0] !== myId && stacks[idx][1].length === 0;
  }

  for (let i = len - 1; i >= len - 3; i -= 1) {
    if (!isHePass(i)) {
      return [false, i];
    }
  }

  return [true, -1];
}

/**
 * 机器自动出一手牌
 */
export function botPlay(stacks: CardStack, myCards: string[], myId: string, botConfig: BotConfig): string[] {
  // 1. 我先出
  if (canIplayFirst(stacks, myCards)) {
    return playFirst(myCards, botConfig);
  }
  // 2. 其他人都不要
  // 3. 打上家
  // 4. 打不过
  return [];
}