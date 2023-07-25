import { Application, Container, Text } from "pixi.js"
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
    buttonContainer!: Container;
    textContainer!: Container;
    backgroundContainer!: Container;
    balanceText!: Text;
    wagerText!: Text;
    updateText = () => {};
}

export class GameState {
    balanceText!: Text;
    wagerText!: Text;
    container!: Container;
    game!: Game;
    public start() {}
    public new(newState: GameState) {
        this.game.state = newState;
        this.game.state.start();
    }
}

export type Vector2 = {
    x: number,
    y: number,
}