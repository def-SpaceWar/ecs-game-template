import { Acceleration } from "../lib/components/acceleration";
import { AngularVelocity } from "../lib/components/angular_velocity";
import { CameraController } from "../lib/components/camera_controller";
import { Circle } from "../lib/components/circle";
import { CircleCollider } from "../lib/components/circle_collider";
import { ComplexCollider } from "../lib/components/complex_collider";
import { Friction } from "../lib/components/friction";
import { Mass } from "../lib/components/mass";
import { Position } from "../lib/components/position";
import { Rectangle } from "../lib/components/rectangle";
import { RectangleCollider } from "../lib/components/rectangle_collider";
import { Restitution } from "../lib/components/restitution";
import { Rotation } from "../lib/components/rotation";
import { SimpleDrag } from "../lib/components/simple_drag";
import { Tag } from "../lib/components/tag";
import { Velocity } from "../lib/components/velocity";
import { World } from "../lib/ecs";
import { collisionSystem } from "../lib/systems/collision_system";
//import { debugColliderSystem } from "../lib/systems/debug_collider_system";
import { forcesSystem } from "../lib/systems/forces_system";
import { Color } from "../lib/util/color";
import { loadImage } from "../lib/util/load_image";
import { Vector } from "../lib/util/vector";
import { HEIGHT, WIDTH } from "../parameters";
import { MyTestBehavior, myTestBehaviorSystem } from "../user_scripts/my_test_behavior";
import sprite from '../assets/sprite_PNG98773.png';
import { Sprite } from "../lib/components/sprite";
import { animationSystem } from "../lib/systems/animation_system";
import { AnimationController } from "../lib/components/animation_controller";
import { AnimationData, Keyframe, PropertyMap } from "../lib/util/animation";
import { TextRenderer } from "../lib/components/text_renderer";

export class Game extends World {
    playerImg: HTMLImageElement;

    async load(): Promise<void> {
        this.playerImg = await loadImage(sprite);
    }

    setup(): void {
        this.systems = [
            forcesSystem,
            collisionSystem,
            myTestBehaviorSystem,
        ];

        this.renderSystems = [
            animationSystem,
            //debugColliderSystem,
        ];

        this.createEntity()
            .add(
                CameraController,
                Vector.new(200, 200)
            )
            ;

        this.createEntity()
            .add(
                Position,
                Vector.new(300, 100)
            )
            .add(
                Sprite,
                Vector.new(175, 175),
                this.playerImg,
                -2
            )
            .add(
                ComplexCollider,
                [
                    ['rect', 0.6, Vector.new(75, 75), Vector.zero(), 0],
                    ['circle', 0.2, 74, Vector.new(0, 37.5)],
                    ['circle', 0.2, 74, Vector.new(0, -37.5)]
                ]
            )
            .add(
                TextRenderer,
                "Fake Water*",
                "Comic Sans MS",
                25,
                Color.new(255, 0, 0),
                -2,
                Vector.new(10, 0),
                -Math.PI / 3 + 0.15,
                Vector.new(1, 3)
            )
            .add(Velocity)
            .add(Mass)
            .add(Acceleration, Vector.new(0, 400))
            .add(Rotation)
            .add(AngularVelocity)
            .add(Restitution)
            .add(Friction)
            .add(SimpleDrag)
            .add(MyTestBehavior)
            .add(Tag, "camera_center")
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
                Vector.new(WIDTH / 2, HEIGHT / 2),
                false
            )
            .add(
                Rectangle,
                Vector.new(WIDTH, HEIGHT),
                Color.new(0, 175, 255),
                5
            )
            ;

        this.createEntity()
            .add(
                Position,
                Vector.new(400, 300)
            )
            .add(Velocity)
            .add(
                Rectangle,
                Vector.new(200, 10),
                Color.new(0, 100, 255)
            )
            .add(
                RectangleCollider,
                Vector.new(200, 10)
            )
            .add(
                AnimationController,
                AnimationData.static(
                    "move_side_to_side",
                    Keyframe.static(
                        5,
                        PropertyMap.new(Velocity, "vel", Vector.new(100, 0))
                    ),
                    Keyframe.static(
                        5,
                        PropertyMap.new(Velocity, "vel", Vector.new(-100, 0))
                    )
                )
            )
            .add(Friction)
            .add(Restitution)
            .add(Tag, "platform")
            ;
    }
}
