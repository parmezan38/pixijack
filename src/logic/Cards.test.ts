import {
    Card,
    createDeck,
    createShuffledDeck,
    Deck,
} from './Cards';

createDeck();

describe('Deck', () => {
    it('should not be empty', () => {
        const deck = Deck;

        expect(deck.length).not.toBe(0);
    });
});

describe('Deck', () => {
    it('should have no duplicates', () => {
        const deck = Deck;

        function hasDuplicate(array: Card[]): boolean {
            return array.reduce((duplicateMap, obj) => {
                const key = `${obj.name}-${obj.suit}`;

                return duplicateMap.set(key, duplicateMap.has(key));
            }, new Map<string, boolean>()).size !== array.length;
        }
        expect(hasDuplicate(deck)).toBeFalsy();
    });
});

describe('createShuffleDeck', () => {
    it('is not the same as duplicated Decks', () => {
        const deck = [...Deck, ...Deck, ...Deck, ...Deck];
        const shuffledDeck = createShuffledDeck();

        function areEqual(cards1: Card[], cards2: Card[]) {
            if (cards1.length === cards2.length) {
                return cards1.every((card, i) => {
                    if (card.name === cards2[i].name && card.suit === cards2[i].suit) {
                        return true;
                    }

                    return false;
                });
            }
            
            return false;
        }
        expect(areEqual(deck, shuffledDeck)).toBeFalsy();
    });
});
