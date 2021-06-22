import _ from 'lodash';
import { MIN_4 } from './utils/const';

export type CardStack = Array<[string, string[][]]>;

export interface BotConfig {
  fromSmallRate: number;
}

function extractAllPlayableHands(myCards: string[]): string[][] {
  const res: string[][] = [];
  myCards.sort();

  // 单张牌 无脑出
  myCards.forEach(card => {
    res.push([card]);
  });

  const pointCntMap: { [pt: string]: number } = {};

  // 找对子
  for (let i = 0; i < myCards.length; i += 1) {
    pointCntMap[myCards[i][0]] = pointCntMap[myCards[i][0]] ? pointCntMap[myCards[i][0]] + 1 : 1;
    if (myCards[i] && myCards[i + 1] && myCards[i][0] === myCards[i + 1][0]) {
      res.push([myCards[i], myCards[i + 1]]);
    }
  }

  return res;
}

function canIplayFirst(stacks: CardStack, myCards: string[]): boolean {
  if (stacks.length !== 0) return false;
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
  if (len < 4) return [false, len - 1];

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
