import { Container, Sprite, Text } from "pixi.js";
import { Game, GameState, Vector2 } from "../util/HelperTypes";
import { CARD_SCALE, CARD_DIMENSIONS, Card, createShuffledDeck, removeCardFromShuffledDeck, CARD_DISTANCE, CARD_TYPES } from "../logic/Cards";
import { animateSprite, revealSprite } from "../visual/AnimationTools";
import { MIDDLE, TEXT_MEDIUM, TEXT_SMALL } from "../visual/UI";

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
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

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
        this.playerHand = [];
        this.dealerHand = [];

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
        this.game.buttonContainer.visible = false;
        // Player Hand
        const playerPos = { 
            x: MIDDLE.x - CARD_DIMENSIONS.x*0.2,
            y: MIDDLE.y + CARD_DIMENSIONS.y*0.75
        }; 
        const card1 = removeCardFromShuffledDeck(this.deck);
        const card2 = removeCardFromShuffledDeck(this.deck);
        this.addCardToHand(card1!, 0.0, true, playerPos);
        this.addCardToHand(card2!, 0.3, true);
        // Dealer Hand
        const dealerPos = {
            x: MIDDLE.x - CARD_DIMENSIONS.x*0.2,
            y: MIDDLE.y - CARD_DIMENSIONS.y*0.75
        }
        const card3 = removeCardFromShuffledDeck(this.deck);
        const card4 = removeCardFromShuffledDeck(this.deck);
        this.addCardToHand(card3!, 0.6, false, dealerPos, true);
        this.addCardToHand(card4!, 0.9, false);

        await this.animateCards([...this.playerHand, ...this.dealerHand]);

        this.createButtons();
        this.addPlayerText();
        this.addDealerText();
        
        await this.checkCardStatus();
    }
    
    private async checkCardStatus() {
        this.calculateSum();
        
        if (this.playerSum === 21) {
            await this.stand();
        } else if (this.playerSum > 21) {
            await this.endRound(END_TYPE.LOSE); // TU JE PROBLEM
        }
        this.createButtons();
    }

    private calculateSum(){
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
    }

    private checkIfAce(isPlayer: Boolean) {
        let sum = isPlayer ? this.playerSum : this.dealerSum;
        let hand = isPlayer ? this.playerHand : this.dealerHand;
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

    private async hit() {
        this.disableButtons();

        const card = removeCardFromShuffledDeck(this.deck);
        this.addCardToHand(card!, 0.0, true);
        
        const hand = this.playerHand[this.playerHand.length-1];

        await this.animateCards([hand]);

        this.checkCardStatus();
    }

    private async stand() {
        this.disableButtons();
        await this.revealCard();
        await this.standCheck();
    }

    private async standCheck() {
        this.disableButtons();
        this.calculateSum();
        this.dealerSumText.visible = true;
        
        if (this.playerSum > 21) {
            await this.endRound(END_TYPE.LOSE);
        } else if (this.playerSum === 21) {
            if (this.dealerSum > 21) {
                await this.endRound(END_TYPE.WIN);
            } else if (this.dealerSum < 21) {
                await this.dealDealerAnotherHand();
                await this.standCheck();
            } else {
                await this.endRound(END_TYPE.DRAW);
            }
        } else {
            if (this.dealerSum > 21) {
                await this.endRound(END_TYPE.WIN);
            } else if (this.dealerSum > this.playerSum){
                await this.endRound(END_TYPE.LOSE);
            } 
            else if (this.dealerSum < this.playerSum) {
                await this.dealDealerAnotherHand();
                await this.standCheck();
            } else {
                await this.endRound(END_TYPE.DRAW);
            }
        }
    }

    private async dealDealerAnotherHand() {
        const card = removeCardFromShuffledDeck(this.deck);
        this.addCardToHand(card!, 0.0, false);
        const hand = this.dealerHand[this.dealerHand.length-1];
        await this.animateCards([hand]);
    }
    private addCardToHand(
        card: Card,
        delay: number,
        isPlayer: boolean,
        _position: Vector2|null = null,
        isBack: boolean = false
        ) {
        const hand = isPlayer ? this.playerHand : this.dealerHand;
        const position = _position != null ? _position : this.getPositionFromPrevious(isPlayer);
        const sprite = this.createCardSprite(card, isBack);
        hand.push({ card, delay, sprite, position }); 
    }

    private createCardSprite(_card: Card, isBack: boolean) {
        const name = isBack ? "back_card" : _card.name;
        const card = Sprite.from(this.game.textures[name]);
        card.anchor.set(0.5);
        card.scale.x = CARD_SCALE;
        card.scale.y = CARD_SCALE;
        card.x = MIDDLE.x;
        card.y = 0-CARD_DIMENSIONS.y;
        const rand = Math.random();
        card.rotation = (rand < 0.5 ? rand*-1: rand*1)*0.02;
        this.cardContainer.addChild(card);
        return card;
    }

    private async endRound(type: END_TYPE) {
        if (type === END_TYPE.WIN) {
            this.game.balance += this.game.wager * 2;
        } else if (type === END_TYPE.DRAW) {
            this.game.balance += this.game.wager;
        }
        
        this.game.wager = 0;
        await this.showEndRoundTitle(type);
        this.new(this.game.wagerState);
        return
    }

    private async showEndRoundTitle(type: END_TYPE) {
        const str = type === END_TYPE.DRAW ? 'Draw!' : `You ${type}`;
        const text = new Text(str);
        text.style.fontSize = 96;
        text.style.fill = "#fffcf5";
        text.style.strokeThickness = 8;
        text.style.stroke = "#0f0700";
        text.anchor.x = 0.5;
        text.anchor.y = 0.5;
        text.x = MIDDLE.x;
        text.y = MIDDLE.y - CARD_DIMENSIONS.y*0.2;
        this.container.addChild(text);
        await delay(2000);
    }


    private getPositionFromPrevious(isPlayer: Boolean) {
        const hand = isPlayer ? this.playerHand : this.dealerHand;
        const previousHand = hand[hand.length-1]
        const pos = {
            x: previousHand.position.x + CARD_DISTANCE,
            y: previousHand.position.y
        }
        return pos;
    }

    private async animateCards(hands: HandCard[]) {
        const animations = [];
        for(let i=0; i<hands.length; i++){
            const sprite = hands[i].sprite;
            const position = hands[i].position;
            position.x += Math.random()*(CARD_DIMENSIONS.x*0.04);
            position.y += Math.random()*(CARD_DIMENSIONS.x*0.05);
            const delay = hands[i].delay
            const duration = position.y < MIDDLE.y ? 0.75 : 1;
            animations.push(animateSprite(sprite, position, delay, duration));
        }
        await Promise.all(animations);
    }

    private async revealCard() {
        await revealSprite(this.cardContainer, this.dealerHand[0].sprite, this.dealerHand[0].card);
    }
    
    private addPlayerText() {
        this.playerSumText = new Text(`${this.playerSum}`);
        this.playerSumText.style.fontSize = TEXT_MEDIUM.fontSize;
        this.playerSumText.style.fill = TEXT_MEDIUM.fill;
        this.playerSumText.style.strokeThickness = TEXT_MEDIUM.strokeThickness;
        this.playerSumText.style.stroke = TEXT_MEDIUM.stroke;
        this.playerSumText.anchor.x = 0.5;
        this.playerSumText.anchor.y = 0.5;
        this.playerSumText.x = MIDDLE.x;
        this.playerSumText.y = MIDDLE.y;
        this.container.addChild(this.playerSumText);
    }
    private addDealerText() {
        this.dealerSumText = new Text(`${this.dealerSum}`);
        this.dealerSumText.style.fontSize = TEXT_MEDIUM.fontSize;
        this.dealerSumText.style.fill = TEXT_MEDIUM.fill;
        this.dealerSumText.style.strokeThickness = TEXT_MEDIUM.strokeThickness;
        this.dealerSumText.style.stroke = TEXT_MEDIUM.stroke;
        this.dealerSumText.anchor.x = 0.5;
        this.dealerSumText.anchor.y = 0.5;
        this.dealerSumText.x = MIDDLE.x;
        this.dealerSumText.y = 50;
        this.dealerSumText.visible = false;
        this.container.addChild(this.dealerSumText);
    }

    private updateText() {
        this.playerSumText.text = `${this.playerSum}`;
        this.dealerSumText.text = `${this.dealerSum}`;
    }

    private createButtons() {
        const hitPos: Vector2 = { x: MIDDLE.x - 100, y: MIDDLE.y };
        this.createButtonSprite("hit_button", hitPos);
        
        const standPos: Vector2 = { x: MIDDLE.x + 100, y: MIDDLE.y };
        this.createButtonSprite("stand_button", standPos);
        
        this.game.buttonContainer.visible = true;
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
        this.game.buttonContainer.visible = false;
    }

    public destroy() {
        this.disableButtons();
        this.container.removeChildren();
        this.container.removeAllListeners();
        return;
    }
}