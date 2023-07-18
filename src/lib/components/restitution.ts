import { Component, Entity } from "../ecs";

/**
 * @description Adds restitution (elasticity) to an entity.
 */
export class Restitution implements Component {
    /**
     * @param entity Provided by an entity wrapper.
     * @param elasticity The elasticity constant.
     */
    constructor(
        public entity: Entity,
        public elasticity = 0.5
    ) {}
}
