import { Component, Entity } from "../ecs";
import { Vector } from "../util/vector";

/**
 * @description Adds a position to an entity.
 */
export class Position implements Component {
    /**
     * 
     * @param entity Provided by an entity wrapper.
     * @param pos The position of the entity.
     * @param isWorldSpace Whether or not the entity's position should be
     * affected by the main camera. Set to true by default, set to false for UI
     * elements.
     */
    constructor(
        public entity: Entity,
        public pos: Vector = Vector.zero(),
        public isWorldSpace = true
    ) {}
}
