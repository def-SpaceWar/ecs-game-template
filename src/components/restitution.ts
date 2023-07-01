import { Component, Entity } from "../ecs";

export class Restitution implements Component {
    constructor(
        public entity: Entity,
        public elasticity = 0
    ) {}
}
