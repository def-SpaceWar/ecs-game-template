import { Component, Entity } from "../ecs";

export class Rotation implements Component {
    constructor(
        public entity: Entity,
        public angle = 0
    ) {}
}
