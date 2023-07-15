import { Entity } from "../ecs";
import { Drawable, FillSource } from "../systems/render_system";
import { Vector } from "../util/vector";

export class Circle implements Drawable {
    rotation: number = 0;

    constructor(
        public entity: Entity,
        public diameter: number,
        public color: FillSource,
        public zIndex: number = 0,
        public offset: Vector = Vector.zero(),
    ) {}
}
