import { Container, Sprite, Text } from "pixi.js";
import { Game, GameState, Vector2 } from "../util/HelperTypes";
import { CARD_POSITIONS, CARD_SCALE, CARD_DIMENSIONS, Card, createShuffledDeck, removeCardFromShuffledDeck, CARD_DISTANCE } from "../logic/Cards";
import { animateSprite } from "../visual/AnimationTools";
import { MIDDLE } from "../visual/UI";

type HandCard = {
    card: Card;
    sprite: Sprite;
    delay: number;
    position: Vector2;
}

export class PlayState extends GameState {
    game: Game = new Game();
    deck: Card[] = [];
    playerHand: HandCard[] = [];
    dealerHand: HandCard[] = [];
    playerSum: number = 0;
    dealerSum: number = 0;
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
        // Player Hand
        const card1 = removeCardFromShuffledDeck(this.deck);
        const card2 = removeCardFromShuffledDeck(this.deck);
        this.playerHand.push({
            card: card1!,
            sprite: this.createCardSprite(card1!),
            delay: 0.0,
            position: CARD_POSITIONS[0]
        });
        this.playerHand.push({
            card: card2!,
            sprite: this.createCardSprite(card2!),
            delay: 0.5,
            position: this.getPositionFromPrevious(true)
        });

        // Dealer Hand
        const card3 = removeCardFromShuffledDeck(this.deck);
        const card4 = removeCardFromShuffledDeck(this.deck);
        this.dealerHand.push({
            card: card3!,
            sprite: this.createCardSprite(card3!),
            delay: 1.0,
            position: CARD_POSITIONS[1]
        });
        this.dealerHand.push({
            card: card4!,
            sprite: this.createCardSprite(card4!),
            delay: 1.5,
            position: this.getPositionFromPrevious(false)
        });

        await this.animateCards([...this.playerHand, ...this.dealerHand]);

        this.checkCardStatus();
        this.createButtons();
    }
    
    private checkCardStatus() {
        let playerSum: number = 0;
        let dealerSum: number = 0;

        this.playerHand.forEach(hand => {
            playerSum += hand.card.value;
        });
        this.dealerHand.forEach(hand => {
            dealerSum += hand.card.value;
        });

        this.playerSum = playerSum;
        this.dealerSum = dealerSum;

        if (this.playerSum === 21) {
            if(this.dealerSum !== 21) {
                this.win();
            } else {
                this.draw();
            }
        } else if (this.playerSum > 21) {
            this.lose();
        }
    }

    private async hit() {
        this.disableButtons();

        const card = removeCardFromShuffledDeck(this.deck);

        this.playerHand.push({
            card: card!,
            sprite: this.createCardSprite(card!),
            delay: 0.0,
            position: this.getPositionFromPrevious(true)
        });
        
        const hand = this.playerHand[this.playerHand.length-1];

        await this.animateCards([hand]);

        
        this.checkCardStatus();
        this.createButtons();
    }

    private stand() {
        this.checkCardStatus();
        this.createButtons();
    }

    private win() {
        this.game.balance += this.game.wager * 2;
        this.endRound();
    }

    private lose() {
        this.endRound();
    }

    private draw() {
        this.game.balance += this.game.wager * 2;
        this.endRound();
    }

    private endRound() {
        this.game.wager = 0;        
        this.new(this.game.wagerState);
    }

    private disableButtons() {
        this.buttonContainer.removeChildren();
    }

    private getPositionFromPrevious(isPlayer: Boolean) {
        if (isPlayer) {
            const previousHand = this.playerHand[this.playerHand.length-1]
            const pos = {
                x: previousHand.position.x + CARD_DISTANCE,
                y: previousHand.position.y
            }
            return pos;
        } else {
            const previousHand = this.dealerHand[this.dealerHand.length-1]
            const pos = {
                x: previousHand.position.x + CARD_DISTANCE,
                y: previousHand.position.y
            }
            return pos;
        }
    }

    private async animateCards(hands: HandCard[]) {
        const animations = [];
        for(let i=0; i<hands.length; i++){
            const sprite = hands[i].sprite;
            const position = hands[i].position;
            position.x += Math.random()*5;
            position.y += Math.random()*20;
            const delay = hands[i].delay
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