/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-use-before-define */
/* eslint-disable no-empty-function */
import { Application, Container, Text } from 'pixi.js';

import { Card } from '../logic/Cards';
import { PlayState } from '../states/Play';
import { WagerState } from '../states/Wager';

export class Game {
    public app!: Application;
    public textures!: Record<string, any>;
    public balance!: number;
    public wager!: number;
    public deck!: Card[];
    public state!: GameState;
    public wagerState!: WagerState;
    public playState!: PlayState;
    public buttonContainer!: Container;
    public textContainer!: Container;
    public backgroundContainer!: Container;
    public balanceText!: Text;
    public wagerText!: Text;
    public updateText = () => {};
}

export class GameState {
    public balanceText!: Text;
    public wagerText!: Text;
    public container!: Container;
    public game!: Game;
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