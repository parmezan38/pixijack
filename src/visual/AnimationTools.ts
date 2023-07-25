import gsap from 'gsap';
import { Container, Sprite } from 'pixi.js';

import { Card, CARD_DIMENSIONS } from '../logic/Cards';
import { Vector2 } from '../util/ClassesAndTypes';


export const animateSprite = (
    sprite: Sprite,
    destination: Vector2,
    delay: number,
    duration: number,
): Promise<void> => new Promise<void>((resolve) => {
    gsap.to(sprite.position, {
        x: destination.x,
        y: destination.y,
        delay,
        duration,
        onComplete: resolve,
    });
});

export const revealSprite = (container: Container, back: Sprite, card: Card): Promise<Sprite> => {
    const front = Sprite.from(card.name);

    return new Promise<Sprite>((resolve) => {
        const scaleX = back.scale.x;
        const positionX = back.position.x;

        front.anchor.set(0.5);
        front.scale.x = 0;
        front.scale.y = back.scale.y;
        front.x = back.x;
        front.y = back.y;
        front.rotation = back.rotation;
        front.visible = false;
        container.addChild(front);

        const duration = 0.4;
        const phaseTwo = () => {
            front.zIndex -= 1;
            back.destroy();
            gsap.to(front.position, {
                x: positionX,
                duration,
                onComplete: () => {
                    resolve(front);
                },
            });
        };
        const scale2 = () => {
            back.visible = false;
            front.visible = true;
            gsap.to(front.scale, {
                x: scaleX,
                duration,
                onComplete: phaseTwo,
            });
        };
        const scale1 = () => {
            front.x = back.x;
            front.y = back.y;
            gsap.to(back.scale, {
                x: 0,
                duration,
                onComplete: scale2,
            });
        };


        gsap.to(back, {
            x: back.position.x - CARD_DIMENSIONS.x,
            duration,
            onComplete: scale1,
        });
    });
};
