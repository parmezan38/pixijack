import {
    Application,
    Assets,
    Container,
    Graphics,
    Sprite,
    Text
} from "pixi.js";

import {
    createDeck,
    createShuffledDeck,
    CardImageData,
    Card
} from "./logic/Cards";

import {
    addChipToWageredSlot,
    Chip,
    Chips,
    WageredChips,
    removeChipFromWageredSlot
} from "./logic/Chips";

import { Position } from "./util/HelperTypes";

const BALANCE = 1000;
const NUM_OF_DECKS = 1; // 4 Deck setup
const ASSET_PATH = "../../raw-assets/";

let textures: Record<string, any>;
let balance = BALANCE;
let wager = 0;

const wagerState: {
    balanceText: Text,
    wagerText: Text,
    selectableChips: Sprite[],
    container: Container
} = {
    balanceText: new Text,
    wagerText: new Text,
    selectableChips: [],
    container: new Container()
}

let deck: Card[] = [];

export const app = new Application<HTMLCanvasElement>({
    resolution: Math.max(window.devicePixelRatio, 2),
    backgroundColor: 0xffffff,
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
    textures = await Assets.load([...chipNames, ...CardImageData, ...uiTextures]);

    resize();
    addText();
    initializeValues();
    
    startWagerState();
};

function initializeValues() {
    balance = BALANCE;
    deck = createShuffledDeck(NUM_OF_DECKS);
}

function startWagerState() {
    app.stage.addChild(wagerState.container);
    const startPos: Position = {
        x: 150,
        y: 600 
    }
    createSelectableChips(startPos);
    addDealButton();
}

function createSelectableChips(startPos: Position) {
    for(let i=0; i<Chips.length; i++) {
        const selectChip = Sprite.from(textures[Chips[i].name]);
        selectChip.anchor.set(0.5);
        selectChip.scale.x = 0.5;
        selectChip.scale.y = 0.5;
        selectChip.x = startPos.x + (i+1)*150;
        selectChip.y = startPos.y;
        selectChip.interactive = true;
        selectChip.onclick = () => {wagerChip(Chips[i])}
        wagerState.selectableChips.push(selectChip);
        wagerState.container.addChild(selectChip);
    }
}

function createWageredChip(chip: Chip, startPos: Position, i: number) {
    const wageredChip = Sprite.from(textures[chip.name]);
    wageredChip.anchor.set(0.5);
    wageredChip.scale.x = 0.5;
    wageredChip.scale.y = 0.5;
    wageredChip.x = startPos.x + (i+1)*150;
    wageredChip.y = startPos.y;
    wageredChip.interactive = true;
    wageredChip.onclick = () => {removeChip(chip)}
    WageredChips[i].sprite = wageredChip;
    wagerState.container.addChild(wageredChip);
}

function wagerChip(chip: Chip) {
    const slot = addChipToWageredSlot(chip);
    balance -= chip.value;
    wager += chip.value;
    updateText();
    if (WageredChips[slot].count <= 1) {
        const startPos: Position = {
            x: 150,
            y: 450 
        }
        createWageredChip(chip, startPos, slot);
    }
}

function removeChip(chip: Chip) {
    removeChipFromWageredSlot(chip);
    balance += chip.value;
    wager -= chip.value;
    updateText();
}

function addText() {
    wagerState.balanceText = new Text('Player balance: ' + balance);
    wagerState.balanceText.x = 50;
    wagerState.balanceText.y = 100;
    wagerState.container.addChild(wagerState.balanceText);
    
    wagerState.wagerText = new Text('Wager: ' + wager);
    wagerState.wagerText.x = 50;
    wagerState.wagerText.y = 150;
    wagerState.container.addChild(wagerState.wagerText);
}

function updateText() {
    wagerState.balanceText.text = 'Player balance: ' + balance;
    wagerState.wagerText.text = 'Wager: ' + wager;
}

function addDealButton() {
    const dealButton = Sprite.from(textures["deal_button"]);
    dealButton.anchor.set(0.5);
    dealButton.scale.x = 1;
    dealButton.scale.y = 1;
    dealButton.x = 500;
    dealButton.y = 100;
    dealButton.interactive = true;
    dealButton.onclick = () => {startDealState()}
    wagerState.container.addChild(dealButton);
}

function startDealState() {
    if (wager === 0) return;
    console.log("Can deal");
}

