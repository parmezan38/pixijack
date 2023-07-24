import { Application, Assets, Container, Sprite } from "pixi.js";

import {
    createDeck,
    CardImageData
} from "./logic/Cards";

import { Chips } from "./logic/Chips";

import { WagerState } from "./states/Wager";
import { Game, GameState, Vector2 } from "./util/HelperTypes";
import { PlayState } from "./states/Play";
import { BUTTON_NAMES, MIDDLE, WINDOW_SIZE } from "./visual/UI";

const BALANCE = 1000;
const ASSET_PATH = "../../raw-assets/";

let game: Game = new Game();
game.balance = BALANCE;
game.wager = 0;
game.deck = []
game.state = new GameState();
game.buttonContainer = new Container();

const width = 1440;
const height = 1080;


export const app = new Application<HTMLCanvasElement>({
    width, height,
    backgroundColor: "#3a8576",
});

function resize() {
    const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    const scale = Math.min(screenWidth / width, screenHeight / height);

    const enlargedWidth = Math.floor(scale * width);
    const enlargedHeight = Math.floor(scale * height);

    const horizontalMargin = (screenWidth - enlargedWidth) / 2;
    const verticalMargin = (screenHeight - enlargedHeight) / 2;

    app.view.style.width = `${enlargedWidth}px`;
    app.view.style.height = `${enlargedHeight}px`;
    app.view.style.marginLeft = app.view.style.marginRight = `${horizontalMargin}px`;
    app.view.style.marginTop = app.view.style.marginBottom = `${verticalMargin}px`;

    let appWidth = app.renderer.width;
    let appHeight = app.renderer.height;

    MIDDLE.x = appWidth/2;
    MIDDLE.y = appHeight/2;
    WINDOW_SIZE.x = appWidth;
    WINDOW_SIZE.y = appHeight;
}

window.onload = async (): Promise<void> => {
    document.body.appendChild(app.view);
    game.app = app;
    window.addEventListener('resize', resize);
    
    createDeck();
    CardImageData.forEach((name: string) => createAsset(name, "cards"));

    const chipNames = Chips.map(({name}) => name);
    chipNames.forEach((name: string) => createAsset(name, "chips"));
    
    BUTTON_NAMES.forEach((name: string) => createAsset(name, "ui"));

    createAsset("back_card", "cards");

    game.textures = await Assets.load([
        ...chipNames,
        ...CardImageData,
        ...BUTTON_NAMES,
        "back_card",
    ]);

    resize();
    
    game.wagerState = new WagerState(game);
    game.playState = new PlayState(game);
    initializeValues();
    
    game.app.stage.addChild(game.buttonContainer);
    addResetButton();

    game.state = game.wagerState;
    game.state.start();

};

function initializeValues() {
    game.balance = BALANCE;
    game.wager = 0;
}

function createAsset(name: string, folder: string) {
    const path = `${ASSET_PATH}${folder}/${name}.png`;
    Assets.add(name, path);
}

function reset() {
    initializeValues();
    game.state.new(game.wagerState);
}

function addResetButton() {
    const dealButton = Sprite.from(game.textures["reset_button"]);
    dealButton.anchor.set(0.0);
    dealButton.scale.x = 0.6;
    dealButton.scale.y = 0.6;
    dealButton.x = 10;
    dealButton.y = 10;
    dealButton.interactive = true;
    dealButton.onclick = () => {reset()}
    game.buttonContainer.addChild(dealButton);
}
