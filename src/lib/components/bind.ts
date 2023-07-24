import { Component, Entity, System } from "../ecs";

/**
 * @description Tells a Bind on which type of update to run on.
 */
export type BindType = "render" | "tick";

/**
 * @description Adds a binding to an entity.
 */
export class Bind implements Component {
    /**
     * @param entity Provided by an entity wrapper
     * @param binding A function to run.
     * @param type On what tick the function should run.
     */
    constructor(
        public entity: Entity,
        public binding: System,
        public type: BindType = "tick"
    ) { }
}
