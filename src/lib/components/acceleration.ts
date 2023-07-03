import { Component, Entity } from "../ecs";
import { Vector } from "../util/vector";

export class Acceleration implements Component {
    constructor(
        public entity: Entity,
        public acc: Vector = Vector.zero(),
    ) { }
}
