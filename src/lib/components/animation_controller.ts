import { Component, Entity } from "../ecs";
import { AnimationData } from "../util/animation";

export class AnimationController<T extends Component> implements Component {
    currentAnimation: string;
    animations: AnimationData<T>[];

    constructor(
        public entity: Entity,
        ...animations: AnimationData<T>[]
    ) {
        this.animations = animations;
        this.currentAnimation = animations[0].name;
    }
}
