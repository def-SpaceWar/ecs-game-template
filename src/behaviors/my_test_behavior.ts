import { Position } from "../components/position";
import { Rotation } from "../components/rotation";
import { Velocity } from "../components/velocity";
import { Component, Entity, World } from "../ecs";
import { HEIGHT, WIDTH } from "../parameters";
import { Input } from "../util/input";
import { Time } from "../util/time";

export class MyTestBehavior implements Component {
    constructor(
        public entity: Entity,
        public speed: number,
        public rotationSpeed: number
    ) { }
}

export function myTestBehaviorSystem(world: World) {
    const entities = world.requireEntitiesAllOf([
        MyTestBehavior,
        Position,
        Velocity,
        Rotation
    ]);

    for (const e of entities) {
        const behavior = world.getComponent(MyTestBehavior, e)!;
        const position = world.getComponent(Position, e)!;
        const velocity = world.getComponent(Velocity, e)!;
        const rotation = world.getComponent(Rotation, e)!;

        if (position.pos.y > HEIGHT + 50) {
            position.pos.y -= HEIGHT + 50;
        }

        if (position.pos.y < -50) {
            position.pos.y += HEIGHT + 50;
        }

        if (position.pos.x > WIDTH + 50) {
            position.pos.x -= WIDTH + 50;
        }

        if (position.pos.x < -50) {
            position.pos.x += WIDTH + 50;
        }

        if (Input.getKey("a")) velocity.vel.x -= behavior.speed * Time.deltaTime;
        if (Input.getKey("e") || Input.getKey("d")) velocity.vel.x += behavior.speed * Time.deltaTime;

        rotation.angle += behavior.rotationSpeed * Time.deltaTime;
    }
}
