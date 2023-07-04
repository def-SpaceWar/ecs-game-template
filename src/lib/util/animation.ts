import { AnimationController } from "../components/animation_controller";
import { Component } from "../ecs";

export class PropertyMap<T extends Component, K extends keyof T> {
    constructor(
        public readonly Target: new(...args: any[]) => T,
        public readonly key: K,
        public readonly value: T[K]
    ) { }
}

export class Keyframe<T extends Component> {
    constructor(
        public readonly Targets: (new(...args: any[]) => T)[],
        public readonly propertyMap: PropertyMap<T, keyof T>[],
        public readonly timeLength: number,
        public readonly isRelative = false,
        public readonly isSmooth = false
    ) { }
}

export class AnimationData {
    currentKeyframe: number;
    currentKeyframeLength: number;

    constructor(
        public readonly name: string,
        public readonly keyframes: Keyframe<Component>[]
    ) {
        this.currentKeyframe = 0;
        this.currentKeyframeLength = keyframes[0].timeLength;
    }
}

export namespace AnimationManager {
    export function setAnimation(animationController: AnimationController, animationName: string) {
        for (const animation of animationController.animations) {
            if (animation.name != animationName) continue;
            animation.currentKeyframe = 0;
            animation.currentKeyframeLength = animation.keyframes[0].timeLength;
        }
        animationController.currentAnimation = animationName;
    }
}
