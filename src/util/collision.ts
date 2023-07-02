import { Entity } from "../ecs";
import { CIRCLE_POINTS } from "../parameters";
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

    *getAxes()  {
        for (const line of this.getLines()) {
            yield line.toAxis().normalize();
        }
    }

    getCircleAxis(other: Polygon): Vector {
        if (other.isCircle) {
            return other.center.clone().subtract(this.center).normalize();
        }

        let otherPoint = Vector.undefined();
        let minDistance = Infinity;

        for (const line of other.getLines()) {
            const closestPoint = Collision.closestPointFromLine(this.center, line);
            const distance = closestPoint.clone()
                .subtract(this.center)
                .magnitudeSquared;

            if (distance < minDistance) {
                minDistance = distance;
                otherPoint = closestPoint;
            }
        }

        return otherPoint.subtract(this.center).normalize();
    }

    project(axis: Vector): [min: number, max: number] {
        if (this.isCircle) {
            return [
                Vector.dot(this.center.clone().add(axis.clone().scale(-this.radius)), axis),
                Vector.dot(this.center.clone().add(axis.clone().scale(this.radius)), axis)
            ];
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
        let points = this.points;

        if (this.isCircle) {
            for (let i = 0; i < CIRCLE_POINTS; i++) {
                const angle = i * 2 * Math.PI / CIRCLE_POINTS;
                points.push(
                    Vector.new(
                        Math.cos(angle) * this.radius,
                        Math.sin(angle) * this.radius
                    ).add(this.center)
                );
            }
        }

        const N = points.length;

        let numerator = 0;
        let denominator = 0;
        for (let n = 1; n <= N; n++) {
            numerator += Vector.cross(points[(n + 1) % N], points[n % N]) * (
                Vector.dot(points[n % N], points[n % N]) +
                Vector.dot(points[n % N], points[(n + 1) % N]) +
                Vector.dot(points[(n + 1) % N], points[(n + 1) % N])
            );

            denominator += 6 * Vector.cross(points[(n + 1) % N], points[n % N]);
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

export function minimumAbsoluteValue(a: number, b: number): number {
    if (Math.abs(a) < Math.abs(b)) {
        return a;
    }

    return b;
}

export namespace Collision {
    export function* collisionInfo(
        p1s: Polygon[],
        p2s: Polygon[]
    ): Generator<[CollisionInfo, [Polygon, Polygon]], void, unknown> {
        let normal = Vector.zero();
        let overlap = Infinity;
        let polygon1 = new Polygon([]);
        let polygon2 = new Polygon([]);

        for (const p1 of p1s) {
            p2Loop: for (const p2 of p2s) {
                if (!p1.isCircle) {
                    for (const axis of p1.getAxes()) {
                        const [min1, max1] = p1.project(axis);
                        const [min2, max2] = p2.project(axis);

                        if (min1 > max2) continue p2Loop;
                        if (min2 > max1) continue p2Loop;

                        const signedOverlap = minimumAbsoluteValue(max2 - min1, min2 - max1);
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

                    if (min1 > max2) continue p2Loop;
                    if (min2 > max1) continue p2Loop;

                    const signedOverlap = minimumAbsoluteValue(max2 - min1, min2 - max1);
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

                        if (min1 > max2) continue p2Loop;
                        if (min2 > max1) continue p2Loop;

                        const signedOverlap = minimumAbsoluteValue(max2 - min1, min2 - max1);
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
                    const axis = p2.getCircleAxis(p1);
                    const [min1, max1] = p1.project(axis);
                    const [min2, max2] = p2.project(axis);

                    if (min1 > max2) continue p2Loop;
                    if (min2 > max1) continue p2Loop;

                    const signedOverlap = minimumAbsoluteValue(max2 - min1, min2 - max1);
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

                polygon1 = p1;
                polygon2 = p2;
                areColliding = true;

                yield [
                    [
                        normal,
                        overlap
                    ],
                    [
                        polygon1,
                        polygon2
                    ]
                ];
            }
        }
    }

    export function signedDistanceOfPointFromLine(point: Vector, line: Line) {
        let numerator =
            (line.p2.x - line.p1.x) * (line.p1.y - point.y) -
            (line.p1.x - point.x) * (line.p2.y - line.p1.y);

        const denominator = line.toAxis().magnitude;

        return numerator / denominator;
    }

    export function closestPointFromLine(point: Vector, line: Line) {
        const axis = line.toAxis().normalize();
        const projP0 = Vector.dot(point, axis);
        const projP1 = Vector.dot(line.p1, axis);
        const projP2 = Vector.dot(line.p2, axis);

        if (projP0 < projP1) {
            return line.p1;
        }

        if (projP0 > projP2) {
            return line.p2;
        }

        const signedDistance = signedDistanceOfPointFromLine(point, line);
        return point.clone()
            .add(axis
                .normal()
                .scale(signedDistance));
    }

    export function findContactPoint(
        p1: Polygon,
        p2: Polygon
    ) {
        let contactPoints: Vector[] = [];

        let minDistance = Infinity;

        for (const point of p1.points) {
            for (const line of p2.getLines()) {
                const closestPoint = closestPointFromLine(point, line);
                const distance = closestPoint.clone()
                    .subtract(point)
                    .magnitudeSquared;

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
