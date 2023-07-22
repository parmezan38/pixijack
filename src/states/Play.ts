import { Container, Text } from "pixi.js";
import { Game, GameState } from "../util/HelperTypes";
import { Card, createShuffledDeck } from "../logic/Cards";

export class PlayState extends GameState {
    game: Game = new Game();
    deck: Card[] = [];
    NUM_OF_DECKS = 1; // 4 Deck setup
    playerHand: Card[] = []
    dealerHand: Card[] = []

    constructor(_game: Game) {
        super();
        this.game = _game;
    }
    
    public start() {
        console.log("PlayState");

        this.playerHand = [];
        this.dealerHand = [];

        this.selectableChips = []
        this.balanceText = new Text(""),
        this.wagerText = new Text(""),
        this.container = new Container()
        this.game.app.stage.addChild(this.container);

        this.deck = createShuffledDeck(this.NUM_OF_DECKS);
        this.dealFirst();
    }

    private dealFirst() {
        const card1 = this.deck.pop();
        this.playerHand.push(card1!);
        
        const card2 = this.deck.pop();
        this.dealerHand.push(card2!);
        
        const card3 = this.deck.pop();
        this.playerHand.push(card3!);
        
        const card4 = this.deck.pop();
        this.dealerHand.push(card4!);

        this.endRound();
    }
    
    private endRound() {
        // Win
        //this.game.balance += this.game.wager * 2;

        // Lost
        this.game.wager = 0;
        
        this.new(this.game.wagerState);
    }

    public new(newState: GameState) {
        this.destroy();
        this.game.state = newState;
        this.game.state.start();
    }
    
    public destroy() {
        this.container.removeChildren();
        this.container.removeAllListeners();
    }
}