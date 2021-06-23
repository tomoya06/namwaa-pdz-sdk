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

export interface DynamicObject {
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
  suit: '♠' | '♥' | '♣' | '♦' | string;
  point: string;
}

export type CardStackRecord = [string, string[]];
export type CardStack = CardStackRecord[];
export type HandPool = Map<HANDTYPE, string[][]>;
export type PlayerIdList = [string, string, string, string];
export type PlayerCardsList = Record<string, string[]>;
