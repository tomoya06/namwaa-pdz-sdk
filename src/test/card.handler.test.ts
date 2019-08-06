import { expect } from "chai";
import "mocha";

import { BIG_3, compareHands, digestHand, HANDTYPE, MIN_4 } from "../index";

describe("+ Check Hands", () => {
  describe("- Single", () => {
    it("SINGLE 4", () => {
      expect(digestHand([MIN_4]).type).to.equal(HANDTYPE.Single);
    })
  });

  describe("- Double", () => {
    it("Double 2", () => {
      expect(digestHand(["lA", "lB"]).type).to.eq(HANDTYPE.Double);
    })
    it("Not Double", () => {
      expect(digestHand(["lA", "lA"]).type).to.eq(HANDTYPE.Fake);
    })
    it("Not Double #2", () => {
      expect(digestHand(["lA", "mA"]).type).to.eq(HANDTYPE.Fake);
    })
  })

  describe("- Five", () => {
    describe("- FLUSH", () => {
      it("FLUSH", () => {
        expect(digestHand(["lA", "mA", "kA", "aA", "cA"]).type).to.eq(HANDTYPE.Flush);
      })
      it("NOT FLUSH", () => {
        expect(digestHand(["lC", "mA", "kA", "aA", "cA"]).type).to.eq(HANDTYPE.Fake);
      })
    })

    describe("- Straight", () => {
      it("Straight", () => {
        expect(digestHand(["aB", "bC", "cA", "dA", "eA"]).type).to.eq(HANDTYPE.Straight);
      })
      it("Straight", () => {
        expect(digestHand(["aB", "bC", "cA", "lA", "mA"]).type).to.eq(HANDTYPE.Straight);
        expect(digestHand(["aB", "bC", "cA", "lA", "mA"]).dominant).to.eq('cA');
      })
      it("Straight", () => {
        expect(digestHand(["aA", "bA", "cA", "dA", "eD"]).type).to.eq(HANDTYPE.Straight);
        expect(digestHand(["aA", "bA", "cA", "dA", "eD"]).dominant).to.eq('eD');
      })
      it("Straight", () => {
        expect(digestHand(["aD", "bD", "cD", "dD", "eA"]).type).to.eq(HANDTYPE.Straight);
        expect(digestHand(["aD", "bD", "cD", "dD", "eA"]).dominant).to.eq('eA');
      })
      it("NOT Straight", () => {
        expect(digestHand(["aC", "cA", "cB", "dA", "eA"]).type).to.eq(HANDTYPE.Fake);
      })
      it("NOT Straight", () => {
        expect(digestHand(["aB", "bC", "cA", "lA", "kA"]).type).to.eq(HANDTYPE.Fake);
      })
    })

    describe("- House", () => {
      it("House", () => {
        expect(digestHand(["aB", "aC", "aA", "dA", "dB"]).type).to.eq(HANDTYPE.House);
        expect(digestHand(["aB", "aC", "aA", "dA", "dB"]).dominant).to.eq('aC');
      })
      it("Not House", () => {
        expect(digestHand(["aB", "aC", "aA", "dA", "eB"]).type).to.eq(HANDTYPE.Fake);
      })
      it("Not House", () => {
        expect(digestHand(["aB", "aC", "dA", "dB", "eB"]).type).to.eq(HANDTYPE.Fake);
      })
      it("House", () => {
        expect(digestHand(["aB", "aC", "dC", "dA", "dB"]).type).to.eq(HANDTYPE.House);
        expect(digestHand(["aB", "aC", "dC", "dA", "dB"]).dominant).to.eq('dC');
      })
    })

    describe("- Four", () => {
      it("Four", () => {
        expect(digestHand(["aB", "aC", "aA", "aD", "dB"]).type).to.eq(HANDTYPE.Four);
        expect(digestHand(["aB", "aC", "aA", "aD", "dB"]).dominant).to.eq('aD');
      })
      it("Four #2", () => {
        expect(digestHand(["aB", "dC", "dA", "dD", "dB"]).type).to.eq(HANDTYPE.Four);
        expect(digestHand(["aB", "dC", "dA", "dD", "dB"]).dominant).to.eq('dD');
      })
      it("Not Four", () => {
        expect(digestHand(["aB", "dC", "bC", "dD", "dB"]).type).to.eq(HANDTYPE.Fake);
      })
    })

    describe("- FS", () => {
      it("FS", () => {
        expect(digestHand(["aA", "bA", "cA", "dA", "eA"]).type).to.eq(HANDTYPE.FS);
        expect(digestHand(["aA", "bA", "cA", "dA", "eA"]).dominant).to.eq('eA');
      })
      it("FS #2", () => {
        expect(digestHand(["aA", "bA", "cA", "lA", "mA"]).type).to.eq(HANDTYPE.FS);
        expect(digestHand(["aA", "bA", "cA", "lA", "mA"]).dominant).to.eq('cA');
      })
    })
  })
})

describe("+ Starter", () => {
  describe("- SINGLE CARD", () => {
    it("SINGLE 4", () => {
      expect(compareHands([MIN_4], [])).to.equal(true);
    });

    it("NO CARD", () => {
      expect(compareHands([], [])).to.equal(false);
    });

    it("OTHER CARD", () => {
      expect(compareHands([BIG_3], [])).to.equal(false);
      expect(compareHands(["aB"], [])).to.equal(false);
      expect(compareHands(["cB"], [])).to.equal(false);
    });
  });

  describe("- DOUBLE CARDS", () => {
    it("DOUBLE 4", () => {
      expect(compareHands([MIN_4, "aB"], [])).to.equal(true);
    });
    it("DOUBLE BUT SAME 4", () => {
      expect(compareHands([MIN_4, MIN_4], [])).to.equal(false);
    });
    it("DOUBLE 4 BUT NOT MIN", () => {
      expect(compareHands(["aC", "aB"], [])).to.equal(false);
    });
    it("DOUBLE 4 BUT NOT MIN AND SAME", () => {
      expect(compareHands(["aB", "aB"], [])).to.equal(false);
    });
    it("JUST DOUBLE", () => {
      expect(compareHands(["bB", "aB"], [])).to.equal(false);
    });
    it("NOT EVEN A DOUBLE", () => {
      expect(compareHands(["aB", "bB"], [])).to.equal(false);
    });
  });

  describe("- FIVE CARDS", () => {
    it("STRAIGHT", () => {
      expect(compareHands(["aA", "bB", "cB", "dC", "eD"], [])).to.equal(true);
      expect(compareHands(["aA", "bB", "cB", "dC", "mD"], [])).to.equal(true);
      expect(compareHands(["aA", "bB", "cB", "lC", "mD"], [])).to.equal(true);
    });
    it("THREE", () => {
      expect(compareHands(["aA", "aB", "aC", "bC", "bD"], [])).to.equal(true);
      expect(compareHands(["aA", "aB", "bB", "bC", "bD"], [])).to.equal(true);
    });
    it("FOUR", () => {
      expect(compareHands(["aA", "aB", "aC", "aD", "bD"], [])).to.equal(true);
      expect(compareHands(["aA", "aB", "bD", "aC", "aD"], [])).to.equal(true);
      expect(compareHands(["bD", "aB", "aA", "aC", "aD"], [])).to.equal(true);
    });
    it("SAME COLOR", () => {
      expect(compareHands(["bA", "aA", "cA", "gA", "kA"], [])).to.equal(true);
    });
  });
});


describe("+ PLAY", () => {
  describe("- ILLEGAL MATCH", () => {
    it("DOUBLE -> SINGLE", () => {
      expect(compareHands(["aC", "aB"], ["aA"])).to.equal(false);
    });
    it("FIVE -> SINGLE", () => {
      expect(compareHands(["aA", "bB", "cB", "lC", "mD"], ["aA"])).to.equal(false);
    });
    it("FIVE -> DOUBLE", () => {
      expect(compareHands(["aA", "bB", "cB", "lC", "mD"], ["aC", "aB"])).to.equal(false);
    });
  });

  describe("- SINGLE VS SINGLE", () => {
    it("4B -> 4A", () => {
      expect(compareHands(["aB"], ["aA"])).to.equal(true);
    });
    it("5A -> 4A", () => {
      expect(compareHands(["bA"], ["aA"])).to.equal(true);
    });
    it("3A -> 4A", () => {
      expect(compareHands(["mA"], ["aA"])).to.equal(true);
    });
    it("3B -> 4A", () => {
      expect(compareHands(["mB"], ["aA"])).to.equal(true);
    });
    it("4B -> 5A", () => {
      expect(compareHands(["aB"], ["bA"])).to.equal(false);
    });
    it("4A -> 5A", () => {
      expect(compareHands(["aA"], ["bA"])).to.equal(false);
    });
    it("4A -> 3A", () => {
      expect(compareHands(["aA"], ["mA"])).to.equal(false);
    });
    it("4B -> 3A", () => {
      expect(compareHands(["aB"], ["mA"])).to.equal(false);
    });
  });

  describe("- DOUBLE VS DOUBLE", () => {
    it("3A3B -> 4A4B", () => {
      expect(compareHands(["mA", "mB"], ["aA", "aB"])).to.equal(true);
    });
    it("4A4B -> 3A3B", () => {
      expect(compareHands(["aA", "aB"], ["mA", "mB"])).to.equal(false);
    });
    it("4C4D -> 3A3B", () => {
      expect(compareHands(["aC", "aD"], ["mA", "mB"])).to.equal(false);
    });
    it("4D4C -> 4A4B", () => {
      expect(compareHands(["aD", "aC"], ["aB", "aA"])).to.equal(true);
    });
    it("4D4A -> 4C4B", () => {
      expect(compareHands(["aD", "aA"], ["aB", "aC"])).to.equal(true);
    });
    it("4C4B -> 4D4A", () => {
      expect(compareHands(["aB", "aC"], ["aD", "aA"])).to.equal(false);
    });
  });

  describe("- FIVE VS FIVE", () => {
    describe("# SAME TYPE", () => {
      describe("@ FLUSH", () => {
        it("♣ -> ♣", () => {
          expect(compareHands(["mA", "kA", "jA", "hA", "bA"], ["aA", "cA", "eA", "fA", "gA"]))
            .to.equal(true);
        });
        it("♠ -> ♣", () => {
          expect(compareHands(["aD", "cD", "eD", "fD", "gD"], ["mA", "kA", "jA", "hA", "bA"]))
            .to.equal(true);
        });
        it("♣ -> ♠", () => {
          expect(compareHands(["mA", "kA", "jA", "hA", "bA"], ["aD", "cD", "eD", "fD", "gD"]))
            .to.equal(false);
        });
      });
      describe("@ FURO", () => {
        it("55566 -> 44433", () => {
          expect(compareHands(["bA", "bB", "bD", "cC", "cD"], ["aA", "aB", "aD", "mA", "mB"]))
            .to.equal(true);
        });
        it("22266 -> 44433", () => {
          expect(compareHands(["lA", "lB", "lD", "cC", "cD"], ["aA", "aB", "aD", "mA", "mB"]))
            .to.equal(true);
        });
        it("44433 -> 22266", () => {
          expect(compareHands(["aA", "aB", "aD", "mA", "mB"], ["lA", "lB", "lD", "cC", "cD"]))
            .to.equal(false);
        });
      });
      describe("@ STRAIGHT", () => {
        it("56789 -> 45678", () => {
          expect(compareHands(["dA", "eA", "fA", "gA", "hA"], ["aD", "bD", "cD", "dD", "eB"]))
            .to.equal(true);
        });
        it("45678D -> 45678A", () => {
          expect(compareHands(["aA", "bA", "cA", "dA", "eD"], ["aD", "bD", "cD", "dD", "eA"]))
            .to.equal(true);
        });
        it("23456 -> 45678", () => {
          expect(compareHands(["lD", "mB", "aD", "bD", "cD"], ["aA", "bA", "cA", "dA", "eA"]))
            .to.equal(false);
        });
        it("QK123 -> TJQK1", () => {
          expect(compareHands(["iA", "jA", "kA", "lA", "mA"], ["gD", "hD", "iD", "jD", "kA"]))
            .to.equal(true);
        });
      });
    });
  });
});

describe("+ ILLEGAL CARDS", () => {
  it("EMPTY CARD", () => {
    expect(compareHands([""], [])).to.equal(false);
  });
  it("EMPTY DOUBLE", () => {
    expect(compareHands(["", ""], [])).to.equal(false);
  });
  it("EMPTY FIVE", () => {
    expect(compareHands(["", "", "", "", ""], [])).to.equal(false);
  });
  it("NON-EXISTENT", () => {
    expect(compareHands(["Aa"], [])).to.equal(false);
    expect(compareHands(["nD"], [])).to.equal(false);
    expect(compareHands(["aE"], [])).to.equal(false);
    expect(compareHands(["aa"], [])).to.equal(false);
    expect(compareHands(["AA"], [])).to.equal(false);
  });
  it("CARD FORMAT ILLEGAL", () => {
    expect(compareHands(["a"], [])).to.equal(false);
    expect(compareHands(["A"], [])).to.equal(false);
    expect(compareHands(["aa"], [])).to.equal(false);
    expect(compareHands(["AA"], [])).to.equal(false);
    expect(compareHands(["Aa"], [])).to.equal(false);
    expect(compareHands(["n"], [])).to.equal(false);
    expect(compareHands(["aE"], [])).to.equal(false);
    expect(compareHands(["0"], [])).to.equal(false);
    expect(compareHands(["."], [])).to.equal(false);
    expect(compareHands(["aAe"], [])).to.equal(false);
  });
});
