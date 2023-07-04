// TODO
import { Component, Entity } from "../ecs";

export class AnimationController implements Component {
    constructor(
        public entity: Entity,
        // public animations: Animation[]
    ) {}
}
