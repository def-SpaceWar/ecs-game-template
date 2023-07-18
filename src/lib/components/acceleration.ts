import { Component, Entity } from "../ecs";
import { Vector } from "../util/vector";

/**
 * @description Adds acceleration to an entity.
 */
export class Acceleration implements Component {
    /**
     * @param entity Provided by an entity wrapper.
     * @param acc The acceleration of the entity.
     */
    constructor(
        public entity: Entity,
        public acc: Vector = Vector.zero(),
    ) { }
}
