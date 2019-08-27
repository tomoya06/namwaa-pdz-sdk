"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
require("mocha");
var index_1 = require("../index");
describe("+ Check Hands", function () {
    describe("- Single", function () {
        it("SINGLE 4", function () {
            chai_1.expect(index_1.digestHand([index_1.MIN_4]).type).to.equal(index_1.HANDTYPE.Single);
        });
    });
    describe("- Double", function () {
        it("Double 2", function () {
            chai_1.expect(index_1.digestHand(["lA", "lB"]).type).to.eq(index_1.HANDTYPE.Double);
        });
        it("Not Double", function () {
            chai_1.expect(index_1.digestHand(["lA", "lA"]).type).to.eq(index_1.HANDTYPE.Fake);
        });
        it("Not Double #2", function () {
            chai_1.expect(index_1.digestHand(["lA", "mA"]).type).to.eq(index_1.HANDTYPE.Fake);
        });
    });
    describe("- Five", function () {
        describe("- FLUSH", function () {
            it("FLUSH", function () {
                chai_1.expect(index_1.digestHand(["lA", "mA", "kA", "aA", "cA"]).type).to.eq(index_1.HANDTYPE.Flush);
            });
            it("NOT FLUSH", function () {
                chai_1.expect(index_1.digestHand(["lC", "mA", "kA", "aA", "cA"]).type).to.eq(index_1.HANDTYPE.Fake);
            });
        });
        describe("- Straight", function () {
            it("Straight", function () {
                chai_1.expect(index_1.digestHand(["aB", "bC", "cA", "dA", "eA"]).type).to.eq(index_1.HANDTYPE.Straight);
            });
            it("Straight", function () {
                chai_1.expect(index_1.digestHand(["aB", "bC", "cA", "lA", "mA"]).type).to.eq(index_1.HANDTYPE.Straight);
                chai_1.expect(index_1.digestHand(["aB", "bC", "cA", "lA", "mA"]).dominant).to.eq('cA');
            });
            it("Straight", function () {
                chai_1.expect(index_1.digestHand(["aA", "bA", "cA", "dA", "eD"]).type).to.eq(index_1.HANDTYPE.Straight);
                chai_1.expect(index_1.digestHand(["aA", "bA", "cA", "dA", "eD"]).dominant).to.eq('eD');
            });
            it("Straight", function () {
                chai_1.expect(index_1.digestHand(["aD", "bD", "cD", "dD", "eA"]).type).to.eq(index_1.HANDTYPE.Straight);
                chai_1.expect(index_1.digestHand(["aD", "bD", "cD", "dD", "eA"]).dominant).to.eq('eA');
            });
            it("NOT Straight", function () {
                chai_1.expect(index_1.digestHand(["aC", "cA", "cB", "dA", "eA"]).type).to.eq(index_1.HANDTYPE.Fake);
            });
            it("NOT Straight", function () {
                chai_1.expect(index_1.digestHand(["aB", "bC", "cA", "lA", "kA"]).type).to.eq(index_1.HANDTYPE.Fake);
            });
        });
        describe("- House", function () {
            it("House", function () {
                chai_1.expect(index_1.digestHand(["aB", "aC", "aA", "dA", "dB"]).type).to.eq(index_1.HANDTYPE.House);
                chai_1.expect(index_1.digestHand(["aB", "aC", "aA", "dA", "dB"]).dominant).to.eq('aC');
            });
            it("Not House", function () {
                chai_1.expect(index_1.digestHand(["aB", "aC", "aA", "dA", "eB"]).type).to.eq(index_1.HANDTYPE.Fake);
            });
            it("Not House", function () {
                chai_1.expect(index_1.digestHand(["aB", "aC", "dA", "dB", "eB"]).type).to.eq(index_1.HANDTYPE.Fake);
            });
            it("House", function () {
                chai_1.expect(index_1.digestHand(["aB", "aC", "dC", "dA", "dB"]).type).to.eq(index_1.HANDTYPE.House);
                chai_1.expect(index_1.digestHand(["aB", "aC", "dC", "dA", "dB"]).dominant).to.eq('dC');
            });
        });
        describe("- Four", function () {
            it("Four", function () {
                chai_1.expect(index_1.digestHand(["aB", "aC", "aA", "aD", "dB"]).type).to.eq(index_1.HANDTYPE.Four);
                chai_1.expect(index_1.digestHand(["aB", "aC", "aA", "aD", "dB"]).dominant).to.eq('aD');
            });
            it("Four #2", function () {
                chai_1.expect(index_1.digestHand(["aB", "dC", "dA", "dD", "dB"]).type).to.eq(index_1.HANDTYPE.Four);
                chai_1.expect(index_1.digestHand(["aB", "dC", "dA", "dD", "dB"]).dominant).to.eq('dD');
            });
            it("Not Four", function () {
                chai_1.expect(index_1.digestHand(["aB", "dC", "bC", "dD", "dB"]).type).to.eq(index_1.HANDTYPE.Fake);
            });
        });
        describe("- FS", function () {
            it("FS", function () {
                chai_1.expect(index_1.digestHand(["aA", "bA", "cA", "dA", "eA"]).type).to.eq(index_1.HANDTYPE.FS);
                chai_1.expect(index_1.digestHand(["aA", "bA", "cA", "dA", "eA"]).dominant).to.eq('eA');
            });
            it("FS #2", function () {
                chai_1.expect(index_1.digestHand(["aA", "bA", "cA", "lA", "mA"]).type).to.eq(index_1.HANDTYPE.FS);
                chai_1.expect(index_1.digestHand(["aA", "bA", "cA", "lA", "mA"]).dominant).to.eq('cA');
            });
        });
    });
});
describe("+ Starter", function () {
    describe("- SINGLE CARD", function () {
        it("SINGLE 4", function () {
            chai_1.expect(index_1.compareHands([index_1.MIN_4], [])).to.equal(true);
        });
        it("NO CARD", function () {
            chai_1.expect(index_1.compareHands([], [])).to.equal(false);
        });
        it("OTHER CARD", function () {
            chai_1.expect(index_1.compareHands([index_1.BIG_3], [])).to.equal(false);
            chai_1.expect(index_1.compareHands(["aB"], [])).to.equal(false);
            chai_1.expect(index_1.compareHands(["cB"], [])).to.equal(false);
        });
    });
    describe("- DOUBLE CARDS", function () {
        it("DOUBLE 4", function () {
            chai_1.expect(index_1.compareHands([index_1.MIN_4, "aB"], [])).to.equal(true);
        });
        it("DOUBLE BUT SAME 4", function () {
            chai_1.expect(index_1.compareHands([index_1.MIN_4, index_1.MIN_4], [])).to.equal(false);
        });
        it("DOUBLE 4 BUT NOT MIN", function () {
            chai_1.expect(index_1.compareHands(["aC", "aB"], [])).to.equal(false);
        });
        it("DOUBLE 4 BUT NOT MIN AND SAME", function () {
            chai_1.expect(index_1.compareHands(["aB", "aB"], [])).to.equal(false);
        });
        it("JUST DOUBLE", function () {
            chai_1.expect(index_1.compareHands(["bB", "aB"], [])).to.equal(false);
        });
        it("NOT EVEN A DOUBLE", function () {
            chai_1.expect(index_1.compareHands(["aB", "bB"], [])).to.equal(false);
        });
    });
    describe("- FIVE CARDS", function () {
        it("STRAIGHT", function () {
            chai_1.expect(index_1.compareHands(["aA", "bB", "cB", "dC", "eD"], [])).to.equal(true);
            chai_1.expect(index_1.compareHands(["aA", "bB", "cB", "dC", "mD"], [])).to.equal(true);
            chai_1.expect(index_1.compareHands(["aA", "bB", "cB", "lC", "mD"], [])).to.equal(true);
        });
        it("THREE", function () {
            chai_1.expect(index_1.compareHands(["aA", "aB", "aC", "bC", "bD"], [])).to.equal(true);
            chai_1.expect(index_1.compareHands(["aA", "aB", "bB", "bC", "bD"], [])).to.equal(true);
        });
        it("FOUR", function () {
            chai_1.expect(index_1.compareHands(["aA", "aB", "aC", "aD", "bD"], [])).to.equal(true);
            chai_1.expect(index_1.compareHands(["aA", "aB", "bD", "aC", "aD"], [])).to.equal(true);
            chai_1.expect(index_1.compareHands(["bD", "aB", "aA", "aC", "aD"], [])).to.equal(true);
        });
        it("SAME COLOR", function () {
            chai_1.expect(index_1.compareHands(["bA", "aA", "cA", "gA", "kA"], [])).to.equal(true);
        });
    });
});
describe("+ PLAY", function () {
    describe("- ILLEGAL MATCH", function () {
        it("DOUBLE -> SINGLE", function () {
            chai_1.expect(index_1.compareHands(["aC", "aB"], ["aA"])).to.equal(false);
        });
        it("FIVE -> SINGLE", function () {
            chai_1.expect(index_1.compareHands(["aA", "bB", "cB", "lC", "mD"], ["aA"])).to.equal(false);
        });
        it("FIVE -> DOUBLE", function () {
            chai_1.expect(index_1.compareHands(["aA", "bB", "cB", "lC", "mD"], ["aC", "aB"])).to.equal(false);
        });
    });
    describe("- SINGLE VS SINGLE", function () {
        it("4B -> 4A", function () {
            chai_1.expect(index_1.compareHands(["aB"], ["aA"])).to.equal(true);
        });
        it("5A -> 4A", function () {
            chai_1.expect(index_1.compareHands(["bA"], ["aA"])).to.equal(true);
        });
        it("3A -> 4A", function () {
            chai_1.expect(index_1.compareHands(["mA"], ["aA"])).to.equal(true);
        });
        it("3B -> 4A", function () {
            chai_1.expect(index_1.compareHands(["mB"], ["aA"])).to.equal(true);
        });
        it("4B -> 5A", function () {
            chai_1.expect(index_1.compareHands(["aB"], ["bA"])).to.equal(false);
        });
        it("4A -> 5A", function () {
            chai_1.expect(index_1.compareHands(["aA"], ["bA"])).to.equal(false);
        });
        it("4A -> 3A", function () {
            chai_1.expect(index_1.compareHands(["aA"], ["mA"])).to.equal(false);
        });
        it("4B -> 3A", function () {
            chai_1.expect(index_1.compareHands(["aB"], ["mA"])).to.equal(false);
        });
    });
    describe("- DOUBLE VS DOUBLE", function () {
        it("3A3B -> 4A4B", function () {
            chai_1.expect(index_1.compareHands(["mA", "mB"], ["aA", "aB"])).to.equal(true);
        });
        it("4A4B -> 3A3B", function () {
            chai_1.expect(index_1.compareHands(["aA", "aB"], ["mA", "mB"])).to.equal(false);
        });
        it("4C4D -> 3A3B", function () {
            chai_1.expect(index_1.compareHands(["aC", "aD"], ["mA", "mB"])).to.equal(false);
        });
        it("4D4C -> 4A4B", function () {
            chai_1.expect(index_1.compareHands(["aD", "aC"], ["aB", "aA"])).to.equal(true);
        });
        it("4D4A -> 4C4B", function () {
            chai_1.expect(index_1.compareHands(["aD", "aA"], ["aB", "aC"])).to.equal(true);
        });
        it("4C4B -> 4D4A", function () {
            chai_1.expect(index_1.compareHands(["aB", "aC"], ["aD", "aA"])).to.equal(false);
        });
    });
    describe("- FIVE VS FIVE", function () {
        describe("# SAME TYPE", function () {
            describe("@ FLUSH", function () {
                it("♣ -> ♣", function () {
                    chai_1.expect(index_1.compareHands(["mA", "kA", "jA", "hA", "bA"], ["aA", "cA", "eA", "fA", "gA"]))
                        .to.equal(true);
                });
                it("♠ -> ♣", function () {
                    chai_1.expect(index_1.compareHands(["aD", "cD", "eD", "fD", "gD"], ["mA", "kA", "jA", "hA", "bA"]))
                        .to.equal(true);
                });
                it("♣ -> ♠", function () {
                    chai_1.expect(index_1.compareHands(["mA", "kA", "jA", "hA", "bA"], ["aD", "cD", "eD", "fD", "gD"]))
                        .to.equal(false);
                });
            });
            describe("@ FURO", function () {
                it("55566 -> 44433", function () {
                    chai_1.expect(index_1.compareHands(["bA", "bB", "bD", "cC", "cD"], ["aA", "aB", "aD", "mA", "mB"]))
                        .to.equal(true);
                });
                it("22266 -> 44433", function () {
                    chai_1.expect(index_1.compareHands(["lA", "lB", "lD", "cC", "cD"], ["aA", "aB", "aD", "mA", "mB"]))
                        .to.equal(true);
                });
                it("44433 -> 22266", function () {
                    chai_1.expect(index_1.compareHands(["aA", "aB", "aD", "mA", "mB"], ["lA", "lB", "lD", "cC", "cD"]))
                        .to.equal(false);
                });
            });
            describe("@ STRAIGHT", function () {
                it("56789 -> 45678", function () {
                    chai_1.expect(index_1.compareHands(["dA", "eA", "fA", "gA", "hA"], ["aD", "bD", "cD", "dD", "eB"]))
                        .to.equal(true);
                });
                it("45678D -> 45678A", function () {
                    chai_1.expect(index_1.compareHands(["aA", "bA", "cA", "dA", "eD"], ["aD", "bD", "cD", "dD", "eA"]))
                        .to.equal(true);
                });
                it("23456 -> 45678", function () {
                    chai_1.expect(index_1.compareHands(["lD", "mB", "aD", "bD", "cD"], ["aA", "bA", "cA", "dA", "eA"]))
                        .to.equal(false);
                });
                it("QK123 -> TJQK1", function () {
                    chai_1.expect(index_1.compareHands(["iA", "jA", "kA", "lA", "mA"], ["gD", "hD", "iD", "jD", "kA"]))
                        .to.equal(true);
                });
            });
        });
    });
});
describe("+ ILLEGAL CARDS", function () {
    it("EMPTY CARD", function () {
        chai_1.expect(index_1.compareHands([""], [])).to.equal(false);
    });
    it("EMPTY DOUBLE", function () {
        chai_1.expect(index_1.compareHands(["", ""], [])).to.equal(false);
    });
    it("EMPTY FIVE", function () {
        chai_1.expect(index_1.compareHands(["", "", "", "", ""], [])).to.equal(false);
    });
    it("NON-EXISTENT", function () {
        chai_1.expect(index_1.compareHands(["Aa"], [])).to.equal(false);
        chai_1.expect(index_1.compareHands(["nD"], [])).to.equal(false);
        chai_1.expect(index_1.compareHands(["aE"], [])).to.equal(false);
        chai_1.expect(index_1.compareHands(["aa"], [])).to.equal(false);
        chai_1.expect(index_1.compareHands(["AA"], [])).to.equal(false);
    });
    it("CARD FORMAT ILLEGAL", function () {
        chai_1.expect(index_1.compareHands(["a"], [])).to.equal(false);
        chai_1.expect(index_1.compareHands(["A"], [])).to.equal(false);
        chai_1.expect(index_1.compareHands(["aa"], [])).to.equal(false);
        chai_1.expect(index_1.compareHands(["AA"], [])).to.equal(false);
        chai_1.expect(index_1.compareHands(["Aa"], [])).to.equal(false);
        chai_1.expect(index_1.compareHands(["n"], [])).to.equal(false);
        chai_1.expect(index_1.compareHands(["aE"], [])).to.equal(false);
        chai_1.expect(index_1.compareHands(["0"], [])).to.equal(false);
        chai_1.expect(index_1.compareHands(["."], [])).to.equal(false);
        chai_1.expect(index_1.compareHands(["aAe"], [])).to.equal(false);
    });
});
//# sourceMappingURL=card.handler.test.js.map