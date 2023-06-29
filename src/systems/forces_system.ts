import { Acceleration } from "../components/acceleration";
import { Position } from "../components/position";
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
}
