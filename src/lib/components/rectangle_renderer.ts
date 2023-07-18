import { Entity } from "../ecs";
import { ColoredDrawable, FillSource } from "../systems/render_system";
import { Color } from "../util/color";
import { Vector } from "../util/vector";

export class RectangleRenderer implements ColoredDrawable {
    constructor(
        public entity: Entity,
        public dims: Vector,
        public color: FillSource,
        public zIndex: number = 0,
        public offset: Vector = Vector.zero(),
        public rotation: number = 0,
        public strokeColor: FillSource = Color.black(),
        public lineWidth = 1
    ) {}
}
