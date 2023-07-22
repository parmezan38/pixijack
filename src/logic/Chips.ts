import { Sprite } from "pixi.js"

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
    sprite?: Sprite
}

export let WageredChips: ChipSlot[] = [];

function createSlot(chip: Chip) {
    const slot: ChipSlot = {
        name: chip.name,
        count: 1
    }
    WageredChips.push(slot);
}

export const addChipToWageredSlot = (chip: Chip) => {
    if (WageredChips.length === 0) {
        createSlot(chip);
        return 0;
    } 
    
    const i = WageredChips.findIndex((slot: ChipSlot) => slot.name === chip.name);
    if (i >= 0) {
        WageredChips[i].count++;
        return i;
    }
    createSlot(chip);
    return WageredChips.length-1;
};

export const removeChipFromWageredSlot = (chip: Chip) => {
    if (WageredChips.length <= 0) return false;

    const i = WageredChips.findIndex((slot: ChipSlot) => slot.name === chip.name);
    if (i >= 0) {
        if (WageredChips[i].count > 1) {
            WageredChips[i].count--;
            return false
        } else {
            WageredChips[i].sprite!.destroy();
            WageredChips.splice(i, 1);
            return true;
        }
    }
};

export const resetWageredChips = () => {
    for(let i=0; i<WageredChips.length; i++) {
        WageredChips[i].sprite?.destroy()
    }
    WageredChips = [];
}
