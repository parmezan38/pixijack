import { Application, Assets, Sprite } from "pixi.js";
import {
    createDeck,
    createShuffledDeck,
    CardImageData,
    Cards,
    Card
} from "./logic/Cards";

const BALANCE = 1000;
const NUM_OF_DECKS = 1; // 4 Deck setup
const CARD_ASSET_PATH = "../../raw-assets/cards/";
let textures = null;
let balance = BALANCE;

let deck: Card[] = [];

export const app = new Application<HTMLCanvasElement>({
    resolution: Math.max(window.devicePixelRatio, 2),
    backgroundColor: 0xffffff,
});

window.onload = async (): Promise<void> => {
    document.body.appendChild(app.view);
    
    createDeck();
    console.log(CardImageData);

    CardImageData.forEach(name => {
        const path = CARD_ASSET_PATH + name + ".png";
        Assets.add(name, path)
        console.log(name + ", " + path);
    });

    textures = await Assets.load(CardImageData);

    initializeValues();
};

function initializeValues() {
    balance = BALANCE;
    deck = createShuffledDeck(NUM_OF_DECKS);
    console.log(deck);
}