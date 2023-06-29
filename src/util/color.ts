export class Color {
    static new(
        r: number,
        g: number,
        b: number,
        a = 1
    ): Color {
        return new Color(r, g, b, a);
    }

    constructor(
        public r: number,
        public g: number,
        public b: number,
        public a = 1
    ) {}

    toString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
}
