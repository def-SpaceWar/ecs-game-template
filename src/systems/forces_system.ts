import { Acceleration } from "../components/acceleration";
import { AngularVelocity } from "../components/angular_velocity";
import { Position } from "../components/position";
import { Rotation } from "../components/rotation";
import { SimpleDrag } from "../components/simple_drag";
import { Velocity } from "../components/velocity";
import { World } from "../ecs";
import { Time } from "../util/time";
import { Vector } from "../util/vector";

export function forcesSystem(world: World) {
    const movingEntities = world.requireEntitiesAllOf([
        Position,
        Velocity
    ]);

    for (const e of movingEntities) {
        const position = world.getComponent(Position, e)!;
        const velocity = world.getComponent(Velocity, e)!;

        const acceleration = world.getComponent(Acceleration, e);
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

        const simpleDrag = world.getComponent(SimpleDrag, e);
        if (simpleDrag) {
            velocity.vel.scale(Math.pow(simpleDrag.multiplier, Time.deltaTime));
        }
    }

    const rotatingEntities = world.requireEntitiesAllOf([
        Rotation,
        AngularVelocity
    ]);

    for (const e of rotatingEntities) {
        const rotation = world.getComponent(Rotation, e)!;
        const angularVelocity = world.getComponent(AngularVelocity, e)!;

        rotation.angle += angularVelocity.vel * Time.deltaTime;

        const simpleDrag = world.getComponent(SimpleDrag, e);
        if (simpleDrag) {
            angularVelocity.vel *= Math.exp(Time.deltaTime * Math.log(simpleDrag.multiplier));
        }
    }
}
