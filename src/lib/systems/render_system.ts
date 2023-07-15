import { Circle } from "../components/circle";
import { Position } from "../components/position";
import { Rectangle } from "../components/rectangle";
import { Rotation } from "../components/rotation";
import { Sprite } from "../components/sprite";
import { TextRenderer } from "../components/text_renderer";
import { Component, System, World, isComponent } from "../ecs";
import { Camera } from "../util/camera";
import { Vector } from "../util/vector";

export interface FillSource {
    toFillStyle(): string | CanvasGradient | CanvasPattern;
}

export interface Drawable extends Component {
    zIndex: number;
    offset: Vector;
    rotation: number;
}

export let ctx: CanvasRenderingContext2D;

export function createRenderSystem(width: number, height: number, isDynamic: boolean): System {
    ctx = document
        .getElementById('app')!
        .appendChild(document
            .createElement('canvas'))
        .getContext("2d")!

    if (!isDynamic) {
        ctx.canvas.width = width;
        ctx.canvas.height = height;
    } else {
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;

        addEventListener("resize", () => {
            ctx.canvas.width = window.innerWidth;
            ctx.canvas.height = window.innerHeight;
        });
    }

    return (world: World) => {
        ctx.clearRect(0, 0, width, height);

        const drawables = world.findComponentsOfTypes<Drawable>([
            Rectangle,
            Circle,
            Sprite,
            TextRenderer
        ]);
        drawables.sort((a, b) => b.zIndex - a.zIndex);

        const cameraCoords = Camera.getCoords();
        for (const drawable of drawables) {
            const position = world.getComponent(Position, drawable.entity)!;
            const rotation = world.getComponent(Rotation, drawable.entity)!;

            draw(drawable, ctx, cameraCoords, position, rotation);
        }
    };
}

function draw(drawable: Drawable, ctx: CanvasRenderingContext2D, cameraCoords: [number, number], position?: Position, rotation?: Rotation) {
    ctx.save();
    if (position?.isWorldSpace) {
        ctx.translate(ctx.canvas.width / 2 - cameraCoords[0], ctx.canvas.height / 2 - cameraCoords[1]);
    }
    if (position) ctx.translate(position.pos.x, position.pos.y);
    ctx.rotate(rotation?.angle || 0);
    ctx.translate(drawable.offset.x, drawable.offset.y);
    ctx.rotate(drawable.rotation);
    if (isComponent(drawable, Rectangle)) {
        ctx.fillStyle = drawable.color.toFillStyle();
        ctx.fillRect(-drawable.dims.x / 2, -drawable.dims.y / 2, drawable.dims.x, drawable.dims.y);
    } else if (isComponent(drawable, Circle)) {
        ctx.fillStyle = drawable.color.toFillStyle();
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
    } else if (isComponent(drawable, Sprite)) {
        ctx.drawImage(
            drawable.image,
            drawable.sx, drawable.sy, drawable.sw, drawable.sh,
            ...drawable.dims.clone().scale(-.5).tuple(), ...drawable.dims.tuple()
        );
    } else if (isComponent(drawable, TextRenderer)) {
        ctx.fillStyle = drawable.color.toFillStyle();
        ctx.font = `${drawable.fontSize}px ${drawable.font}`;
        for (const key in drawable.textOptions) {
            /** @ts-ignore - I know what I'm doing. */
            ctx[key] = drawable.textOptions[key];
        }
        ctx.scale(...drawable.scale.tuple());
        ctx.fillText(drawable.text, 0, 0);
    }
    ctx.restore();
}
