import { expect } from "chai";
import "mocha";

import { cardDecoder, cardEncoder, MIN_4, PokerCard, shuffleCards } from '../index';

const poker: PokerCard = {
  point: '3',
  suit: 'spades',
};

describe("+ Check Utils", () => {
  describe("- Card Encoder/Decoder", () => {
    it("Encoder", () => {
      expect(cardEncoder(poker)).to.eq('mD');
    })

    it("Decoder", () => {
      const card = 'mD';
      expect(cardDecoder(card)).to.deep.eq(poker);
    })
  })

  describe("- Shuffler", () => {
    it("Just see what happen", () => {
      const shuffleRes = shuffleCards();
      const hands = shuffleRes.hands;
      const starterIdx = shuffleRes.starter;
      console.log(shuffleRes);
      expect(hands[starterIdx]).to.include(MIN_4);
    })
  })
})
