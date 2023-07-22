import { Container, Sprite, Text } from "pixi.js";
import { Game, GameState, Vector2 } from "../util/HelperTypes";
import { Card, createShuffledDeck } from "../logic/Cards";
import { animateSprite } from "../visual/AnimateCards";

const MIDDLE: Vector2 = {
    x: window.screen.width/2,
    y: window.screen.height/2
}

const CARD_SCALE: number = 0.3;
const CARD_DIMENSIONS: Vector2 = {
    x: 500 * CARD_SCALE,
    y: 726 * CARD_SCALE
}

const CARD_POSITIONS: Vector2[] = [
    { x: MIDDLE.x - CARD_DIMENSIONS.x * 0.6, y: MIDDLE.y + 180 }, // P 1. 
    { x: MIDDLE.x - CARD_DIMENSIONS.x * 0.6, y: MIDDLE.y - 180 }, // D 1.
    { x: MIDDLE.x + CARD_DIMENSIONS.x * 0.6, y: MIDDLE.y + 180 }, // P 2.
    { x: MIDDLE.x + CARD_DIMENSIONS.x * 0.6, y: MIDDLE.y - 180 }, // D 2.
]

type SpriteInfo = {
    sprite: Sprite;
    delay: number;
}

export class PlayState extends GameState {
    game: Game = new Game();
    deck: Card[] = [];
    NUM_OF_DECKS: number = 1; // 4 Deck setup
    playerHand: Card[] = []
    playerSum: number = 0;
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

    private async dealFirst() {
        const sprites: SpriteInfo[] = [];
        
        const card1 = this.deck.pop();
        this.playerHand.push(card1!);
        
        const card2 = this.deck.pop();
        this.dealerHand.push(card2!);
        
        const card3 = this.deck.pop();
        this.playerHand.push(card3!);
        
        const card4 = this.deck.pop();
        this.dealerHand.push(card4!);

        const cards: Card[] = [
            card1!, card2!, card3!, card4!
        ];
        for(let i=0; i<4; i++) {
            sprites[i] = {
                sprite: this.createCardSprite(cards[i], CARD_POSITIONS[0]),
                delay: i*0.5
            }
        }

        let sum = 0;
        this.playerHand.forEach(card => {
            sum += card.value;
        });
        this.playerSum = sum;

        await this.animateCards(sprites)
        this.endRound();
    }
    
    private async animateCards(sprites: SpriteInfo[]) {
        const animations = [];
        for(let i=0; i<sprites.length; i++){
            const sprite = sprites[i].sprite;
            const position = CARD_POSITIONS[i];
            const delay = sprites[i].delay
            animations.push(animateSprite(sprite, position, delay));
        }
        await Promise.all(animations);
    }
    
    private createCardSprite(_card: Card, pos: Vector2) {
        const card = Sprite.from(this.game.textures[_card.name]);
        card.anchor.set(0.5);
        card.scale.x = CARD_SCALE;
        card.scale.y = CARD_SCALE;
        card.x = window.screen.width;
        card.y = 50;
        this.container.addChild(card);
        return card;
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