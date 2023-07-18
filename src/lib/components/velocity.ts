import { Component, Entity } from "../ecs";
import { Vector } from "../util/vector";

/**
 * @description Adds a velocity to an entity.
 */
export class Velocity implements Component {
    /**
     * @param entity Provided by an entity wrapper.
     * @param vel The velocity of the entity.
     */
    constructor(
        public entity: Entity,
        public vel: Vector = Vector.zero(),
    ) {}
}
