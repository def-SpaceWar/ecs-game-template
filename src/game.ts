import { MyTestBehavior, myTestBehaviorSystem } from "./behaviors/my_test_behavior";
import { Acceleration } from "./components/acceleration";
import { Circle } from "./components/circle";
import { CircleCollider } from "./components/circle_collider";
import { Position } from "./components/position";
import { Rectangle } from "./components/rectangle";
import { RectangleCollider } from "./components/rectangle_collider";
import { Rotation } from "./components/rotation";
import { Velocity } from "./components/velocity";
import { World } from "./ecs";
import { HEIGHT, WIDTH } from "./parameters";
import { collisionSystem } from "./systems/collision_system";
import { forcesSystem } from "./systems/forces_system";
import { Color } from "./util/color";
import { Vector } from "./util/vector";

export class Game extends World {
    setup(): void {
        this.systems = [
            forcesSystem,
            collisionSystem,
            myTestBehaviorSystem
        ];

        this.createEntity()
            .add(
                Position,
                Vector.new(100, 100)
            )
            .add(
                Circle,
                100,
                Color.new(255, 0, 0),
                -1
            )
            .add(
                CircleCollider,
                100
            )
            .add(Velocity, Vector.new(-100, 0))
            .add(Acceleration)
            .add(Rotation)
            .add(MyTestBehavior, 1_000, 5);

        this.createEntity()
            .add(
                Position,
                Vector.new(300, 200)
            )
            .add(
                Rectangle,
                Vector.new(300, 300),
                Color.new(0, 255, 0)
            )
            .add(
                RectangleCollider,
                Vector.new(300, 300)
            );

        this.createEntity()
            .add(
                Position,
                Vector.new(WIDTH / 2, HEIGHT / 2)
            )
            .add(
                Rectangle,
                Vector.new(WIDTH, HEIGHT),
                Color.new(0, 175, 255),
                5
            );
    }
}
