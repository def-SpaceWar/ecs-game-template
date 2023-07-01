import { Velocity } from "../components/velocity";
import { Component, Entity, World } from "../ecs";
import { Input } from "../util/input";
import { Time } from "../util/time";

export class MyTestBehavior implements Component {
    constructor(
        public entity: Entity,
        public speed: number
    ) { }
}

export function myTestBehaviorSystem(world: World) {
    const entities = world.requireEntitiesAllOf([
        MyTestBehavior,
        Velocity
    ]);

    for (const e of entities) {
        const behavior = world.getComponent(MyTestBehavior, e)!;
        const velocity = world.getComponent(Velocity, e)!;

        if (Input.getKey("a")) velocity.vel.x -= behavior.speed * Time.deltaTime;
        if (Input.getKey("e") || Input.getKey("d")) velocity.vel.x += behavior.speed * Time.deltaTime;
        if (Input.getKey(",") || Input.getKey("w")) velocity.vel.y -= behavior.speed * Time.deltaTime;
        if (Input.getKey("o") || Input.getKey("s")) velocity.vel.y += behavior.speed * Time.deltaTime;
    }
}
