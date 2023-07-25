import { Sprite, Text } from "pixi.js"
import { Vector2 } from "../util/HelperTypes";

export const CHIP_SCALE: number = 1;
export const CHIP_DIMENSIONS: Vector2 = {
    x: 150 * CHIP_SCALE,
    y: 150 * CHIP_SCALE
}

export type Chip = {
    name: string,
    value: number
}

export const Chips: Chip[] = [
    { name: "chip1", value: 1 },
    { name: "chip2", value: 2 },
    { name: "chip5", value: 5 },
    { name: "chip10", value: 10 },
    { name: "chip20", value: 20 }
]

export type ChipSlot = {
    name: string,
    count: number,
    sprite?: Sprite,
    text?: Text
}

export let WageredChips: ChipSlot[] = [];

function createSlot(chip: Chip): number {
    const slot: ChipSlot = {
        name: chip.name,
        count: 1
    }
    return WageredChips.push(slot)-1;
}

export const addChipToWageredSlot = (chip: Chip): number => {
    if (WageredChips.length === 0) {
        return createSlot(chip);
    } 
    
    const i = WageredChips.findIndex((slot: ChipSlot) => slot.name === chip.name);
    if (i >= 0) {
        WageredChips[i].count++;
        return i;
    } else {
        return createSlot(chip);
    }
};

export const removeChipFromWageredSlot = (chip: Chip): number => {
    if (WageredChips.length <= 0) return -1;

    const i = WageredChips.findIndex((slot: ChipSlot) => slot.name === chip.name);
    if (i >= 0) {
        if (WageredChips[i].count > 1) {
            WageredChips[i].count--;
            return i;
        } else {
            WageredChips[i].sprite!.destroy();
            WageredChips[i].text!.destroy();
            WageredChips.splice(i, 1);
            return i;
        }
    }
    return i;
};

export const resetWageredChips = () => {
    for(let i=0; i<WageredChips.length; i++) {
        WageredChips[i].sprite?.destroy();
        WageredChips[i].text?.destroy();
    }
    WageredChips = [];
}
