import { AngularVelocity } from "../components/angular_velocity";
import { CircleCollider } from "../components/circle_collider";
import { Mass } from "../components/mass";
import { Position } from "../components/position";
import { RectangleCollider } from "../components/rectangle_collider";
import { Restitution } from "../components/restitution";
import { Rotation } from "../components/rotation";
import { Velocity } from "../components/velocity";
import { Component, World, isComponent } from "../ecs";
import { Collision, CollisionInfo, Polygon } from "../util/collision";
import { Vector } from "../util/vector";

export interface Collider extends Component {
    offset: Vector,
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

            const collisionInfo = Collision.collisionInfo(
                polygon1,
                polygon2
            );
            if (!collisionInfo) continue;

            if (!(position1 || position2)) continue;
            const colliderInfo1: ColliderInfo = [collider1, position1, rotation1];
            const colliderInfo2: ColliderInfo = [collider2, position2, rotation2];

            separatePolygons(colliderInfo1, colliderInfo2, collisionInfo, world);

            let collisionPoint: Vector;
            if (isComponent(collider1, CircleCollider)) {
                collisionPoint = polygon1.center.clone().add(collisionInfo[0].clone().scale(-collider1.diameter / 2));
            } else if (isComponent(collider2, CircleCollider)) {
                collisionPoint = polygon2.center.clone().add(collisionInfo[0].clone().scale(collider2.diameter / 2));
            } else {
                collisionPoint = Collision.findContactPoint(polygon1, polygon2);
            }

            resolveCollision(colliderInfo1, colliderInfo2, collisionInfo, collisionPoint, world);

            Collision.addCollision([
                collider1.entity,
                collider2.entity,
                collisionInfo,
                collisionPoint
            ]);
        }
    }
}

function separatePolygons(
    [_1, position1, __1]: ColliderInfo,
    [_2, position2, __2]: ColliderInfo,
    [normal, depth]: CollisionInfo,
    world: World
) {
    if (!position2) {
        position1!.pos.add(normal.clone().scale(depth));
        return;
    }

    if (!position1) {
        position2!.pos.add(normal.clone().scale(-depth));
        return;
    }

    const mass1 = world.getComponent(Mass, position1.entity);
    const mass2 = world.getComponent(Mass, position2.entity);

    let weight1 = 1 / (mass1?.mass || Infinity);
    let weight2 = 1 / (mass2?.mass || Infinity);

    const rescale = 1 / (weight1 + weight2)
    weight1 *= rescale;
    weight2 *= rescale;

    position1!.pos.add(normal.clone().scale(depth * weight1));
    position2!.pos.add(normal.clone().scale(-depth * weight2));
}

function resolveCollision(
    [collider1, position1, __1]: ColliderInfo,
    [collider2, position2, __2]: ColliderInfo,
    [normal, _]: CollisionInfo,
    collisionPoint: Vector,
    world: World
) {
    const velocity1 = world.getComponent(Velocity, collider1.entity);
    const velocity2 = world.getComponent(Velocity, collider2.entity);
    const angularVelocity1 = world.getComponent(AngularVelocity, collider1.entity);
    const angularVelocity2 = world.getComponent(AngularVelocity, collider2.entity);
    if (!velocity1 && !velocity2 && !angularVelocity1 && !angularVelocity2) return;
    const mass1 = world.getComponent(Mass, collider1.entity)?.mass || Infinity;
    const mass2 = world.getComponent(Mass, collider2.entity)?.mass || Infinity;
    const restitution1 = world.getComponent(Restitution, collider1.entity);
    const restitution2 = world.getComponent(Restitution, collider2.entity);

    const elasticity = Math.min(
        restitution1 ? restitution1.elasticity : 1,
        restitution2 ? restitution2.elasticity : 1,
    );
    const relativeVelocity = (velocity1?.vel.clone() || Vector.zero()).subtract(velocity2?.vel || Vector.zero());

    const jointMasses = 1 / mass1 + 1 / mass2;

    const collisionArm1 = collisionPoint.clone().subtract(collider1.offset.clone().add(position1?.pos || Vector.zero()));
    const collisionArm2 = collisionPoint.clone().subtract(collider2.offset.clone().add(position2?.pos || Vector.zero()));
    const inertia1 = (mass1 == Infinity)
        ? Infinity
        : collider1.getPolygon()
            .translate(collider1.offset)
            .inertia(mass1);
    const inertia2 = (mass2 == Infinity)
        ? Infinity
        : collider2.getPolygon()
            .translate(collider2.offset)
            .inertia(mass2);

    const angularVelocityVec1 = collisionArm1
        .clone()
        .normal()
        .scale(angularVelocity1?.vel || 0);
    const angularVelocityVec2 = collisionArm2
        .clone()
        .normal()
        .scale(angularVelocity2?.vel || 0);
    const relativeAngularVelocityVec = angularVelocityVec1.subtract(angularVelocityVec2);

    const normalCrossedArm1 = Vector.cross(normal, collisionArm1);
    const normalCrossedArm2 = Vector.cross(normal, collisionArm2);
    const jointAngularVelocities =
        (
            normalCrossedArm1 * normalCrossedArm1 / inertia1
        ) + (
            normalCrossedArm2 * normalCrossedArm2 / inertia2
        );

    const j = -(1 + elasticity) *
        Vector.dot(relativeVelocity.add(relativeAngularVelocityVec), normal) /
        (jointMasses + jointAngularVelocities);

    if (velocity1) velocity1.vel.add(normal.clone().scale(j / mass1));
    if (velocity2) velocity2.vel.add(normal.clone().scale(-j / mass2));
    if (angularVelocity1) angularVelocity1.vel += Vector.cross(collisionArm1, normal.clone().scale(j)) / inertia1;
    if (angularVelocity2) angularVelocity2.vel -= Vector.cross(collisionArm2, normal.clone().scale(j)) / inertia2;
}
