import { Assets } from "pixi.js";

// Define cards
enum CARD_TYPES {
    JACK = "jack",
    QUEEN = "queen",
    KING = "king",
    ACE = "ace",
    NUMERAL = "numeral",
}

enum SUITS {
    CLUBS = "clubs",
    DIAMONDS = "diamonds",
    HEARTS = "hearts",
    SPADES = "spades",
}

export type Card = {
    name: string, 
    type: CARD_TYPES;
    suit: SUITS;
    value: number;
};
export type Cards = Card[];

const Deck: Card[] = [];

export const CardImageData: string[] = [];

// Generate cards
function createNumeralCards() {
    Object.values(SUITS).forEach((value) => {
        for (let i = 2; i < 11; i++) {
            const card = createCard(CARD_TYPES.NUMERAL, value, i) 
            Deck.push(card);
            CardImageData.push(card.name);
        }
    });
}

function createFaceCards() {
    Object.values(SUITS).forEach((suit) => {
        const card = createCard(CARD_TYPES.ACE, suit, 1) 
        Deck.push(card);
        CardImageData.push(card.name);

        Object.values(CARD_TYPES).forEach((cardType) => {
            if (cardType === CARD_TYPES.NUMERAL || cardType === CARD_TYPES.ACE) {
                return;
            }
            const card = createCard(cardType, suit, 11)
            Deck.push(card);
            CardImageData.push(card.name);
        });
    });
}

function createCard(type: CARD_TYPES, suit: SUITS, value: number) {
    const str = type === CARD_TYPES.NUMERAL ? value : type;
    const name = `${str}_of_${suit}`;
    return { name, type, suit, value };
}

function shuffleCards(_deck: Card[]) {
    for (let i = _deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [_deck[i], _deck[j]] = [_deck[j], _deck[i]];
    }
    return _deck;
}

export const createDeck = () => {
    createNumeralCards();
    createFaceCards();
};

export const createShuffledDeck = (num: number) => {
    let deck: Card[] = [];
    deck = [].concat(...Array(num).fill(Deck));
    return shuffleCards(deck);
};
