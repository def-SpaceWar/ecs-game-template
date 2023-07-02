import { MyTestBehavior, myTestBehaviorSystem } from "./behaviors/my_test_behavior";
import { WrapAroundScreen, wrapAroundScreenSystem } from "./behaviors/wrap_around_screen";
import { Acceleration } from "./components/acceleration";
import { AngularVelocity } from "./components/angular_velocity";
import { Circle } from "./components/circle";
import { CircleCollider } from "./components/circle_collider";
import { ComplexCollider } from "./components/complex_collider";
import { Friction } from "./components/friction";
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
                Vector.new(50, 10),
                Color.new(0, 0, 0),
                -2,
                Vector.new(25, 0)
            )

            // Circle Player
            .add(
                Circle,
                100,
                Color.new(255, 0, 0)
            )
            .add(
                CircleCollider,
                100
            )

            // Square Player
            //.add(
            //    Rectangle,
            //    Vector.new(100, 100),
            //    Color.new(255, 0, 0)
            //)
            //.add(
            //    RectangleCollider,
            //    Vector.new(100, 100)
            //)

            // Capsule Player
            //.add(
            //    Rectangle,
            //    Vector.new(100, 100),
            //    Color.new(0, 0, 255),
            //    -1
            //)
            //.add(
            //    Circle,
            //    100,
            //    Color.new(255, 0, 0),
            //    0,
            //    Vector.new(0, 50)
            //)
            //.add(
            //    Circle,
            //    100,
            //    Color.new(255, 0, 0),
            //    0,
            //    Vector.new(0, -50)
            //)
            //.add(
            //    ComplexCollider,
            //    [
            //        ['rect', 0.5, Vector.new(100, 100), Vector.zero(), 0],
            //        ['circle', 0.25, 99, Vector.new(0, 50)],
            //        ['circle', 0.25, 99, Vector.new(0, -50)]
            //    ]
            //)

            .add(Velocity)
            .add(Mass)
            .add(Acceleration, Vector.new(0, 400))
            .add(Rotation)
            .add(AngularVelocity)
            .add(Restitution, 0)
            .add(Friction)
            .add(MyTestBehavior)
            .add(WrapAroundScreen);

        this.createEntity()
            .add(
                Position,
                Vector.new(200, 600)
            )
            .add(
                Rectangle,
                Vector.new(300, 300),
                Color.new(0, 255, 0)
            )
            .add(Friction)
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
                350,
                Color.new(0, 255, 0)
            )
            .add(Friction)
            .add(
                CircleCollider,
                350
            );

        this.createEntity()
            .add(
                Position,
                Vector.new(100, 200)
            )
            .add(
                Rectangle,
                Vector.new(50, 200),
                Color.new(100, 50, 0),
                0,
                Vector.new(0, 149)
            )
            .add(
                Circle,
                150,
                Color.new(0, 255, 0)
            )
            .add(Friction)
            .add(
                ComplexCollider,
                [
                    ['circle', 1, 150, Vector.new(0, 0)],
                    ['rect', 1, Vector.new(50, 200), Vector.new(0, 149), 0],
                ]
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
