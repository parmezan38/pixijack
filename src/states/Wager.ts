import { Container, Sprite, TEXT_GRADIENT, Text } from "pixi.js";
import { Game, Vector2, GameState } from "../util/HelperTypes";
import {
    CHIP_DIMENSIONS,
    CHIP_SCALE,
    Chip,
    ChipSlot,
    Chips,
    WageredChips,
    addChipToWageredSlot,
    removeChipFromWageredSlot,
    resetWageredChips
} from "../logic/Chips";
import { MIDDLE, TEXT_SMALL, WINDOW_SIZE } from "../visual/UI";

export class WagerState extends GameState {
    game: Game = new Game();
    selectableChips: Sprite[] = [];

    constructor(_game: Game) {
        super();
        this.game = _game;
    }
    
    public start() {
        this.container = new Container();
        this.game.app.stage.addChild(this.container);

        this.initializeValues();

        const startPos: Vector2 = {
            x: MIDDLE.x - 3*CHIP_DIMENSIONS.x-CHIP_DIMENSIONS.x/2,
            y: WINDOW_SIZE.y - (CHIP_DIMENSIONS.y)
        }
        this.createSelectableChips(startPos);
        this.addDealButton();
        this.addText();
        this.game.buttonContainer.visible = true;
    }

    private initializeValues() {
        resetWageredChips();
        this.selectableChips = [];
        this.balanceText = new Text("");
        this.wagerText = new Text("");
    }

    private createSelectableChips(startPos: Vector2) {
        for(let i=0; i<Chips.length; i++) {
            const selectChip = Sprite.from(this.game.textures[Chips[i].name]);
            selectChip.anchor.set(0.5);
            selectChip.scale.x = CHIP_SCALE;
            selectChip.scale.y = CHIP_SCALE;
            selectChip.x = startPos.x + (i+1)*CHIP_DIMENSIONS.x*1.2;
            selectChip.y = startPos.y;
            selectChip.interactive = true;
            selectChip.onclick = () => {this.wagerChip(Chips[i], selectChip)}
            this.selectableChips.push(selectChip);
            this.container.addChild(selectChip);
        }
    }
    
    private createWageredChipSprite(chip: Chip, position: Vector2, i: number) {
        const wageredChip = Sprite.from(this.game.textures[chip.name]);
        wageredChip.anchor.set(0.5);
        wageredChip.scale.x = CHIP_SCALE;
        wageredChip.scale.y = CHIP_SCALE;
        wageredChip.x = position.x;
        wageredChip.y = position.y;
        wageredChip.interactive = true;
        wageredChip.onclick = () => {this.removeChip(chip)}
        WageredChips[i].sprite = wageredChip;
        this.container.addChild(wageredChip);
    }

    private createWageredChipText(slot: ChipSlot, position: Vector2, i: number) {
        const text = new Text(`x${slot.count}`);
        text.x = position.x + CHIP_DIMENSIONS.x*0.1;
        text.y = position.y + CHIP_DIMENSIONS.y*0.1;
        text.style.fontSize = TEXT_SMALL.fontSize;
        text.style.fill = TEXT_SMALL.fill;
        text.style.strokeThickness = TEXT_SMALL.strokeThickness;
        text.style.stroke = TEXT_SMALL.stroke;
        WageredChips[i].text = text;
        this.container.addChild(text);
    }
    
    private wagerChip(chip: Chip, sprite: Sprite) {
        const i = addChipToWageredSlot(chip);
        this.game.balance -= chip.value;
        this.game.wager += chip.value;
        this.updateText();
        this.updateChipCounter(WageredChips[i]);
        if (WageredChips[i].count <= 1) {
            const position: Vector2 = {
                x: sprite.position.x,
                y: sprite.position.y-CHIP_DIMENSIONS.y*1.1
            }
            this.createWageredChipSprite(chip, position, i);
            this.createWageredChipText(WageredChips[i], position, i);
        }
    }
    
    private removeChip(chip: Chip) {
        const i = removeChipFromWageredSlot(chip);
        this.game.balance += chip.value;
        this.game.wager -= chip.value;
        this.updateText();
        if (i>=0) {
            this.updateChipCounter(WageredChips[i]);
        }
    }
    
    private addText() {
        this.balanceText = new Text(`Player balance: ${this.game.balance}`);
        this.balanceText.x = 50;
        this.balanceText.y = 100;
        this.balanceText.style.fontSize = TEXT_SMALL.fontSize;
        this.balanceText.style.fill = TEXT_SMALL.fill;
        this.balanceText.style.strokeThickness = TEXT_SMALL.strokeThickness;
        this.balanceText.style.stroke = TEXT_SMALL.stroke;
        this.container.addChild(this.balanceText);
        
        this.wagerText = new Text(`Wager: ${this.game.wager}`);
        this.wagerText.x = 50;
        this.wagerText.y = 150;
        this.wagerText.style.fontSize = TEXT_SMALL.fontSize;
        this.wagerText.style.fill = TEXT_SMALL.fill;
        this.wagerText.style.strokeThickness = TEXT_SMALL.strokeThickness;
        this.wagerText.style.stroke = TEXT_SMALL.stroke;
        this.container.addChild(this.wagerText);
    }
    
    private updateText() {
        this.balanceText.text = `Player balance: ${this.game.balance}`;
        this.wagerText.text = `Wager: ${this.game.wager}`; 
    }

    private updateChipCounter(slot: ChipSlot) {
        if (slot?.text) {
            slot.text.text = `x${slot.count}`;
        }
    }
    
    private addDealButton() {
        const dealButton = Sprite.from(this.game.textures["deal_button"]);
        dealButton.anchor.set(0.5);
        dealButton.scale.x = 1;
        dealButton.scale.y = 1;
        dealButton.x = MIDDLE.x;
        dealButton.y = MIDDLE.y;
        dealButton.interactive = true;
        dealButton.onclick = () => {this.startDealState()}
        this.container.addChild(dealButton);
    }
    
    private startDealState() {
        if (this.game.wager === 0) return;
        this.new(this.game.playState);
    }

    public new(newState: GameState) {
        this.destroy();
        this.game.state = newState;
        this.game.state.start();
    }
    
    public destroy() {
        resetWageredChips();
        this.container.removeAllListeners();
        this.container.removeChildren();
    }
}

