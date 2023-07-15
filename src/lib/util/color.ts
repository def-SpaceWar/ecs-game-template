import { FillSource } from "../systems/render_system";

export class Color implements FillSource {
    static new(
        r: number,
        g: number,
        b: number,
        a = 1
    ): Color {
        return new this(r, g, b, a);
    }

    constructor(
        public r: number,
        public g: number,
        public b: number,
        public a = 1
    ) {}

    toFillStyle() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
}
