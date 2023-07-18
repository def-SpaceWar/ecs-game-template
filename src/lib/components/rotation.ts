import { Component, Entity } from "../ecs";

/**
 * @description Adds a rotation to an entity.
 */
export class Rotation implements Component {
    /**
     * @param entity Provided by an entity wrapper.
     * @param angle The angle of the rotation.
     */
    constructor(
        public entity: Entity,
        public angle = 0
    ) {}
}
