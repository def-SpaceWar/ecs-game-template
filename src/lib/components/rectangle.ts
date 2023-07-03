import { Entity } from "../ecs";
import { Drawable } from "../systems/render_system";
import { Color } from "../util/color";
import { Vector } from "../util/vector";

export class Rectangle implements Drawable {
    constructor(
        public entity: Entity,
        public dims: Vector,
        public color: Color,
        public zIndex: number = 0,
        public offset: Vector = Vector.zero()
    ) {}
}
