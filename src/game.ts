import { MyTestBehavior, myTestBehaviorSystem } from "./behaviors/my_test_behavior";
import { Acceleration } from "./components/acceleration";
import { Circle } from "./components/circle";
import { Position } from "./components/position";
import { Rectangle } from "./components/rectangle";
import { Rotation } from "./components/rotation";
import { Velocity } from "./components/velocity";
import { World } from "./ecs";
import { forcesSystem } from "./systems/forces_system";
import { Color } from "./util/color";
import { Vector } from "./util/vector";

export class Game extends World {
    setup(): void {
        this.systems = [
            forcesSystem,
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
            .add(Velocity, Vector.new(-100, 0))
            .add(Acceleration)
            .add(Rotation)
            .add(MyTestBehavior, 1_000, 5)
            ;

        this.createEntity()
            .add(
                Position,
                Vector.new(300, 300)
            )
            .add(
                Rectangle,
                Vector.new(300, 300),
                Color.new(0, 255, 0)
            )
            ;
    }
}
