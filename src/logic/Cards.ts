import { Vector2 } from "../util/ClassesAndTypes";

// Define cards
export enum CARD_TYPES {
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

const NUM_OF_DECKS: number = 4; // 4 Deck setup

export type Card = {
    name: string, 
    type: CARD_TYPES;
    suit: SUITS;
    value: number;
};
export type Cards = Card[];

export const CARD_SCALE: number = 0.45;
export const CARD_DIMENSIONS: Vector2 = {
    x: 500 * CARD_SCALE,
    y: 726 * CARD_SCALE
}
export const CARD_DISTANCE: number = CARD_DIMENSIONS.x * 0.4;

export const Deck: Card[] = [];

export const CardImageData: string[] = [];

// Generate cards
export const createNumeralCards = () => {
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
        const card = createCard(CARD_TYPES.ACE, suit, 11) 
        Deck.push(card);
        CardImageData.push(card.name);

        Object.values(CARD_TYPES).forEach(cardType => {
            if (cardType === CARD_TYPES.NUMERAL || cardType === CARD_TYPES.ACE) {
                return;
            }
            const card = createCard(cardType, suit, 10)
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
    console.log(Deck.length);
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
