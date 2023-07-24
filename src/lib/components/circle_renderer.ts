import { Entity } from "../ecs";
import { ColoredDrawable, FillSource } from "../systems/render_system";
import { Color } from "../util/color";
import { Vector } from "../util/vector";

/**
 * @description A component that is used to render a circle.
 */
export class CircleRenderer implements ColoredDrawable {
    rotation: number = 0;

    /**
     * @param entity Provided by an entity wrapper.
     * @param diameter The diameter of the circle.
     * @param color The output color/fillStyle of the drawable.
     * @param zIndex The z-index a drawable is rendered at.
     * @param offset the positional offset a drawable is rendered at.
     * @param strokeColor The output strokeColor/strokeStyle of the drawable.
     * @param lineWidth The lineWidth of the strokes of a drawable.
     */
    constructor(
        public entity: Entity,
        public diameter: number,
        public color: FillSource,
        public zIndex: number = 0,
        public offset: Vector = Vector.zero(),
        public strokeColor: FillSource = Color.black(),
        public lineWidth: number = 1
    ) {}
}
