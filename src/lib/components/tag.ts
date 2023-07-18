import { Component, Entity } from "../ecs";

/**
 * @description A component that adds a tag to an entity.
 */
export class Tag implements Component {
    /**
     * @param entity Provided by an entity wrapper.
     * @param tag The string of the tag. ***MUST*** be lowercase, have no 
     * spaces, and preferably "snake_cased".
     */
    constructor(
        public entity: Entity,
        public tag: string
    ) {
        if (tag[0] == tag[0].toUpperCase()) {
            throw new Error("Tags must be lowercase! (Preferably snake_cased)");
        }

        for (const character of tag) {
            if (character != " ") continue;
            throw new Error("Tags must have no spaces!");
        }
    }
}
