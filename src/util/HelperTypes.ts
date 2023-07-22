import { Application, Container, Sprite, Text } from "pixi.js"
import { Card } from "../logic/Cards";
import { WagerState } from "../states/Wager";
import { PlayState } from "../states/Play";

export class Game {
    app!: Application;
    textures!: Record<string, any>;
    balance!: number;
    wager!: number;
    deck!: Card[];
    state!: GameState;
    wagerState!: WagerState;
    playState!: PlayState;
}

export class GameState {
    balanceText!: Text;
    wagerText!: Text;
    selectableChips?: Sprite[];
    container!: Container;
    
    public start() {}
    public new(newState: GameState) {}
}

export type Position = {
    x: number,
    y: number,
}