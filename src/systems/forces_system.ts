import { Acceleration } from "../components/acceleration";
import { AngularVelocity } from "../components/angular_velocity";
import { Position } from "../components/position";
import { Rotation } from "../components/rotation";
import { Velocity } from "../components/velocity";
import { World } from "../ecs";
import { Time } from "../util/time";

export function forcesSystem(world: World) {
    const movingEntities = world.requireEntitiesAllOf([
        Position,
        Velocity
    ]);

    for (const e of movingEntities) {
        const position = world.getComponent(Position, e)!;
        const velocity = world.getComponent(Velocity, e)!;
        position.pos.add(
            velocity.vel
                .clone()
                .scale(Time.deltaTime)
        );

        const acceleration = world.getComponent(Acceleration, e);
        if (acceleration) velocity.vel
            .add(
                acceleration.acc
                    .clone()
                    .scale(Time.deltaTime)
            );
    }

    const rotatingEntities = world.requireEntitiesAllOf([
        Rotation,
        AngularVelocity
    ]);

    for (const e of rotatingEntities) {
        const rotation = world.getComponent(Rotation, e)!;
        const angularVelocity = world.getComponent(AngularVelocity, e)!;

        rotation.angle += angularVelocity.vel * Time.deltaTime;
    }
}
