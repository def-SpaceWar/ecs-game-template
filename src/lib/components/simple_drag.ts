import { Component, Entity } from "../ecs";

/**
 * @description Adds a constant force that slows an entity.
 */
export class SimpleDrag implements Component {
    /**
     * @param entity Provided by an entity wrapper.
     * @param multiplier How much the entity's velocity is scaled in a second.
     */
    constructor(
        public entity: Entity,
        public multiplier = 0.5
    ) {}
}
