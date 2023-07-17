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

    static black() {
        return this.new(0, 0, 0);
    }

    static red() {
        return this.new(255, 0, 0);
    }

    static yellow() {
        return this.new(255, 255, 0);
    }

    static green() {
        return this.new(0, 255, 0);
    }

    static cyan() {
        return this.new(0, 255, 255);
    }

    static blue() {
        return this.new(0, 0, 255);
    }

    static magenta() {
        return this.new(255, 0, 255);
    }

    static white() {
        return this.new(255, 255, 255);
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
