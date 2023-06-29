export class Vector {
    static new(x: number, y: number): Vector {
        return new Vector(x, y);
    }

    static zero() {
       return this.new(0, 0);
    }

    static dot(v1: Vector, v2: Vector) {
        return v1.x * v2.x + v1.y * v2.y;
    }

    static cross(v1: Vector, v2: Vector) {
        return v1.x * v2.y - v1.y * v2.x;
    }

    constructor(public x: number, public y: number) { }

    clone() {
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
}
