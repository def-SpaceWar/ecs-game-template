import { Acceleration } from "../lib/components/acceleration";
import { AngularVelocity } from "../lib/components/angular_velocity";
import { CameraController } from "../lib/components/camera_controller";
import { CircleRenderer } from "../lib/components/circle_renderer";
import { CircleCollider } from "../lib/components/circle_collider";
import { ComplexCollider } from "../lib/components/complex_collider";
import { Friction } from "../lib/components/friction";
import { Mass } from "../lib/components/mass";
import { Position } from "../lib/components/position";
import { RectangleRenderer } from "../lib/components/rectangle_renderer";
import { RectangleCollider } from "../lib/components/rectangle_collider";
import { Restitution } from "../lib/components/restitution";
import { Rotation } from "../lib/components/rotation";
import { SimpleDrag } from "../lib/components/simple_drag";
import { Tag } from "../lib/components/tag";
import { Velocity } from "../lib/components/velocity";
import { World } from "../lib/ecs";
import { collisionSystem } from "../lib/systems/collision_system";
import { debugColliderSystem } from "../lib/systems/debug_collider_system";
import { forcesSystem } from "../lib/systems/forces_system";
import { Color } from "../lib/util/color";
import { loadImage } from "../lib/util/load_image";
import { Vector } from "../lib/util/vector";
import { HEIGHT, WIDTH } from "../parameters";
import { MyTestBehavior, myTestBehaviorSystem } from "../user_scripts/my_test_behavior";
import { SpriteRenderer } from "../lib/components/sprite_renderer";
import { animationSystem } from "../lib/systems/animation_system";
import { AnimationController } from "../lib/components/animation_controller";
import { AnimationData, Keyframe, PropertyMap } from "../lib/util/animation";
import { ParagraphRenderer } from "../lib/components/paragraph_renderer";
import { Gradient } from "../lib/util/gradient";
import { MovingPlatform, movingPlatformSystem } from "../user_scripts/moving_platform";
import { AnimatedDialog } from "../lib/components/animated_dialog";
import { animatedDialogSystem } from "../lib/systems/animated_dialog_system";
import { Matrix } from "../lib/util/matrix";
import { PolygonCollider } from "../lib/components/polygon_collider";
import { PolygonRenderer } from "../lib/components/polygon_renderer";
import sprite from "../assets/sprite_PNG98773.png";

export class Game extends World {
    playerImg: HTMLImageElement = new Image();

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
            debugColliderSystem,
            animationSystem,
            movingPlatformSystem,
            animatedDialogSystem,
        ];

        this.createEntity().$(e =>
            new CameraController(e, Vector.new(200, 200))
        );

        this.createEntity().$(e => [
            new Position(e, Vector.new(300, 100)),
            new SpriteRenderer(e,
                Vector.new(175, 175),
                this.playerImg,
                -2
            ),
            new ComplexCollider(e, [
                ["polygon", 0.6, [
                    Vector.new(37.5, 37.5),
                    Vector.new(37.5, -37.5),
                    Vector.new(-37.5, -37.5),
                    Vector.new(-37.5, 37.5),
                ], Vector.zero(), 0],
                ["circle", 0.2, 74, Vector.new(0, 37.5)],
                ["circle", 0.2, 74, Vector.new(0, -37.5)]
            ]),
            new ParagraphRenderer(e,
                [],
                "Comic Sans MS",
                25,
                Gradient.new(
                    Vector.new(100, -100), Vector.new(-100, 100),
                    [[0, Color.new(255, 0, 0)], [1, Color.new(0, 0, 0)]]
                ),
                -2,
                Vector.new(10, 0),
                -Math.PI / 3 + 0.15,
                Matrix.new(1, 1, -1, 2)
            ),
            new AnimatedDialog(e,
                ["Fake Water*", "Lines", "Testing"],
                10,
                true
            ),
            new Velocity(e),
            new Mass(e),
            new Acceleration(e, Vector.new(0, 400)),
            new Rotation(e),
            new AngularVelocity(e),
            new Restitution(e),
            new Friction(e),
            new SimpleDrag(e),
            new MyTestBehavior(e),
            new Tag(e, "camera_center"),
        ]);

        this.createEntity().$(e => [
            new Position(e, Vector.new(200, 600)),
            new RectangleRenderer(e, Vector.new(300, 300), Color.green()),
            new Restitution(e),
            new Friction(e),
            new RectangleCollider(e, Vector.new(300, 300)),
            new Tag(e, "platform"),
        ]);

        this.createEntity().$(e => [
            new Position(e, Vector.new(550, 600)),
            new CircleRenderer(e, 300, Color.green()),
            new Restitution(e),
            new Friction(e),
            new CircleCollider(e, 300),
            new Tag(e, "platform"),
        ]);

        this.createEntity().$(e => [
            new Position(e, Vector.new(100, 200)),
            new RectangleRenderer(e,
                Vector.new(50, 200),
                Color.new(100, 50, 0),
                0,
                Vector.new(0, 149)
            ),
            new CircleRenderer(e, 150, Color.green()),
            new Restitution(e),
            new Friction(e),
            new ComplexCollider(e, [
                ["circle", 1, 150, Vector.new(0, 0)],
                ["rect", 1, Vector.new(50, 200), Vector.new(0, 149), 0],
            ]),
            new Tag(e, "platform"),
        ]);

        this.createEntity().$(e => [
            new Position(e, Vector.new(WIDTH / 2, HEIGHT / 2), false),
            new RectangleRenderer(e,
                Vector.new(WIDTH, HEIGHT), Color.new(0, 175, 255),
                5
            ),
        ]);

        this.createEntity().$(e => [
            new Position(e, Vector.new(400, 300)),
            new AnimationController(e,
                AnimationData.new(
                    "move1",
                    Keyframe.static(
                        0,
                        PropertyMap.new(
                            Velocity,
                            "vel",
                            Vector.new(20, 0)
                        )
                    ),
                    Keyframe.static(
                        Infinity,
                        PropertyMap.new(
                            Acceleration,
                            "acc",
                            Vector.new(10, 0)
                        )
                    )
                ),
                AnimationData.new(
                    "move2",
                    Keyframe.static(
                        0,
                        PropertyMap.new(
                            Velocity,
                            "vel",
                            Vector.new(-20, 0)
                        )
                    ),
                    Keyframe.static(
                        Infinity,
                        PropertyMap.new(
                            Acceleration,
                            "acc",
                            Vector.new(-10, 0)
                        )
                    )
                )
            ),
            new MovingPlatform(e,
                Vector.new(400, 300),
                Vector.new(800, 300)
            ),
            new Tag(e, "platform"),
            new Velocity(e),
            new Acceleration(e),
            new PolygonRenderer(e,
                [
                    Vector.new(100, 5),
                    Vector.new(100, -5),
                    Vector.new(-100, -5),
                    Vector.new(-100, 5)
                ],
                Color.new(0, 100, 255)
            ),
            new PolygonCollider(e,
                [
                    Vector.new(100, 5),
                    Vector.new(100, -5),
                    Vector.new(-100, -5),
                    Vector.new(-100, 5)
                ]
            ),
            new Friction(e),
            new Restitution(e),
        ]);
    }
}
