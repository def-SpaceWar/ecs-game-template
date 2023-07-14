import { CircleCollider } from "../components/circle_collider";
import { ComplexCollider } from "../components/complex_collider";
import { Position } from "../components/position";
import { RectangleCollider } from "../components/rectangle_collider";
import { Rotation } from "../components/rotation";
import { World } from "../ecs";
import { Camera } from "../util/camera";
import { Collider } from "./collision_system";
import { ctx } from "./render_system";

export function debugColliderSystem(world: World) {
    const colliders = world.findComponentsOfTypes<Collider>([
        RectangleCollider,
        CircleCollider,
        ComplexCollider
    ]);

    const cameraCoords = Camera.getCoords();
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 255, 0.3)";
    ctx.strokeStyle = "rgba(0, 0, 255)";
    ctx.lineWidth = 2;
    ctx.translate(ctx.canvas.width / 2 - cameraCoords[0], ctx.canvas.height / 2 - cameraCoords[1]);
    for (const collider of colliders) {
        const position = world.getComponent(Position, collider.entity);
        const rotation = world.getComponent(Rotation, collider.entity);

        for (const polygon of collider.getPolygons()) {
            if (rotation) polygon.rotate(rotation.angle);
            if (position) polygon.translate(position.pos);

            ctx.save();
            if (polygon.isCircle) {
                ctx.beginPath();
                ctx.moveTo(...polygon.center.tuple());
                ctx.ellipse(
                    ...polygon.center.tuple(),
                    polygon.radius, polygon.radius,
                    rotation?.angle || 0,
                    0, Math.PI * 2);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.moveTo(...polygon.center.tuple())
                for (const point of polygon.points) {
                    ctx.lineTo(...point.tuple())
                }
                ctx.lineTo(...polygon.points[0].tuple())
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
            }
            ctx.restore();
        }
    }
    ctx.restore();
}
