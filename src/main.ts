import { Application, Assets, Container, Sprite, Text } from 'pixi.js';

import {
    CardImageData,
    createDeck} from './logic/Cards';
import { Chips } from './logic/Chips';
import { PlayState } from './states/Play';
import { WagerState } from './states/Wager';
import { Game, GameState } from './util/ClassesAndTypes';
import { BUTTON_NAMES, MIDDLE, TEXT_SMALL, WINDOW_SIZE } from './visual/UI';

const BALANCE = 1000;
const ASSET_PATH = '../../';

const game: Game = new Game();

game.balance = BALANCE;
game.wager = 0;
game.deck = [];
game.state = new GameState();
game.buttonContainer = new Container();
game.textContainer = new Container();
game.backgroundContainer = new Container();
game.wagerText = new Text(`Wager: ${game.wager}`);
game.updateText = () => {
    game.balanceText.text = `Balance: ${game.balance}`;
    game.wagerText.text = `Wager: ${game.wager}`;
};

const width = 1440;
const height = 1080;


export const app = new Application<HTMLCanvasElement>({
    width, height,
    backgroundColor: '#3a8576',
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

    const appWidth = app.renderer.width;
    const appHeight = app.renderer.height;

    MIDDLE.x = appWidth / 2;
    MIDDLE.y = appHeight / 2;
    WINDOW_SIZE.x = appWidth;
    WINDOW_SIZE.y = appHeight;
}

window.onload = async (): Promise<void> => {
    document.body.appendChild(app.view);
    game.app = app;
    window.addEventListener('resize', resize);
    
    createDeck();
    CardImageData.forEach((name: string) => createAsset(name, 'cards'));

    const chipNames = Chips.map(({name}) => name);

    chipNames.forEach((name: string) => createAsset(name, 'chips'));
    
    BUTTON_NAMES.forEach((name: string) => createAsset(name, 'ui'));

    createAsset('back_card', 'cards');
    createAsset('background_edge', 'background');

    game.textures = await Assets.load([
        ...chipNames,
        ...CardImageData,
        ...BUTTON_NAMES,
        'back_card',
        'background_edge',
    ]);

    resize();
    game.app.stage.addChild(game.backgroundContainer);
    createBackgroundAssets();
    
    game.wagerState = new WagerState(game);
    game.playState = new PlayState(game);
    game.app.stage.addChild(game.textContainer);
    initializeValues();
    addText();

    game.app.stage.addChild(game.buttonContainer);
    addResetButton();

    game.state = game.wagerState;
    game.state.start();
    game.updateText();
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
    const dealButton = Sprite.from(game.textures.reset_button);

    dealButton.anchor.set(0.0);
    dealButton.scale.x = 0.6;
    dealButton.scale.y = 0.6;
    dealButton.x = 60;
    dealButton.y = 60;
    dealButton.interactive = true;
    dealButton.onclick = () => reset();
    game.buttonContainer.addChild(dealButton);
}

function createBackgroundAssets() {
    const edge = Sprite.from(game.textures.background_edge);

    game.backgroundContainer.addChild(edge);
}

function addText() {
    game.balanceText = new Text(`Balance: ${game.balance}`);
    game.balanceText.x = 60;
    game.balanceText.y = 130;
    game.balanceText.style.fontSize = TEXT_SMALL.fontSize;
    game.balanceText.style.fill = TEXT_SMALL.fill;
    game.balanceText.style.strokeThickness = TEXT_SMALL.strokeThickness;
    game.balanceText.style.stroke = TEXT_SMALL.stroke;
    game.textContainer.addChild(game.balanceText);
    
    game.wagerText = new Text(`Wager: ${game.wager}`);
    game.wagerText.x = 60;
    game.wagerText.y = 180;
    game.wagerText.style.fontSize = TEXT_SMALL.fontSize;
    game.wagerText.style.fill = TEXT_SMALL.fill;
    game.wagerText.style.strokeThickness = TEXT_SMALL.strokeThickness;
    game.wagerText.style.stroke = TEXT_SMALL.stroke;
    game.textContainer.addChild(game.wagerText);
}
