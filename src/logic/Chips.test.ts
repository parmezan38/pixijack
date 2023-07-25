import {
    addChipToWageredSlot,
    Chip,
    ChipSlot,
    removeChipFromWageredSlot,
    resetWageredChips,
    WageredChips,
} from './Chips';

const chip20: Chip = {
    name: 'chip20',
    value: 20,
};

describe('addChipToWageredSlot', () => {
    it('should add chipt to WageredChips', () => {
        addChipToWageredSlot(chip20);
        const i = WageredChips.findIndex((slot: ChipSlot) => slot.name === chip20.name);

        expect(i).toBeGreaterThanOrEqual(0);
    });
});

describe('removeChipFromWageredSlot', () => {
    it('should only reduce count multiple of the same type exist', () => {
        addChipToWageredSlot(chip20);
        removeChipFromWageredSlot(chip20);
        const i = WageredChips.findIndex((slot: ChipSlot) => slot.name === chip20.name);
        const bool = WageredChips[i].count === 1;
        
        expect(bool).toBeTruthy();
    });
});

describe('resetWageredChips', () => {
    it('should make WageredChips an empty array', () => {
        resetWageredChips();
        expect(WageredChips.length).toBe(0);
    });
});
