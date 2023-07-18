import { Position } from "../lib/components/position";
import { Tag } from "../lib/components/tag";
import { Velocity } from "../lib/components/velocity";
import { Component, Entity, World } from "../lib/ecs";
import { Collision } from "../lib/util/collision";
import { Input } from "../lib/util/input";
import { Time } from "../lib/util/time";

export class MyTestBehavior implements Component {
    canJump = false;

    constructor(
        public entity: Entity,
        public speed: number = 1_000,
        public jumpPower = 500
    ) { }
}

export function myTestBehaviorSystem(world: World) {
    for (const e of world.requireEntitiesAllOf(
        MyTestBehavior,
        Velocity,
        Position
    )) {
        const behavior = world.getComponent(e, MyTestBehavior)!;
        const velocity = world.getComponent(e, Velocity)!;
        const position = world.getComponent(e, Position)!;

        if (Input.getKey("a")) velocity.vel.x -= behavior.speed * Time.deltaTime;
        if (Input.getKey("e") || Input.getKey("d")) velocity.vel.x += behavior.speed * Time.deltaTime;
        if ((Input.getKey(",") || Input.getKey("w")) && behavior.canJump) {
            velocity.vel.y = -behavior.jumpPower;
        }

        behavior.canJump = false;
        wholeLoop: for (const collision of Collision.getCollisionEvents(e)) {
            for (const tag of world.getComponents(collision[1], Tag)) {
                if (tag.tag == "platform" && position.pos.y < collision[3].y) {
                    behavior.canJump = true;
                    continue wholeLoop;
                }
            }
        }
    }
}
