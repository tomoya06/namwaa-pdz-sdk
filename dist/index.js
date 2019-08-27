"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = __importStar(require("lodash"));
// export enum SUIT {
//   hearts,
//   diamonds,
//   spades,
//   clubs,
// }
var HANDTYPE;
(function (HANDTYPE) {
    HANDTYPE[HANDTYPE["Fake"] = -1] = "Fake";
    HANDTYPE[HANDTYPE["Single"] = 1] = "Single";
    HANDTYPE[HANDTYPE["Double"] = 2] = "Double";
    HANDTYPE[HANDTYPE["Five"] = 5] = "Five";
    HANDTYPE[HANDTYPE["Flush"] = 6] = "Flush";
    HANDTYPE[HANDTYPE["Straight"] = 7] = "Straight";
    HANDTYPE[HANDTYPE["House"] = 8] = "House";
    HANDTYPE[HANDTYPE["Four"] = 9] = "Four";
    HANDTYPE[HANDTYPE["FS"] = 10] = "FS";
})(HANDTYPE = exports.HANDTYPE || (exports.HANDTYPE = {}));
// a = 4, b = 5, ..., k = A, l = 2, m = 3
var allNumbers = _.range(13).map(function (_val) {
    return String.fromCharCode(97 + _val);
});
// A = ♦, B = ♣, C = ♥, D = ♠
var allColors = _.range(4).map(function (_val) {
    return String.fromCharCode(65 + _val);
});
// For Poker.js
var allPoints = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
var allSuits = ['diamonds', 'clubs', 'hearts', 'spades'];
// aA = ♦4, ...
var allCards = _.flatten(allNumbers.map(function (_num) {
    return allColors.map(function (_color) {
        return "" + _num + _color;
    });
}));
exports.MIN_4 = "aA";
exports.BIG_A = "kD";
exports.BIG_3 = "mD";
var FAKE_HAND = {
    dominant: '',
    type: HANDTYPE.Fake,
};
/**
 * Shuffle cards for a new game.
 */
function shuffleCards() {
    var sCards = _.shuffle(allCards);
    var starter = Math.floor(sCards.indexOf(exports.MIN_4) / 13);
    return {
        hands: [
            sCards.slice(0, 13).sort(),
            sCards.slice(13, 26).sort(),
            sCards.slice(26, 39).sort(),
            sCards.slice(39, 52).sort(),
        ],
        starter: starter,
    };
}
exports.shuffleCards = shuffleCards;
;
/**
 * check if the hand is single
 * @param cards string[]
 */
function digestSingle(cards) {
    if (cards.length !== 1) {
        return FAKE_HAND;
    }
    return {
        dominant: cards[0],
        type: HANDTYPE.Single,
    };
}
/**
 * Check if the hand is a double.
 * @param cards string[]
 * @returns [string, number]
 */
function digestDouble(cards) {
    if (cards.length !== 2) {
        return FAKE_HAND;
    }
    if (cards[0][0] !== cards[1][0]) {
        return FAKE_HAND;
    }
    return {
        dominant: _.max(cards) || cards[0],
        type: HANDTYPE.Double,
    };
}
;
/**
 * Check if the hand is a five-card
 * @param fcards string[]
 */
function digestFives(fcards) {
    if (fcards.length !== 5) {
        return FAKE_HAND;
    }
    var cards = _.sortBy(fcards);
    // Check if it's straight or flush
    var sFlag = false;
    var fFlag = false;
    // CHECK FLUSH
    var colors = _.map(cards, function (_card) { return _card[1]; });
    fFlag = _.uniq(colors).length === 1;
    // CHECK STRAIGHT
    var doubleCards = [];
    doubleCards = _.concat(doubleCards, cards.map(function (_card) { return _card.charCodeAt(0); }));
    doubleCards = _.concat(doubleCards, cards.map(function (_card) { return _card.charCodeAt(0) + 13; }));
    var uprisingCnt = 0;
    var dominantIdx = 0;
    for (var i = 0; i < 9; i++) {
        if (doubleCards[i + 1] - doubleCards[i] === 1) {
            uprisingCnt++;
        }
        else {
            uprisingCnt = 0;
        }
        if (uprisingCnt === 4) {
            dominantIdx = (i + 1) % 5;
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
    var divides = {};
    cards.forEach(function (_card) {
        if (_.includes(Object.keys(divides), _card[0])) {
            divides[_card[0]].push(_card);
        }
        else {
            divides[_card[0]] = [_card];
        }
    });
    if (Object.keys(divides).length !== 2) {
        return FAKE_HAND;
    }
    var groups = _.values(divides);
    switch (groups[0].length) {
        case 2:
        case 3:
            return {
                dominant: _.max(groups[3 - groups[0].length]) || "",
                type: HANDTYPE.House,
            };
        case 1:
        case 4:
            return {
                dominant: _.max(groups[(4 - groups[0].length) >> 1]) || "",
                type: HANDTYPE.Four,
            };
        default: return FAKE_HAND;
    }
}
;
/**
 * check if your cards can form a legal hand. including single, double and fives.
 * @param cards string[] cards to be check
 */
function digestHand(cards) {
    // CHECK if repeats
    if (_.uniq(cards).length !== cards.length) {
        return FAKE_HAND;
    }
    // CHECK if every card is a CARD.
    var everyCardRes = _.every(cards, function (_card) {
        return _card.length === 2
            && _card[0] <= "m" && cards[0] >= "a"
            && _card[1] <= "D" && _card[1] >= "A";
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
exports.digestHand = digestHand;
;
/**
 * compare if current hand is larger than the last one. if lasthand is empty array, it means current hand is playing at the first place.
 * @param hands string[] current hands
 * @param lastHand string[] last hands
 */
function compareHands(hands, lastHand) {
    if (lastHand.length !== 0 && lastHand.length !== hands.length) {
        return false;
    }
    if (lastHand.length === 0) {
        return _.includes(hands, exports.MIN_4) &&
            digestHand(hands).type !== HANDTYPE.Fake;
    }
    else {
        var dc = digestHand(hands);
        var dh = digestHand(lastHand);
        switch (hands.length) {
            case 1: return hands[0] > lastHand[0];
            case 2: return dc.dominant > dh.dominant;
            case 5:
                return (
                // Larger type
                dc.type > dh.type
                    // Flush, larger color
                    || dc.type === dh.type && (dc.type === HANDTYPE.Flush || dc.type === HANDTYPE.FS)
                        && (dc.dominant[1] > dh.dominant[1] || dc.dominant[1] === dh.dominant[1] && dc.dominant > dh.dominant)
                    // Other, larger dominant card
                    || dc.type === dh.type && (dc.type !== HANDTYPE.Flush && dc.type !== HANDTYPE.FS) && dc.dominant > dh.dominant);
        }
    }
    return false;
}
exports.compareHands = compareHands;
;
function cardDecoder(card) {
    var pointIdx = allNumbers.indexOf(card.charAt(0));
    var suitIdx = allColors.indexOf(card.charAt(1));
    return {
        point: allPoints[pointIdx],
        suit: allSuits[suitIdx],
    };
}
exports.cardDecoder = cardDecoder;
;
function cardEncoder(poker) {
    var numberIdx = allPoints.indexOf(poker.point);
    var colorIdx = allSuits.indexOf(poker.suit);
    return "" + allNumbers[numberIdx] + allColors[colorIdx];
}
exports.cardEncoder = cardEncoder;
//# sourceMappingURL=index.js.map