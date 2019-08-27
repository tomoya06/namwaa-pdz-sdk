export declare enum HANDTYPE {
    Fake = -1,
    Single = 1,
    Double = 2,
    Five = 5,
    Flush = 6,
    Straight = 7,
    House = 8,
    Four = 9,
    FS = 10
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
    suit: string;
    point: string;
}
export declare const MIN_4 = "aA";
export declare const BIG_A = "kD";
export declare const BIG_3 = "mD";
/**
 * Shuffle cards for a new game.
 */
export declare function shuffleCards(): ShuffleResult;
/**
 * check if your cards can form a legal hand. including single, double and fives.
 * @param cards string[] cards to be check
 */
export declare function digestHand(cards: string[]): Hand;
/**
 * compare if current hand is larger than the last one. if lasthand is empty array, it means current hand is playing at the first place.
 * @param hands string[] current hands
 * @param lastHand string[] last hands
 */
export declare function compareHands(hands: string[], lastHand: string[]): boolean;
export declare function cardDecoder(card: string): PokerCard;
export declare function cardEncoder(poker: PokerCard): string;
