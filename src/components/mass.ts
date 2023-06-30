import { Component, Entity } from "../ecs";

export class Mass implements Component {
    constructor(
        public entity: Entity,
        public mass = 1
    ) {}
}
