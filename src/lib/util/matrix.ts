import { Vector } from "./vector";

export class Matrix {
    static new(iHat: Vector, jHat: Vector): Matrix;
    static new(x: number, y: number, z: number, w: number): Matrix;
    static new(a: Vector | number, b: Vector | number, c?: number, d?: number) {
        if (a instanceof Vector && b instanceof Vector) {
            return new this(a, b);
        } else if (typeof a == 'number' && typeof b == 'number') {
            return new this(a, b, c!, d!);
        } else {
            throw new Error(
                `Matrix recieved invalid arguments! ${a} ${b} ${c} ${d}`
            );
        }
    }

    static identity() {
        return this.new(1, 0, 0, 1);
    }

    x1: number;
    y1: number;
    x2: number;
    y2: number;

    get iHat() {
        return Vector.new(this.x1, this.y1);
    }

    get jHat() {
        return Vector.new(this.x2, this.y2);
    }
    
    private constructor(iHat: Vector, jHat: Vector);
    private constructor(x: number, y: number, z: number, w: number);
    private constructor(a: Vector | number, b: Vector | number, c?: number, d?: number) {
        if (a instanceof Vector && b instanceof Vector) {
            this.x1 = a.x;
            this.y1 = a.y;
            this.x2 = b.x;
            this.y2 = b.y;
        } else if (typeof a == 'number' && typeof b == 'number') {
            this.x1 = a;
            this.y1 = b;
            this.x2 = c!;
            this.y2 = d!;
        } else {
            throw new Error(
                `Matrix recieved invalid arguments! ${a} ${b} ${c} ${d}`
            );
        }
    }

    toTuple(): [number, number, number, number] {
        return [this.x1, this.y1, this.x2, this.y2];
    }
}