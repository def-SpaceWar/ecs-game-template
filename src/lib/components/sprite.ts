import { Entity } from "../ecs";
import { Drawable } from "../systems/render_system";
import { Vector } from "../util/vector";

export class Sprite implements Drawable {
    sx = 0;
    sy = 0;
    sw: number;
    sh: number;

    constructor(
        public entity: Entity,
        public dims: Vector,
        public image: HTMLImageElement,
        public zIndex: number = 0,
        public offset: Vector = Vector.zero(),
        public rotation: number = 0
    ) {
        this.sw = image.width;
        this.sh = image.height;
    }
}
