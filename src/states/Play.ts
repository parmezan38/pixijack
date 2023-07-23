import { Container, Sprite, Text } from "pixi.js";
import { Game, GameState, Vector2 } from "../util/HelperTypes";
import { CARD_POSITIONS, CARD_SCALE, CARD_DIMENSIONS, Card, createShuffledDeck, removeCardFromShuffledDeck } from "../logic/Cards";
import { animateSprite } from "../visual/AnimationTools";
import { MIDDLE } from "../visual/UI";

type SpriteInfo = {
    sprite: Sprite;
    delay: number;
}

export class PlayState extends GameState {
    game: Game = new Game();
    deck: Card[] = [];
    playerHand: Card[] = []
    playerSum: number = 0;
    dealerHand: Card[] = [];
    buttonContainer: Container = new Container;
    cardPositions: Vector2[] = [];

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
        this.container.addChild(this.buttonContainer);

        this.deck = createShuffledDeck();
        this.dealFirst();
    }

    private async dealFirst() {
        const sprites: SpriteInfo[] = [];
        
        // Player Hand
        const card1 = removeCardFromShuffledDeck(this.deck);
        const card2 = removeCardFromShuffledDeck(this.deck);
        this.playerHand.push(card1!);
        this.playerHand.push(card2!);
        // Dealer Hand
        const card3 = removeCardFromShuffledDeck(this.deck);
        const card4 = removeCardFromShuffledDeck(this.deck);
        this.dealerHand.push(card3!);
        this.dealerHand.push(card4!);

        const cards: Card[] = [
            card1!, card2!, card3!, card4!
        ];
        for(let i=0; i<4; i++) {
            sprites[i] = {
                sprite: this.createCardSprite(cards[i]),
                delay: i*0.5
            }
        }

        await this.animateCards(sprites)

        let sum = 0;
        this.playerHand.forEach(card => {
            sum += card.value;
        });
        this.playerSum = sum;

        this.createButtons();

        //this.endRound();
    }
    
    private async animateCards(sprites: SpriteInfo[]) {
        const animations = [];
        for(let i=0; i<sprites.length; i++){
            const sprite = sprites[i].sprite;
            const position = CARD_POSITIONS[i];
            position.x += Math.random()*5;
            position.y += Math.random()*20;
            const delay = sprites[i].delay
            animations.push(animateSprite(sprite, position, delay));
        }
        await Promise.all(animations);
    }
    
    private createCardSprite(_card: Card) {
        const card = Sprite.from(this.game.textures[_card.name]);
        card.anchor.set(0.5);
        card.scale.x = CARD_SCALE;
        card.scale.y = CARD_SCALE;
        card.x = MIDDLE.x;
        card.y = -CARD_DIMENSIONS.y;
        const rand = Math.random();
        card.rotation = (rand < 0.5 ? rand*-1: rand*1)*0.02;
        this.container.addChild(card);
        return card;
    }

    private createButtons() {
        const hitPos: Vector2 = { x: MIDDLE.x - 100, y: MIDDLE.y };
        this.createButtonSprite("hit_button", hitPos);
        
        const standPos: Vector2 = { x: MIDDLE.x + 100, y: MIDDLE.y };
        this.createButtonSprite("stand_button", standPos);
    }

    private createButtonSprite(name: string, pos: Vector2) {
        const button = Sprite.from(this.game.textures[name]);
        button.anchor.set(0.5);
        button.scale.x = 0.5;
        button.scale.y = 0.5;
        button.x = pos.x;
        button.y = pos.y;
        button.interactive = true;
        if (name === "hit_button") {
            button.onclick = () => {this.hit()};
        } else if (name === "stand_button") {
            button.onclick = () => {this.stand()};
        }
        this.buttonContainer.addChild(button);
        return button;
    }

    private async hit() {
        this.disableButtons();

        const card = removeCardFromShuffledDeck(this.deck);
        this.playerHand.push(card!);
        console.log(this.playerHand);
        
        const sprites = [{
            sprite: this.createCardSprite(card!),
            delay: 0.5
        }]

        await this.animateCards(sprites)
    }

    private stand() {
        this.disableButtons();
        console.log("stand");
    }

    private disableButtons() {
        this.buttonContainer.removeChildren();
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