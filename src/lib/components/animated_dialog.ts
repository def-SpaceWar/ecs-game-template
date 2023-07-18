import { Component, Entity } from "../ecs";

/**
 * @description Adds an animated dialog to an entity. The entity should already 
 * have a component that renders text. Like a `ParagraphRenderer` if it is
 * multilined, and a `TextRenderer` otherwise.
 */
export class AnimatedDialog implements Component {
    /**
     * @description The current line of the dialog that is being rendered.
     */
    currentLine = 0;
    /**
     * @description The current character of the current line of the dialog that
     * is being rendered.
     */
    currentCharacter = -1;
    /**
     * @description The fraction of a character that is supposed to be rendering
     * if the animation was fully continuous.
     */
    partOfCharacter = 0;
    /**
     * @description Whether or not the animated dialog is done rendering.
     */
    isDone = false;

    constructor(
        public entity: Entity,
        public dialog: string[],
        public speed: number = 5,
        public multiLine: boolean = false
    ) { }
}