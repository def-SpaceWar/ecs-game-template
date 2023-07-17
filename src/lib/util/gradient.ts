import { FillSource, ctx } from "../systems/render_system";
import { Color } from "./color";
import { Vector } from "./vector";

export class Gradient implements FillSource {
    static new(
        start: Vector,
        end: Vector,
        colorStops: [number, Color][]
    ) {
        return new this(start, end, colorStops);
    }

    gradient?: CanvasGradient;

    constructor(
        public start: Vector,
        public end: Vector,
        public colorStops: [number, Color][]
    ) {
    }

    init() {
        this.gradient = ctx.createLinearGradient(
            ...this.start.toTuple(),
            ...this.end.toTuple()
        );
        for (const colorStop of this.colorStops) {
            this.gradient.addColorStop(
                colorStop[0],
                colorStop[1].toFillStyle()
            );
        }
    }

    toFillStyle(): CanvasGradient {
        if (!this.gradient) {
            this.init();
        }
        return this.gradient!;
    }
}
