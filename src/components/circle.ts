import { Entity } from "../ecs";
import { Drawable } from "../systems/render_system";
import { Color } from "../util/color";
import { Vector } from "../util/vector";

export class Circle implements Drawable {
    constructor(
        public entity: Entity,
        public diameter: number,
        public color: Color,
        public zIndex: number = 0,
        public offset: Vector = Vector.zero()
    ) {}
}
