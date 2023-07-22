import { Application, Assets } from "pixi.js";

import {
    createDeck,
    createShuffledDeck,
    CardImageData
} from "./logic/Cards";

import { Chips } from "./logic/Chips";

import { WagerState } from "./states/Wager";
import { Game, GameState } from "./util/HelperTypes";
import { PlayState } from "./states/Play";

const BALANCE = 1000;
const ASSET_PATH = "../../raw-assets/";

let game: Game = new Game();
game.balance = BALANCE;
game.wager = 0;
game.deck = []
game.state = new GameState();

export const app = new Application<HTMLCanvasElement>({
    resolution: Math.max(window.devicePixelRatio, 2),
    backgroundColor: "#3a8576",
});

/** Set up a resize function for the app */
function resize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const minWidth = 375;
    const minHeight = 700;

    // Calculate renderer and canvas sizes based on current dimensions
    const scaleX = windowWidth < minWidth ? minWidth / windowWidth : 1;
    const scaleY = windowHeight < minHeight ? minHeight / windowHeight : 1;
    const scale = scaleX > scaleY ? scaleX : scaleY;
    const width = windowWidth * scale;
    const height = windowHeight * scale;

    // Update canvas style dimensions and scroll window up to avoid issues on mobile resize
    app.renderer.view.style.width = `${windowWidth}px`;
    app.renderer.view.style.height = `${windowHeight}px`;
    window.scrollTo(0, 0);

    // Update renderer  and navigation screens dimensions
    app.renderer.resize(width, height);
}

window.onload = async (): Promise<void> => {
    document.body.appendChild(app.view);
    game.app = app;
    window.addEventListener('resize', resize);
    
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
    const uiTextures = ["deal_button"];
    uiTextures.forEach((name: string) => {
        const path = ASSET_PATH + "ui/" + name + ".png";
        Assets.add(name, path)
    });
    game.textures = await Assets.load([...chipNames, ...CardImageData, ...uiTextures]);

    resize();
    initializeValues();
    
    game.wagerState = new WagerState(game);
    game.playState = new PlayState(game);

    game.state = game.wagerState;
    game.state.start();
};

function initializeValues() {
    game.balance = BALANCE;
}

