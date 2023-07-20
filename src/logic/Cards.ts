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

const CARD_ASSET_PATH = "/cards";

export type Card = {
    type: CARD_TYPES;
    suit: SUITS;
    value: number;
};

export type Cards = Card[];

const Deck: Card[] = [];

// Generate cards
function createNumeralCards() {
    Object.values(SUITS).forEach((value) => {
        for (let i = 2; i < 11; i++) {
            Deck.push(createCard(CARD_TYPES.NUMERAL, value, i));

            loadCard(i, value);
        }
    });
}

function createFaceCards() {
    Object.values(SUITS).forEach((suit) => {
        Deck.push(createCard(CARD_TYPES.ACE, suit, 1));

        loadCard("ace", suit);

        Object.values(CARD_TYPES).forEach((cardType) => {
            if (cardType === CARD_TYPES.NUMERAL || cardType === CARD_TYPES.ACE) {
                return;
            }
            Deck.push(createCard(cardType, suit, 11));

            loadCard(cardType, suit);
        });
    });
}

function createCard(type: CARD_TYPES, suit: SUITS, value: number) {
    return { type, suit, value };
}

function createFileString(name: any, suit: string) {
    return name + "_of_" + suit;
}

function loadCard(name: any, suit: string) {
    const string = createFileString(name, suit);
    const file = CARD_ASSET_PATH + "/" + string + ".png";
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
