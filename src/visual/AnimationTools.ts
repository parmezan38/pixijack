import { Sprite } from "pixi.js";
import { Vector2 } from "../util/HelperTypes";
import gsap from "gsap";


export const animateSprite = (sprite: Sprite, destination: Vector2, delay: number): Promise<void> => {
    return new Promise<void>((resolve) => {
        gsap.to(sprite.position, {
            x: destination.x,
            y: destination.y,
            delay,
            duration: 1.0,
            onComplete: resolve
        });
    });
}