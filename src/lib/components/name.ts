import { Component, Entity } from "../ecs";

/**
 * @description Gives a name to an entity.
 */
export class Name implements Component {
    /**
     * @param entity Provided by an entity wrapper.
     * @param name A name to associate an entity with. The first word ***MUST***
     * be uppercase!
     */
    constructor(
        public entity: Entity,
        public name: string
    ) {
        if (name[0] == name[0].toLowerCase()) {
            throw new Error("Names must be uppercase!");
        }
    }
}
