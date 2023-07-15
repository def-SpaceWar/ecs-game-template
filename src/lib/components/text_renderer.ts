import { Entity } from "../ecs";
import { Drawable } from "../systems/render_system";
import { Color } from "../util/color";
import { Vector } from "../util/vector";

export type TextOptions = {
    direction: CanvasDirection;
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;
};

export class TextRenderer implements Drawable {
    constructor(
        public entity: Entity,
        public text: string,
        public font: string,
        public fontSize: number,
        public color: Color,
        public zIndex: number = 0,
        public offset: Vector = Vector.zero(),
        public rotation: number = 0,
        public scale: Vector = Vector.one(),
        public textOptions: TextOptions = {
            direction: "ltr",
            textAlign: "center",
            textBaseline: "middle"
        }
    ) { }
}
