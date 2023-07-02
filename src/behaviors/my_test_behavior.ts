import { Position } from "../components/position";
import { Tag } from "../components/tag";
import { Velocity } from "../components/velocity";
import { Component, Entity, World } from "../ecs";
import { Collision } from "../util/collision";
import { Input } from "../util/input";
import { Time } from "../util/time";

export class MyTestBehavior implements Component {
    canJump = false;

    constructor(
        public entity: Entity,
        public speed: number = 1_000,
        public jumpPower = 500
    ) { }
}

export function myTestBehaviorSystem(world: World) {
    const entities = world.requireEntitiesAllOf([
        MyTestBehavior,
        Velocity,
        Position
    ]);

    for (const e of entities) {
        const behavior = world.getComponent(MyTestBehavior, e)!;
        const velocity = world.getComponent(Velocity, e)!;
        const position = world.getComponent(Position, e)!;

        if (Input.getKey("a")) velocity.vel.x -= behavior.speed * Time.deltaTime;
        if (Input.getKey("e") || Input.getKey("d")) velocity.vel.x += behavior.speed * Time.deltaTime;
        if ((Input.getKey(",") || Input.getKey("w")) && behavior.canJump) {
            velocity.vel.y = -behavior.jumpPower;
        }

        behavior.canJump = false;
        wholeLoop: for (const collision of Collision.getCollisionEvents(e)) {
            for (const tag of world.getComponents(Tag, collision[1])) {
                if (tag.tag == "platform" && position.pos.y < collision[3].y) {
                    behavior.canJump = true;
                    continue wholeLoop;
                }
            }
        }
    }
}
