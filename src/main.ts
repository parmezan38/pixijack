import { Application, Assets, Sprite } from "pixi.js";
import {
    createDeck,
    createShuffledDeck,
    CardImageData,
    Card
} from "./logic/Cards";

import { Chips } from "./logic/Chips";

const BALANCE = 1000;
const NUM_OF_DECKS = 1; // 4 Deck setup
const ASSET_PATH = "../../raw-assets/";

let textures: Record<string, any>;

let balance = BALANCE;

let deck: Card[] = [];

export const app = new Application<HTMLCanvasElement>({
    resolution: Math.max(window.devicePixelRatio, 2),
    backgroundColor: 0xffffff,
});

window.onload = async (): Promise<void> => {
    document.body.appendChild(app.view);
    
    createDeck();
    CardImageData.forEach((name: string) => {
        const path = ASSET_PATH + "cards/" + name + ".png";
        Assets.add(name, path)
    });
    
    const chipNames = Chips.map(({name}) => name);
    chipNames.forEach((name: string) => {
        const path = ASSET_PATH + "chips/" + name + ".png";
        Assets.add(name, path)
    });
    
    textures = await Assets.load([...chipNames, ...CardImageData]);

    initializeValues();
};

function initializeValues() {
    balance = BALANCE;
    deck = createShuffledDeck(NUM_OF_DECKS);
}