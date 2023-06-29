import { Component, Entity } from "../ecs";
import { Vector } from "../util/vector";

export class Position implements Component {
    constructor(
        public entity: Entity,
        public pos: Vector = Vector.zero(),
        public isWorldSpace = true
    ) {}
}
