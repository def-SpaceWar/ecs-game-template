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
import { SimpleDrag } from "./components/simple_drag";
import { Tag } from "./components/tag";
import { Velocity } from "./components/velocity";
import { World } from "./ecs";
import { HEIGHT, WIDTH } from "./parameters";
import { collisionSystem } from "./systems/collision_system";
import { debugColliderSystem } from "./systems/debug_collider_system";
import { forcesSystem } from "./systems/forces_system";
import { Color } from "./util/color";
import { Vector } from "./util/vector";

export class Game extends World {
    setup(): void {
        this.systems = [
            forcesSystem,
            collisionSystem,
            myTestBehaviorSystem,
        ];

        this.renderSystems = [
            debugColliderSystem,
            wrapAroundScreenSystem,
        ];

        this.createEntity()
            .add(
                Position,
                Vector.new(300, 100)
            )

            // Circle Player
            //.add(
            //    Circle,
            //    100,
            //    Color.new(255, 0, 0)
            //)
            //.add(
            //    CircleCollider,
            //    100
            //)

            // Square Player
            .add(
                Rectangle,
                Vector.new(80, 80),
                Color.new(255, 0, 0)
            )
            .add(
                RectangleCollider,
                Vector.new(80, 80)
            )

            // Capsule Player
            //.add(
            //    Rectangle,
            //    Vector.new(75, 75),
            //    Color.new(255, 175, 0),
            //    -1
            //)
            //.add(
            //    Circle,
            //    75,
            //    Color.new(255, 0, 0),
            //    0,
            //    Vector.new(0, 37.5)
            //)
            //.add(
            //    Circle,
            //    75,
            //    Color.new(255, 0, 0),
            //    0,
            //    Vector.new(0, -37.5)
            //)
            //.add(
            //    ComplexCollider,
            //    [
            //        ['rect', 0.6, Vector.new(75, 75), Vector.zero(), 0],
            //        ['circle', 0.2, 74, Vector.new(0, 37.5)],
            //        ['circle', 0.2, 74, Vector.new(0, -37.5)]
            //    ]
            //)

            .add(Velocity)
            .add(Mass)
            .add(Acceleration, Vector.new(0, 400))
            .add(Rotation)
            .add(AngularVelocity)
            .add(Restitution)
            .add(Friction)
            .add(SimpleDrag)
            .add(MyTestBehavior)
            .add(WrapAroundScreen)
            ;

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
            .add(Restitution)
            .add(Friction)
            .add(
                RectangleCollider,
                Vector.new(300, 300)
            )
            .add(Tag, "platform")
            ;

        this.createEntity()
            .add(
                Position,
                Vector.new(600, 600)
            )
            .add(
                Circle,
                300,
                Color.new(0, 255, 0)
            )
            .add(Restitution)
            .add(Friction)
            .add(
                CircleCollider,
                300
            )
            .add(Tag, "platform")
            ;

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
            .add(Restitution)
            .add(Friction)
            .add(
                ComplexCollider,
                [
                    ['circle', 1, 150, Vector.new(0, 0)],
                    ['rect', 1, Vector.new(50, 200), Vector.new(0, 149), 0],
                ]
            )
            .add(Tag, "platform")
            ;

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
            )
            ;
    }
}
