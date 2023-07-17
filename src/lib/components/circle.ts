import { Entity } from "../ecs";
import { ColoredDrawable, FillSource } from "../systems/render_system";
import { Color } from "../util/color";
import { Vector } from "../util/vector";

export class Circle implements ColoredDrawable {
    rotation: number = 0;

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
