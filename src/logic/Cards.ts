import { Vector2 } from "../util/HelperTypes";
import { MIDDLE } from "../visual/UI";

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

const NUM_OF_DECKS: number = 1; // 4 Deck setup

export type Card = {
    name: string, 
    type: CARD_TYPES;
    suit: SUITS;
    value: number;
};
export type Cards = Card[];

export const CARD_SCALE: number = 0.3;
export const CARD_DIMENSIONS: Vector2 = {
    x: 500 * CARD_SCALE,
    y: 726 * CARD_SCALE
}

export const CARD_POSITIONS: Vector2[] = [
    { x: MIDDLE.x - CARD_DIMENSIONS.x * 0.3, y: MIDDLE.y + 180 }, // P 1. 
    { x: MIDDLE.x - CARD_DIMENSIONS.x * 0.3, y: MIDDLE.y - 180 }, // D 1.
    { x: MIDDLE.x + CARD_DIMENSIONS.x * 0.3, y: MIDDLE.y + 180 }, // P 2.
    { x: MIDDLE.x + CARD_DIMENSIONS.x * 0.3, y: MIDDLE.y - 180 }, // D 2.
]

const Deck: Card[] = [];

export const CardImageData: string[] = [];

// Generate cards
function createNumeralCards() {
    Object.values(SUITS).forEach(value => {
        for (let i = 2; i < 11; i++) {
            const card = createCard(CARD_TYPES.NUMERAL, value, i) 
            Deck.push(card);
            CardImageData.push(card.name);
        }
    });
}

function createFaceCards() {
    Object.values(SUITS).forEach(suit => {
        const card = createCard(CARD_TYPES.ACE, suit, 1) 
        Deck.push(card);
        CardImageData.push(card.name);

        Object.values(CARD_TYPES).forEach(cardType => {
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

export const createShuffledDeck = () => {
    let deck: Card[] = [];
    deck = [].concat(...Array(NUM_OF_DECKS).fill(Deck));
    return shuffleCards(deck);
};

export const removeCardFromShuffledDeck = (deck: Card[]) => {
    if (deck.length<10) {
        deck = createShuffledDeck();
    }
    return deck.pop();
}
