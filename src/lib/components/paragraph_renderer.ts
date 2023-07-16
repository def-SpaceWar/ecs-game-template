import { Entity } from "../ecs";
import { Drawable, FillSource } from "../systems/render_system";
import { Vector } from "../util/vector";
import { TextOptions } from "./text_renderer";

export class ParagraphRenderer implements Drawable {
    constructor(
        public entity: Entity,
        public text: string[],
        public font: string,
        public fontSize: number,
        public color: FillSource,
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
