import { Entity } from "../ecs";
import { ColoredDrawable, FillSource } from "../systems/render_system";
import { Color } from "../util/color";
import { Matrix } from "../util/matrix";
import { Vector } from "../util/vector";
import { TextOptions } from "./text_renderer";

export class ParagraphRenderer implements ColoredDrawable {
    constructor(
        public entity: Entity,
        public text: string[],
        public font: string,
        public fontSize: number,
        public color: FillSource,
        public zIndex: number = 0,
        public offset: Vector = Vector.zero(),
        public rotation: number = 0,
        public scale: Vector | Matrix = Matrix.identity(),
        public textOptions: TextOptions = {
            direction: "ltr",
            textAlign: "center",
            textBaseline: "middle"
        },
        public strokeColor: FillSource = Color.black(),
        public lineWidth: number = 1
    ) { }
}
