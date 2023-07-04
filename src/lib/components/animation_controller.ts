import { Component, Entity } from "../ecs";
import { AnimationData } from "../util/animation";

export class AnimationController implements Component {
    constructor(
        public entity: Entity,
        public animations: AnimationData[],
        public currentAnimation = animations[0].name
    ) {}
}
