import { Component, Entity } from "../ecs";

/**
 * @description Adds friction values to an entity.
 */
export class Friction implements Component {
    /**
     * @param entity Provided by an entity wrapper.
     * @param staticFriction The static friction constant.
     * @param kineticFriction The kinetic/dynamic friction constant.
     */
    constructor(
        public entity: Entity,
        public staticFriction = 0.6,
        public kineticFriction = 0.3
    ) {}
}
