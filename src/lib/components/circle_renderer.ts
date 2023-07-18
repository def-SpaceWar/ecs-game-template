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
     * @param diameter Diameter of the circle.
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
