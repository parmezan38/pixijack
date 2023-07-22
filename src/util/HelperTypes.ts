import { Application, Container, Sprite, Text } from "pixi.js"

export class Game {
    app!: Application;
    textures!: Record<string, any>;
    balance!: number;
    wager!: number;
}

export class GameState {
    balanceText!: Text;
    wagerText!: Text;
    selectableChips?: Sprite[];
    container!: Container;

    startState() {}
}

export type Position = {
    x: number,
    y: number,
}