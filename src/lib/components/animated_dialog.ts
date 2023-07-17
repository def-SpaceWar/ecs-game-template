import { Component, Entity } from "../ecs";

export class AnimatedDialog implements Component {
    currentLine = 0;
    currentCharacter = -1;
    isDone = false;

    partOfCharacter = 0;

    constructor(
        public entity: Entity,
        public lines: string[],
        public speed: number = 5,
        public multiLine: boolean = false
    ) { }
}