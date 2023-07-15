import { AnimationController } from "../lib/components/animation_controller";
import { Position } from "../lib/components/position";
import { Component, Entity, World } from "../lib/ecs";
import { AnimationManager } from "../lib/util/animation";
import { Vector } from "../lib/util/vector";

export class MovingPlatform implements Component {
    axis: Vector;
    minProjection: number;
    maxProjection: number;

    constructor(
        public entity: Entity,
        public minPos: Vector,
        public maxPos: Vector
    ) {
        this.axis = maxPos.clone()
            .subtract(minPos)
            .normalize();

        this.minProjection = Vector.dot(this.axis, this.minPos);
        this.maxProjection = Vector.dot(this.axis, this.maxPos);
    }
}

export function movingPlatformSystem(world: World) {
    for (const movingPlatform of world.findComponents(MovingPlatform)) {
        const position = world.getComponent(Position, movingPlatform.entity)!;
        const projection = Vector.dot(position.pos, movingPlatform.axis);
        if (projection < movingPlatform.minProjection) {
            position.pos = movingPlatform.minPos.clone()
                .add(movingPlatform.axis);
            const animationController = world.getComponent(AnimationController, movingPlatform.entity)!;
            if (animationController.currentAnimation != "move1") {
                AnimationManager.setAnimation(
                    animationController,
                    "move1"
                );
            }
        } else if (projection > movingPlatform.maxProjection) {
            position.pos = movingPlatform.maxPos.clone()
                .subtract(movingPlatform.axis);
            const animationController = world.getComponent(AnimationController, movingPlatform.entity)!;
            if (animationController.currentAnimation != "move2") {
                AnimationManager.setAnimation(
                    animationController,
                    "move2"
                );
            }
        }
    }
}
