"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
require("mocha");
var index_1 = require("../index");
var poker = {
    point: 'K',
    suit: 'spades',
};
describe("+ Check Utils", function () {
    describe("- Card Encoder/Decoder", function () {
        it("Encoder", function () {
            chai_1.expect(index_1.cardEncoder(poker)).to.eq('mD');
        });
        it("Decoder", function () {
            var card = 'mD';
            chai_1.expect(index_1.cardDecoder(card)).to.deep.eq(poker);
        });
    });
    describe("- Shuffler", function () {
        it("Just see what happen", function () {
            var shuffleRes = index_1.shuffleCards();
            var hands = shuffleRes.hands;
            var starterIdx = shuffleRes.starter;
            console.log(shuffleRes);
            chai_1.expect(hands[starterIdx]).to.include(index_1.MIN_4);
        });
    });
});
//# sourceMappingURL=card.util.test.js.map