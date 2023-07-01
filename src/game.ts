import { MyTestBehavior, myTestBehaviorSystem } from "./behaviors/my_test_behavior";
import { WrapAroundScreen, wrapAroundScreenSystem } from "./behaviors/wrap_around_screen";
import { Acceleration } from "./components/acceleration";
import { AngularVelocity } from "./components/angular_velocity";
import { Circle } from "./components/circle";
import { CircleCollider } from "./components/circle_collider";
import { Mass } from "./components/mass";
import { Position } from "./components/position";
import { Rectangle } from "./components/rectangle";
import { RectangleCollider } from "./components/rectangle_collider";
import { Restitution } from "./components/restitution";
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
            collisionSystem,
            forcesSystem,
            myTestBehaviorSystem,
        ];

        this.renderSystems = [
            wrapAroundScreenSystem
        ];

        this.createEntity()
            .add(
                Position,
                Vector.new(300, 100)
            )
            .add(
                Rectangle,
                Vector.new(100, 100),
                Color.new(0, 0, 255),
                0
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
            .add(Velocity)
            .add(Mass)
            .add(Acceleration, Vector.new(0, 400))
            .add(Rotation)
            .add(AngularVelocity, 6)
            .add(MyTestBehavior, 1_000)
            .add(WrapAroundScreen);

        this.createEntity()
            .add(
                Position,
                Vector.new(300, 600)
            )
            .add(
                Rectangle,
                Vector.new(300, 300),
                Color.new(0, 255, 0)
            )
            .add(Restitution, 0)
            .add(
                RectangleCollider,
                Vector.new(300, 300)
            );

        this.createEntity()
            .add(
                Position,
                Vector.new(600, 600)
            )
            .add(
                Circle,
                150,
                Color.new(0, 255, 0)
            )
            .add(Restitution, 0)
            .add(
                CircleCollider,
                150
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
