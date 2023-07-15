import { AnimationController } from "../components/animation_controller";
import { Component } from "../ecs";

export class PropertyMap<T extends Component, K extends keyof T> {
    static new<T extends Component, K extends keyof T>(
        Target: new (...args: any[]) => T,
        key: K,
        value: T[K]
    ) {
        return new this(Target, key, value);
    }

    constructor(
        public readonly Target: new (...args: any[]) => T,
        public readonly key: K,
        public readonly value: T[K]
    ) { }
}

export class Keyframe<T extends Component> {
    static static<T extends Component>(timeLength: number, ...propertyMaps: PropertyMap<T, keyof T>[]) {
        return new this(timeLength, propertyMaps);
    }

    static relative<T extends Component>(timeLength: number, ...propertyMaps: PropertyMap<T, keyof T>[]) {
        return new this(timeLength, propertyMaps, true);
    }

    constructor(
        public readonly timeLength: number,
        public readonly propertyMaps: PropertyMap<T, keyof T>[],
        public readonly isRelative: boolean = false
    ) { }
}

export class AnimationData<T extends Component> {
    static static<K extends Keyframe<any>>(name: string, ...keyframes: K[]) {
        return new this(name, keyframes);
    }

    static continuous<K extends Keyframe<any>>(name: string, ...keyframes: K[]) {
        return new this(name, keyframes, true);
    }

    currentKeyframe: number;
    currentKeyframeLength: number;
    isUpdated = false;

    constructor(
        public readonly name: string,
        public readonly keyframes: Keyframe<T>[],
        public readonly isContinuous: boolean = false
    ) {
        if (name[0] == name[0].toUpperCase()) {
            throw new Error("Animation names must be lowercase! (Preferably snake_cased)");
        }

        this.currentKeyframe = 0;
        this.currentKeyframeLength = keyframes[0].timeLength;
    }
}

export namespace AnimationManager {
    export function setAnimation<T extends Component>(animationController: AnimationController<T>, animationName: string) {
        for (const animation of animationController.animations) {
            if (animation.name != animationName) continue;
            animation.currentKeyframe = 0;
            animation.currentKeyframeLength = animation.keyframes[0].timeLength;
            animation.isUpdated = false;
        }
        animationController.currentAnimation = animationName;
    }
}
