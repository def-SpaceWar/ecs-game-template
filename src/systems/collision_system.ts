import { CircleCollider } from "../components/circle_collider";
import { Position } from "../components/position";
import { RectangleCollider } from "../components/rectangle_collider";
import { Rotation } from "../components/rotation";
import { Component, World } from "../ecs";
import { Collision, CollisionInfo, Polygon } from "../util/collision";

export interface Collider extends Component {
    getPolygon: () => Polygon;
}

export type ColliderInfo = [
    collider: Collider,
    position?: Position,
    rotation?: Rotation
];

export function collisionSystem(world: World) {
    Collision.resetCollisions();

    const colliders = world.findComponentsOfTypes<Collider>([
        RectangleCollider,
        CircleCollider
    ]);

    for (let i = 0; i < colliders.length; i++) {
        const position1 = world.getComponent(Position, colliders[i].entity);
        const rotation1 = world.getComponent(Rotation, colliders[i].entity);
        const collider1 = colliders[i];
        const polygon1 = collider1.getPolygon();

        if (rotation1) polygon1.rotate(rotation1.angle);
        if (position1) polygon1.translate(position1.pos);

        for (let j = i + 1; j < colliders.length; j++) {
            const position2 = world.getComponent(Position, colliders[j].entity);
            const rotation2 = world.getComponent(Rotation, colliders[j].entity);
            const collider2 = colliders[j];
            const polygon2 = collider2.getPolygon();

            if (rotation2) polygon2.rotate(rotation2.angle);
            if (position2) polygon2.translate(position2.pos);

            const collisionInfo = Collision.collisionInfo(polygon1, polygon2);
            if (!collisionInfo) return;

            if (!(position1 || position2)) continue;
            const colliderInfo1: ColliderInfo = [collider1, position1, rotation1];
            const colliderInfo2: ColliderInfo = [collider2, position2, rotation2];
            separatePolygons(colliderInfo1, colliderInfo2, collisionInfo);
            resolveCollision(colliderInfo1, colliderInfo2, collisionInfo);
            Collision.addCollision([
                collider1.entity,
                collider2.entity, 
                collisionInfo
            ]);
        }
    }
}

function separatePolygons(c1: ColliderInfo, c2: ColliderInfo, collisionInfo: CollisionInfo) {
    c1;
    c2;
    collisionInfo;
}

function resolveCollision(c1: ColliderInfo, c2: ColliderInfo, collisionInfo: CollisionInfo) {
    c1;
    c2;
    collisionInfo;
}
