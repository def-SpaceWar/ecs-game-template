import { Component, Entity } from "../ecs";

export class Name implements Component {
    constructor(
        public entity: Entity,
        public name: string
    ) {
        if (name[0] == name[0].toLowerCase()) {
            throw new Error("Names must be uppercase!");
        }
    }
}
