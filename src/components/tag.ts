import { Component, Entity } from "../ecs";

export class Tag implements Component {
    constructor(
        public entity: Entity,
        public tag: string
    ) {}
}
