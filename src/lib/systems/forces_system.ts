import { Acceleration } from "../components/acceleration";
import { AngularVelocity } from "../components/angular_velocity";
import { Position } from "../components/position";
import { Rotation } from "../components/rotation";
import { SimpleDrag } from "../components/simple_drag";
import { Velocity } from "../components/velocity";
import { World } from "../ecs";
import { Time } from "../util/time";

export function forcesSystem(world: World) {
    for (const e of world.requireEntitiesAllOf(Position, Velocity)) {
        const position = world.getComponent(e, Position)!;
        const velocity = world.getComponent(e, Velocity)!;

        const acceleration = world.getComponent(e, Acceleration);
        if (acceleration) velocity.vel
            .add(
                acceleration.acc
                    .clone()
                    .scale(Time.deltaTime / 2)
            );

        position.pos.add(
            velocity.vel
                .clone()
                .scale(Time.deltaTime)
        );

        if (acceleration) velocity.vel
            .add(
                acceleration.acc
                    .clone()
                    .scale(Time.deltaTime / 2)
            );

        const simpleDrag = world.getComponent(e, SimpleDrag);
        if (simpleDrag) {
            velocity.vel.scale(Math.pow(simpleDrag.multiplier, Time.deltaTime));
        }
    }

    for (const e of world.requireEntitiesAllOf(Rotation, AngularVelocity)) {
        const rotation = world.getComponent(e, Rotation)!;
        const angularVelocity = world.getComponent(e, AngularVelocity)!;

        rotation.angle += angularVelocity.vel * Time.deltaTime;

        const simpleDrag = world.getComponent(e, SimpleDrag);
        if (simpleDrag) {
            angularVelocity.vel *= Math.pow(simpleDrag.multiplier, Time.deltaTime);
        }
    }
}
