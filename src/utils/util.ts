import _ from 'lodash';
import { MIN_4 } from './const';
import { CardStack } from './types';

export function canIplayFirst(stacks: CardStack, myCards: string[]): boolean {
  if (stacks.length !== 0) {
    return false;
  }
  return _.includes(myCards, MIN_4);
}

export function canIplayAnything(stacks: CardStack, myId: string): [boolean, number] {
  // 堆栈里肯定要有至少4条记录
  const len = stacks.length;
  if (len < 4) {
    return [false, len - 1];
  }

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
