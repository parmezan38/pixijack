import { Application, Assets } from "pixi.js";
import { createDeck, createShuffledDeck, Cards, Card } from "./logic/Cards";

const BALANCE = 1000;
const NUM_OF_DECKS = 1; // 4 Deck setup

let balance = BALANCE;

let deck: Card[] = [];

export const app = new Application<HTMLCanvasElement>({
    resolution: Math.max(window.devicePixelRatio, 2),
    backgroundColor: 0xffffff,
});

window.onload = async (): Promise<void> => {
    document.body.appendChild(app.view);

    createDeck(); // Move to loading part

    initializeValues();
};

function initializeValues() {
    balance = BALANCE;
    deck = createShuffledDeck(NUM_OF_DECKS);
    console.log(deck);
}