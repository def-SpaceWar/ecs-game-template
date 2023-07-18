import { Component, Entity } from "../ecs";

/**
 * @description Adds a mass quantity to an entity.
 */
export class Mass implements Component {
    /**
     * @param entity Provided by an entity wrapper.
     * @param mass The mass quantity.
     */
    constructor(
        public entity: Entity,
        public mass = 1
    ) {}
}
