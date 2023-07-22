import { Container, Sprite, Text } from "pixi.js";
import { Game, Position, GameState } from "../util/HelperTypes";
import { Chip, Chips, WageredChips, addChipToWageredSlot, removeChipFromWageredSlot } from "../logic/Chips";

export class WagerState extends GameState {
    game: Game = new Game();
    
    constructor(_game: Game) {
        super();
        this.game = _game;

        this.startState = () => {
            this.selectableChips = []
            this.balanceText = new Text(""),
            this.wagerText = new Text(""),
            this.container = new Container()
            this.game.app.stage.addChild(this.container);
            const startPos: Position = {
                x: 150,
                y: 600 
            }
            this.createSelectableChips(startPos);
            this.addDealButton();
            this.addText();    
        }
    }

    private createSelectableChips(startPos: Position) {
        for(let i=0; i<Chips.length; i++) {
            const selectChip = Sprite.from(this.game.textures[Chips[i].name]);
            selectChip.anchor.set(0.5);
            selectChip.scale.x = 0.5;
            selectChip.scale.y = 0.5;
            selectChip.x = startPos.x + (i+1)*150;
            selectChip.y = startPos.y;
            selectChip.interactive = true;
            selectChip.onclick = () => {this.wagerChip(Chips[i])}
            this.selectableChips.push(selectChip);
            this.container.addChild(selectChip);
        }
    }
    
    private createWageredChip(chip: Chip, startPos: Position, i: number) {
        const wageredChip = Sprite.from(this.game.textures[chip.name]);
        wageredChip.anchor.set(0.5);
        wageredChip.scale.x = 0.5;
        wageredChip.scale.y = 0.5;
        wageredChip.x = startPos.x + (i+1)*150;
        wageredChip.y = startPos.y;
        wageredChip.interactive = true;
        wageredChip.onclick = () => {this.removeChip(chip)}
        WageredChips[i].sprite = wageredChip;
        this.container.addChild(wageredChip);
    }
    
    private wagerChip(chip: Chip) {
        const slot = addChipToWageredSlot(chip);
        this.game.balance -= chip.value;
        this.game.wager += chip.value;
        this.updateText();
        if (WageredChips[slot].count <= 1) {
            const startPos: Position = {
                x: 150,
                y: 450 
            }
            this.createWageredChip(chip, startPos, slot);
        }
    }
    
    private removeChip(chip: Chip) {
        removeChipFromWageredSlot(chip);
        this.game.balance += chip.value;
        this.game.wager -= chip.value;
        this.updateText();
    }
    
    private addText() {
        this.balanceText = new Text(`Player balance: ${this.game.balance}`);
        this.balanceText.x = 50;
        this.balanceText.y = 100;
        this.container.addChild(this.balanceText);
        
        this.wagerText = new Text(`Wager: ${this.game.wager}`);
        this.wagerText.x = 50;
        this.wagerText.y = 150;
        this.container.addChild(this.wagerText);
    }
    
    private updateText() {
        this.balanceText.text = `Player balance: ${this.game.balance}`;
        this.wagerText.text = `Wager: ${this.game.wager}`; 
    }
    
    private addDealButton() {
        const dealButton = Sprite.from(this.game.textures["deal_button"]);
        dealButton.anchor.set(0.5);
        dealButton.scale.x = 1;
        dealButton.scale.y = 1;
        dealButton.x = 500;
        dealButton.y = 100;
        dealButton.interactive = true;
        dealButton.onclick = () => {this.startDealState()}
        this.container.addChild(dealButton);
    }
    
    private startDealState() {
        if (this.game.wager === 0) return;
        console.log("Can deal");
    }
}

