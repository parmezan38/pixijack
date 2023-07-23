import { Container, Sprite } from "pixi.js";
import { Vector2 } from "../util/HelperTypes";
import gsap from "gsap";
import { CARD_DIMENSIONS, Card } from "../logic/Cards";


export const animateSprite = (
    sprite: Sprite,
    destination: Vector2,
    delay: number,
    duration: number
    ): Promise<void> => {
    return new Promise<void>((resolve) => {
        gsap.to(sprite.position, {
            x: destination.x,
            y: destination.y,
            delay,
            duration,
            onComplete: resolve
        });
    });
}

export const revealSprite = (container: Container, back: Sprite, card: Card): Promise<void> => {
    return new Promise<void>((resolve) => {
        const scaleX = back.scale.x;
        const positionX = back.position.x;

        const front = Sprite.from(card.name);
        front.anchor.set(0.5);
        front.scale.x = 0;
        front.scale.y = back.scale.y;
        front.x = back.x;
        front.y = back.y;
        front.rotation = back.rotation;
        front.visible = false;
        container.addChild(front);

        const duration = 0.4;
        const phaseFour = () => {
            back.visible = false;
            front.visible = true;
            gsap.to(front.scale, {
                x: scaleX,
                duration,
                onComplete: resolve,
            });
        };
        const phaseThree = () => {
            gsap.to(back.scale, {
                x: 0,
                duration,
                onComplete: phaseFour,
            });
        };
        const phaseTwo = () => {
            back.zIndex += 1;
            front.zIndex += 1;
            gsap.to(back.position, {
                x: positionX,
                duration,
                onComplete: phaseThree,
            });
        };
        gsap.to(back, {
            x: back.position.x - CARD_DIMENSIONS.x,
            duration,
            onComplete: phaseTwo,
        });
    });
}