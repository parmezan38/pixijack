import { Vector2 } from '../util/ClassesAndTypes';

export const WINDOW_SIZE: Vector2 = {
    x: window.innerWidth,
    y: window.innerHeight,
};

export const MIDDLE: Vector2 = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
};

export const BUTTON_NAMES = [
    'deal_button',
    'hit_button',
    'stand_button',
    'reset_button',
];

export const TEXT_BIG = {
    fontSize: 96,
    fill: '#fffcf5',
    strokeThickness: 8,
    stroke: '#0f0700',
};

export const TEXT_MEDIUM = {
    fontSize: 44,
    fill: '#fffcf5',
    strokeThickness: 4,
    stroke: '#0f0700',
};

export const TEXT_SMALL = {
    fontSize: 34,
    fill: '#fffcf5',
    strokeThickness: 4,
    stroke: '#0f0700',
};