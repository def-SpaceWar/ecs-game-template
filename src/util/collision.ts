import { Entity } from "../ecs";
import { Vector } from "./vector";

export class Polygon {
    constructor(public points: Vector[]) { }

    rotate(angle: number) {
        for (const point of this.points) {
            point.rotate(angle);
        }
    }

    translate(translation: Vector) {
        for (const point of this.points) {
            point.add(translation);
        }
    }

    inertia(): number {
        return 1; // TODO
    }
}

export type CollisionInfo = [
    collisionPoint: Vector,
    normal: Vector,
    depth: number
];

function reverseCollisionInfo([
    collisionPoint,
    normal,
    depth
]: CollisionInfo): CollisionInfo {
    return [
        collisionPoint,
        normal.clone()
            .scale(-1),
        depth
    ];
}

export type CollisionEvent = [
    e1: Entity,
    e2: Entity,
    info: CollisionInfo
];

export namespace Collision {
    export function collisionInfo(
        p1: Polygon,
        p2: Polygon
    ): CollisionInfo | undefined {
        p1;
        p2;
        return undefined;
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

    export function addCollision([e1, e2, info]: CollisionEvent) {
        collisionEvents.push([e1, e2, info]);
        collisionEvents.push([e2, e1, reverseCollisionInfo(info)]);
    }
}
