import { Component, Entity } from "../ecs";

export class Friction implements Component {
    constructor(
        public entity: Entity,
        public staticFriction = 0.6,
        public kineticFriction = 0.3
    ) {}
}
