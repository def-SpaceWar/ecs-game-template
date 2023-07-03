import { Component, Entity } from "../ecs";

export class SimpleDrag implements Component {
    constructor(
        public entity: Entity,
        public multiplier = 0.5
    ) {}
}
