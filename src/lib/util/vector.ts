export class Vector {
    static new(x: number, y: number): Vector {
        return new Vector(x, y);
    }

    static zero(): Vector {
        return this.new(0, 0);
    }

    static undefined(): Vector {
        return this.new(Infinity, Infinity);
    }

    static dot(v1: Vector, v2: Vector): number {
        return v1.x * v2.x + v1.y * v2.y;
    }

    static cross(v1: Vector, v2: Vector): number {
        return v1.x * v2.y - v1.y * v2.x;
    }

    static random(): Vector {
        return this.new(Math.random(), Math.random()).normalize();
    }

    constructor(public x: number, public y: number) { }

    get magnitudeSquared(): number {
        return this.x * this.x + this.y * this.y;
    }

    get magnitude(): number {
        return Math.sqrt(this.magnitudeSquared);
    }

    clone(): Vector {
        return Vector.new(this.x, this.y);
    }

    add(other: Vector) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    subtract(other: Vector) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    scale(scalar: number) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    rotate(angle: number) {
        [this.x, this.y] = [
            this.x * Math.cos(angle) - this.y * Math.sin(angle),
            this.y * Math.cos(angle) + this.x * Math.sin(angle)
        ];
        return this;
    }

    normalize() {
        if (this.magnitudeSquared == 0) return Vector.random();
        return this.scale(1 / this.magnitude);
    }

    normal() {
        [this.x, this.y] = [-this.y, this.x];
        return this;
    }

    nearZero() {
        return this.magnitudeSquared < 0.0001;
    }

    tuple(): [number, number] {
        return [this.x, this.y];
    }
}
