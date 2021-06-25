import _ from 'lodash';
import { compareHands, digestHand, shuffleCards } from './play';
import { MIN_4 } from './utils/const';
import { CardStack, HANDTYPE, PlayerCardsList, PlayerIdList } from './utils/types';
import { canIplayAnything, canIplayFirst } from './utils/util';

export default class Game {
  private _stacks: CardStack = [];
  private _playerIds: PlayerIdList;
  private _curIdx = 0;
  private _playerCards: PlayerCardsList = {};

  private _bossesPlayers: string[] = [];
  private _farmerPlayers: string[] = [];

  public get stacks() {
    return this._stacks;
  }

  // 当前可以出牌的用户
  public get curIdx() {
    return this._curIdx;
  }

  public get isBossesWin(): boolean {
    return !!this._bossesPlayers.length && this._bossesPlayers.every(playerId => !this._playerCards[playerId].length);
  }

  public get isFarmerWin(): boolean {
    return !!this._farmerPlayers.length && this._farmerPlayers.every(playerId => !this._playerCards[playerId].length);
  }

  public get isGameOver() {
    return this.isBossesWin || this.isFarmerWin;
  }

  public get curPlayerId() {
    return this._playerIds[this._curIdx];
  }

  public get playerCards() {
    return this._playerCards;
  }

  private get curPlayerCards() {
    return this._playerCards[this.curPlayerId];
  }

  // new Game即开局
  constructor(_playerIds: PlayerIdList) {
    this._playerIds = _playerIds;

    const shuffleRes = shuffleCards();
    this._curIdx = shuffleRes.starter;
    this._playerIds.forEach((playerId, idx) => {
      this._playerCards[playerId] = shuffleRes.hands[idx];
    });
  }

  public play(userId: string, hands: string[]): boolean {
    if (this.isGameOver) {
      return false;
    }
    if (!this.handleHands(userId, hands)) {
      return false;
    }
    this.consumeHands(userId, hands);
    this.moveToNextPlayer();
    return true;
  }

  private handleHands(userId: string, hands: string[]): boolean {
    if (userId !== this.curPlayerId) {
      return false;
    }
    const playersCards = this._playerCards[userId];
    if (hands.some(card => !playersCards.includes(card))) {
      return false;
    }
    if (digestHand(hands).type === HANDTYPE.Fake) {
      return false;
    }
    if (canIplayFirst(this._stacks, this.curPlayerCards)) {
      if (!hands.includes(MIN_4)) {
        return false;
      }
      return true;
    }
    const playAnythingRes = canIplayAnything(this._stacks, userId);
    if (playAnythingRes[0]) {
      return true;
    }
    const lastHands = this._stacks[playAnythingRes[1]];
    const cmpRes = compareHands(hands, lastHands[1]);
    if (cmpRes) {
      return true;
    }
    return false;
  }

  private consumeHands(userId: string, hands: string[]): string[] {
    this._playerCards[userId] = _.difference(this._playerCards[userId], hands);
    this._stacks.push([userId, hands, this._playerCards[userId].length]);
    return this.curPlayerCards;
  }

  private moveToNextPlayer() {
    let moveCnt = 0;
    // 理论上应该不会所有人都无牌，仅防止死循环
    while (moveCnt <= 4) {
      this._curIdx = (this._curIdx + 1) % 4;
      moveCnt += 1;
      if (this.curPlayerCards.length > 0) {
        break;
      }
      // 当前人已经无牌，加一条记录继续轮换
      this.consumeHands(this.curPlayerId, []);
    }
  }
}
