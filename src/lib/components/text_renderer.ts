import { Entity } from "../ecs";
import { ColoredDrawable, FillSource, TextOptions } from "../systems/render_system";
import { Color } from "../util/color";
import { Matrix } from "../util/matrix";
import { Vector } from "../util/vector";

/**
 * @description Adds single-lined text to an entity.
 */
export class TextRenderer implements ColoredDrawable {
    /**
     * @param entity Provided by an entity wrapper.
     * @param text The text to render.
     * @param font The font of the text.
     * @param fontSize The size of the font.
     * @param color The output color/fillStyle of the drawable.
     * @param zIndex The z-index a drawable is rendered at.
     * @param offset The positional offset a drawable is rendered at.
     * @param rotation The rotational offset a drawable is rendered at.
     * @param scale The scale/transformation to render the text at.
     * @param textOptions The alignment options to render the text at.
     * @param strokeColor The output strokeColor/strokeStyle of the drawable.
     * @param lineWidth The lineWidth of the strokes of a drawable.
     */
    constructor(
        public entity: Entity,
        public text: string,
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
