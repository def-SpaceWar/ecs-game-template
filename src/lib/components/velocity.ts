import { Component, Entity } from "../ecs";
import { Vector } from "../util/vector";

export class Velocity implements Component {
    constructor(
        public entity: Entity,
        public vel: Vector = Vector.zero(),
    ) {}
}
