import { Entity } from "../ecs";
import { Vector } from "./vector";

export class Line {
    constructor(public p1: Vector, public p2: Vector) { }

    toAxis(): Vector {
        return this.p2.clone().subtract(this.p1);
    }
}

export class Polygon {
    center = Vector.zero();

    constructor(public points: Vector[], public isCircle = false, public radius = 0) { }

    rotate(angle: number) {
        this.center.rotate(angle);

        if (this.isCircle) return this;

        for (const point of this.points) {
            point.rotate(angle);
        }

        return this;
    }

    translate(translation: Vector) {
        for (const point of this.points) {
            point.add(translation);
        }

        this.center.add(translation);

        return this;
    }

    getLines(): Line[] {
        const lines: Line[] = [];
        if (this.isCircle) return lines;

        for (let i = 0; i < this.points.length; i++) {
            const p1 = this.points[i].clone();
            const p2 = this.points[(i + 1) % this.points.length].clone();

            lines.push(new Line(p1, p2));
        }

        return lines;
    }

    getAxes(): Vector[] {
        const axes: Vector[] = [];

        for (const line of this.getLines()) {
            axes.push(line.toAxis().normalize());
        }

        return axes;
    }

    getCircleAxis(other: Polygon): Vector {
        return other.center.clone().subtract(this.center).normalize();
    }

    project(axis: Vector): [min: number, max: number] {
        if (this.isCircle) {
            const projection = Vector.dot(this.center, axis);
            return [projection - this.radius, projection + this.radius]
        }

        let min = Infinity;
        let max = -Infinity;

        for (const point of this.points) {
            const result = Vector.dot(point, axis);
            min = Math.min(result, min);
            max = Math.max(result, max);
        }

        return [min, max];
    }

    inertia(mass: number): number {
        if (this.isCircle) return 0.25 * mass * this.radius ** 2;
        const N = this.points.length;

        let numerator = 0;
        let denominator = 0;
        for (let n = 1; n <= N; n++) {
            numerator += Vector.cross(this.points[(n + 1) % N], this.points[n % N]) * (
                Vector.dot(this.points[n % N], this.points[n % N]) +
                Vector.dot(this.points[n % N], this.points[(n + 1) % N]) +
                Vector.dot(this.points[(n + 1) % N], this.points[(n + 1) % N])
            );

            denominator += 6 * Vector.cross(this.points[(n + 1) % N], this.points[n % N]);
        }

        return mass * numerator / denominator;
    }
}

export type CollisionInfo = [
    normal: Vector,
    depth: number
];

const reverseCollisionInfo = ([
    normal,
    depth
]: CollisionInfo): CollisionInfo =>
    [
        normal.clone()
            .scale(-1),
        depth
    ];

export type CollisionEvent = [
    e1: Entity,
    e2: Entity,
    info: CollisionInfo,
    pointOfCollision: Vector
];

export namespace Collision {
    export function collisionInfo(
        p1: Polygon,
        p2: Polygon
    ): CollisionInfo | undefined {
        let normal = Vector.zero();
        let overlap = Infinity;

        if (!p1.isCircle) {
            for (const axis of p1.getAxes()) {
                const [min1, max1] = p1.project(axis);
                const [min2, max2] = p2.project(axis);

                if (min1 > max2) return undefined;
                if (min2 > max1) return undefined;

                const signedOverlap = Math.min(max2 - min1, min2 - max1);
                let o = Math.abs(signedOverlap);

                if (min1 > min2 && max1 < max2) {
                    const mins = Math.abs(min1 - min2);
                    const maxs = Math.abs(max1 - max2);

                    if (mins < maxs) {
                        o += mins;
                    } else {
                        o += maxs;
                    }
                }

                if (o < overlap) {

                    normal = axis.scale(Math.sign(signedOverlap));
                    overlap = o;
                }
            }
        } else {
            const axis = p1.getCircleAxis(p2);
            const [min1, max1] = p1.project(axis);
            const [min2, max2] = p2.project(axis);

            if (min1 > max2) return undefined;
            if (min2 > max1) return undefined;

            const signedOverlap = Math.min(max2 - min1, min2 - max1);
            let o = Math.abs(signedOverlap);

            if (min1 > min2 && max1 < max2) {
                const mins = Math.abs(min1 - min2);
                const maxs = Math.abs(max1 - max2);

                if (mins < maxs) {
                    o += mins;
                } else {
                    o += maxs;
                }
            }

            if (o < overlap) {
                normal = axis.scale(Math.sign(signedOverlap));
                overlap = o;
            }
        }

        if (!p2.isCircle) {
            for (const axis of p2.getAxes()) {
                const [min1, max1] = p1.project(axis);
                const [min2, max2] = p2.project(axis);

                if (min1 > max2) return undefined;
                if (min2 > max1) return undefined;

                const signedOverlap = Math.min(max2 - min1, min2 - max1);
                let o = Math.abs(signedOverlap);

                if (min1 > min2 && max1 < max2) {
                    const mins = Math.abs(min1 - min2);
                    const maxs = Math.abs(max1 - max2);

                    if (mins < maxs) {
                        o += mins;
                    } else {
                        o += maxs;
                    }
                }

                if (o > overlap) continue;

                normal = axis.scale(Math.sign(signedOverlap));
                overlap = o;
            }
        } else {
            const axis = p2.getCircleAxis(p1);
            const [min1, max1] = p1.project(axis);
            const [min2, max2] = p2.project(axis);

            if (min1 > max2) return undefined;
            if (min2 > max1) return undefined;

            const signedOverlap = Math.min(max2 - min1, min2 - max1);
            let o = Math.abs(signedOverlap);

            if (min1 > min2 && max1 < max2) {
                const mins = Math.abs(min1 - min2);
                const maxs = Math.abs(max1 - max2);

                if (mins < maxs) {
                    o += mins;
                } else {
                    o += maxs;
                }
            }

            if (o < overlap) {
                normal = axis.scale(Math.sign(signedOverlap));
                overlap = o;
            }
        }

        return [
            normal,
            overlap
        ];
    }

    export function signedDistanceOfPointFromLine(point: Vector, line: Line) {
        let numerator =
            (line.p2.x - line.p1.x) * (line.p1.y - point.y) -
            (line.p1.x - point.x) * (line.p2.y - line.p1.y);

        const denominator = line.toAxis().magnitude;

        return numerator / denominator;
    }

    export function findContactPoint(
        p1: Polygon,
        p2: Polygon
    ) {
        let contactPoints: Vector[] = [];

        let minDistance = Infinity;

        for (const point of p1.points) {
            for (const line of p2.getLines()) {
                const signedDistance = signedDistanceOfPointFromLine(point, line);
                const closestPoint = point.clone()
                    .add(line.toAxis()
                        .normal()
                        .normalize()
                        .scale(signedDistance));

                const distance = Math.abs(signedDistance);

                if (Math.abs(minDistance - distance) < 0.01) {
                    contactPoints.push(closestPoint);
                } else if (distance < minDistance) {
                    contactPoints = [];
                    contactPoints.push(closestPoint);
                    minDistance = distance;
                }
            }
        }

        for (const point of p2.points) {
            for (const line of p1.getLines()) {
                const signedDistance = signedDistanceOfPointFromLine(point, line);
                const closestPoint = point.clone()
                    .add(line.toAxis()
                        .normal()
                        .normalize()
                        .scale(signedDistance));

                const distance = Math.abs(signedDistance);

                if (Math.abs(distance - minDistance) < 0.01) {
                    contactPoints.push(closestPoint);
                } else if (distance < minDistance) {
                    contactPoints = [];
                    contactPoints.push(closestPoint);
                    minDistance = distance;
                }
            }
        }

        const sum = Vector.zero();
        for (const point of contactPoints) sum.add(point);
        return sum.scale(1 / contactPoints.length);
    }

    let collisionEvents: CollisionEvent[] = [];
    export function* getCollisionEvents(e: Entity) {
        for (const event of collisionEvents) {
            if (event[0] != e) continue;
            yield event;
        }
    }

    export function resetCollisions() {
        collisionEvents = [];
    }

    export function addCollision([e1, e2, info, point]: CollisionEvent) {
        collisionEvents.push([e1, e2, info, point]);
        collisionEvents.push([e2, e1, reverseCollisionInfo(info), point]);
    }
}
