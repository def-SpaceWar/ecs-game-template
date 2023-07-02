import { Component, Entity } from "../ecs";

export class Tag implements Component {
    constructor(
        public entity: Entity,
        public tag: string
    ) {
        if (tag[0] == tag[0].toUpperCase()) {
            throw new Error("Tags must be lowercase");
        }
    }
}
