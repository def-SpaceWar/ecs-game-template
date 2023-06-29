import { Circle } from "../components/circle";
import { Position } from "../components/position";
import { Rectangle } from "../components/rectangle";
import { Rotation } from "../components/rotation";
import { Component, System, World, isComponent } from "../ecs";
import { Vector } from "../util/vector";

export interface Drawable extends Component {
    zIndex: number;
    offset: Vector;
}

export function createRenderSystem(width: number, height: number): System {
    const ctx = document.getElementById('app')!.appendChild(
        document.createElement('canvas')
    ).getContext("2d")!;

    ctx.canvas.width = width;
    ctx.canvas.height = height;

    return (world: World) => {
        ctx.clearRect(0, 0, width, height);

        const drawables = world.findComponentsOfTypes<Drawable>([
            Rectangle,
            Circle
        ]);
        drawables.sort((a, b) => b.zIndex - a.zIndex);

        for (const drawable of drawables) {
            const position = world.getComponent(Position, drawable.entity)!;
            const rotation = world.getComponent(Rotation, drawable.entity)!;

            ctx.save();
            if (position) ctx.translate(position.pos.x, position.pos.y);
            ctx.rotate(rotation?.angle || 0);
            ctx.translate(drawable.offset.x, drawable.offset.y);
            if (isComponent(drawable, Rectangle)) {
                ctx.fillStyle = drawable.color.toString();
                ctx.fillRect(-drawable.dims.x / 2, -drawable.dims.y / 2, drawable.dims.x, drawable.dims.y);
            } else if (isComponent(drawable, Circle)) {
                ctx.fillStyle = drawable.color.toString();
                ctx.beginPath();
                ctx.ellipse(
                    0,
                    0,
                    drawable.diameter / 2,
                    drawable.diameter / 2,
                    0,
                    0,
                    Math.PI * 2
                );
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();
        }
    };
}
