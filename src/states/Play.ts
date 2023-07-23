import { Container, Sprite, Text } from "pixi.js";
import { Game, GameState, Vector2 } from "../util/HelperTypes";
import { CARD_POSITIONS, CARD_SCALE, CARD_DIMENSIONS, Card, createShuffledDeck, removeCardFromShuffledDeck, CARD_DISTANCE, CARD_TYPES } from "../logic/Cards";
import { animateSprite, revealSprite } from "../visual/AnimationTools";
import { MIDDLE } from "../visual/UI";

type HandCard = {
    card: Card;
    sprite: Sprite;
    delay: number;
    position: Vector2;
}

const enum END_TYPE {
    WIN = "win",
    LOSE = "lose",
    DRAW = "draw"
}

export class PlayState extends GameState {
    game: Game = new Game();
    deck: Card[] = [];
    buttonContainer: Container = new Container;
    cardContainer: Container = new Container;
    cardPositions: Vector2[] = [];
    
    playerHand: HandCard[] = [];
    playerSum: number = 0;
    playerSumText: Text = new Text(); 

    dealerHand: HandCard[] = [];
    dealerSum: number = 0;
    dealerSumText: Text = new Text();
    

    constructor(_game: Game) {
        super();
        this.game = _game;
    }
    
    public start() {
        console.log("PlayState");

        this.playerHand = [];
        this.dealerHand = [];

        this.selectableChips = [];
        this.balanceText = new Text("");
        this.wagerText = new Text("");

        this.container = new Container();
        this.game.app.stage.addChild(this.container);
        this.cardContainer = new Container();
        this.cardContainer.sortableChildren = true;
        this.container.addChild(this.cardContainer);
        this.buttonContainer = new Container();
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
            delay: 0.3,
            position: this.getPositionFromPrevious(true)
        });

        // Dealer Hand
        const card3 = removeCardFromShuffledDeck(this.deck);
        const card4 = removeCardFromShuffledDeck(this.deck);
        this.dealerHand.push({
            card: card3!,
            sprite: this.createCardSprite(card3!, true),
            delay: 0.6,
            position: CARD_POSITIONS[1]
        });
        this.dealerHand.push({
            card: card4!,
            sprite: this.createCardSprite(card4!),
            delay: 0.9,
            position: this.getPositionFromPrevious(false)
        });

        await this.animateCards([...this.playerHand, ...this.dealerHand]);

        this.createButtons();
        this.addPlayerText();
        this.checkCardStatus();
    }
    
    private checkCardStatus() {
        this.playerSum = 0;
        this.dealerSum = 0;

        this.playerHand.forEach(hand => {
            this.playerSum += hand.card.value;
        });

        this.dealerHand.forEach(hand => {
            this.dealerSum += hand.card.value;
        });

        this.playerSum = this.checkIfAce(true);
        this.dealerSum = this.checkIfAce(false);
        this.updateText();

        if (this.playerSum === 21) {
            if(this.dealerSum !== 21) {
                this.endRound(END_TYPE.WIN);
            } else {
                this.endRound(END_TYPE.DRAW);
            }
        } else if (this.playerSum > 21) {
            this.endRound(END_TYPE.LOSE);
        }
    }

    private checkIfAce(isPlayer: Boolean) {
        let sum = isPlayer ? this.playerSum : this.dealerSum;
        let hand = isPlayer ? this.playerHand : this.playerHand;
        let aceExists = false;
        if (sum > 21) {
            hand.forEach((hand: HandCard) => {
                if(hand.card.type === CARD_TYPES.ACE) {
                    aceExists = true;
                }
            }) 
        }
        if (aceExists) {
            sum -= 10;
        }
        return sum;
    }

    private addPlayerText() {
        this.playerSumText = new Text(`${this.playerSum}`);
        this.playerSumText.anchor.x = 0.5;
        this.playerSumText.anchor.y = 0.5;
        this.playerSumText.x = MIDDLE.x;
        this.playerSumText.y = MIDDLE.y;
        this.container.addChild(this.playerSumText);
    }
    private addDealerText() {
        this.dealerSumText = new Text(`${this.dealerSum}`);
        this.dealerSumText.anchor.x = 0.5;
        this.dealerSumText.anchor.y = 0.5;
        this.dealerSumText.x = MIDDLE.x;
        this.dealerSumText.y = 50;
        this.container.addChild(this.dealerSumText);
    }

    private updateText() {
        this.playerSumText.text = `${this.playerSum}`;
        this.dealerSumText.text = `${this.dealerSum}`;
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

    private async stand() {
        this.disableButtons();
        await this.revealCard();
        this.checkCardStatus();
        this.addDealerText();
        this.createButtons();
    }

    private endRound(type: END_TYPE) {
        if (type === END_TYPE.WIN) {
            this.game.balance += this.game.wager * 2;
        } else if (type === END_TYPE.DRAW) {
            this.game.balance += this.game.wager;
        }

        this.game.wager = 0;        
        this.new(this.game.wagerState);
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
            const duration = position.y < MIDDLE.y ? 0.75 : 1;
            animations.push(animateSprite(sprite, position, delay, duration));
        }
        await Promise.all(animations);
    }

    private async revealCard() {
        await revealSprite(this.cardContainer, this.dealerHand[0].sprite, this.dealerHand[0].card);
    }
    
    private createCardSprite(_card: Card, isBack: boolean = false) {
        const name = isBack ? "back_card" : _card.name;
        const card = Sprite.from(this.game.textures[name]);
        card.anchor.set(0.5);
        card.scale.x = CARD_SCALE;
        card.scale.y = CARD_SCALE;
        card.x = MIDDLE.x;
        card.y = -CARD_DIMENSIONS.y;
        const rand = Math.random();
        card.rotation = (rand < 0.5 ? rand*-1: rand*1)*0.02;
        this.cardContainer.addChild(card);
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
        button.scale.x = 0.8;
        button.scale.y = 0.8;
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
    
    private disableButtons() {
        this.buttonContainer.removeChildren();
    }

    public destroy() {
        this.disableButtons();
        this.container.removeAllListeners();
        this.container.removeChildren();
    }
}