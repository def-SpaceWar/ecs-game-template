import { Component, Entity } from "../ecs";

export class AngularVelocity implements Component {
    constructor(
        public entity: Entity,
        public vel: number = 0
    ) {}
}
