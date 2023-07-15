import { Entity } from "../ecs";
import { Drawable, FillSource } from "../systems/render_system";
import { Vector } from "../util/vector";

export class Rectangle implements Drawable {
    constructor(
        public entity: Entity,
        public dims: Vector,
        public color: FillSource,
        public zIndex: number = 0,
        public offset: Vector = Vector.zero(),
        public rotation: number = 0
    ) {}
}
