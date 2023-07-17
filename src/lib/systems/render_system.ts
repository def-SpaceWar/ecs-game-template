import { Circle } from "../components/circle";
import { ParagraphRenderer } from "../components/paragraph_renderer";
import { PolygonRenderer } from "../components/polygon_renderer";
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

export interface ColoredDrawable extends Drawable {
    color: FillSource;
    strokeColor: FillSource;
    lineWidth: number;
}

export let ctx: CanvasRenderingContext2D;

export function createRenderSystem(
    width: number,
    height: number,
    isDynamic: boolean
): System {
    ctx = document.getElementById('app')!
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

        const cameraCoords = Camera.getCoords();
        const drawables = world.findComponentsOfTypesArray<Drawable>([
            Rectangle,
            Circle,
            PolygonRenderer,
            Sprite,
            TextRenderer,
            ParagraphRenderer
        ]);
        drawables.sort((a, b) => b.zIndex - a.zIndex);

        for (const drawable of drawables) {
            const position = world.getComponent(Position, drawable.entity)!;
            const rotation = world.getComponent(Rotation, drawable.entity)!;

            draw(drawable, ctx, cameraCoords, position, rotation);
        }
    };
}

function draw(
    drawable: Drawable,
    ctx: CanvasRenderingContext2D,
    cameraCoords: [number, number],
    position?: Position,
    rotation?: Rotation
) {
    ctx.save();
    if (position?.isWorldSpace) {
        ctx.translate(ctx.canvas.width / 2 - cameraCoords[0], ctx.canvas.height / 2 - cameraCoords[1]);
    }
    if (position) ctx.translate(position.pos.x, position.pos.y);
    ctx.rotate(rotation?.angle || 0);
    ctx.translate(drawable.offset.x, drawable.offset.y);
    ctx.rotate(drawable.rotation);
    if (isComponent({ component: drawable, Type: Rectangle })) {
        ctx.fillStyle = drawable.color.toFillStyle();
        ctx.strokeStyle = drawable.strokeColor.toFillStyle();
        ctx.lineWidth = drawable.lineWidth;
        ctx.fillRect(-drawable.dims.x / 2, -drawable.dims.y / 2, drawable.dims.x, drawable.dims.y);
        ctx.strokeRect(-drawable.dims.x / 2, -drawable.dims.y / 2, drawable.dims.x, drawable.dims.y);
    } else if (isComponent({ component: drawable, Type: Circle })) {
        ctx.fillStyle = drawable.color.toFillStyle();
        ctx.strokeStyle = drawable.strokeColor.toFillStyle();
        ctx.lineWidth = drawable.lineWidth;
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
        ctx.stroke();
    } else if (isComponent({ component: drawable, Type: PolygonRenderer })) {
        ctx.fillStyle = drawable.color.toFillStyle();
        ctx.strokeStyle = drawable.strokeColor.toFillStyle();
        ctx.lineWidth = drawable.lineWidth;
        ctx.beginPath();
        ctx.moveTo(...drawable.points[0].toTuple());
        for (const point of drawable.points) {
            ctx.lineTo(...point.toTuple());
        }
        ctx.lineTo(...drawable.points[0].toTuple());
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    } else if (isComponent({ component: drawable, Type: Sprite })) {
        ctx.drawImage(
            drawable.image,
            drawable.sx, drawable.sy, drawable.sw, drawable.sh,
            ...drawable.dims.clone().scale(-.5).toTuple(), ...drawable.dims.toTuple()
        );
    } else if (isComponent({ component: drawable, Type: TextRenderer })) {
        ctx.fillStyle = drawable.color.toFillStyle();
        ctx.strokeStyle = drawable.strokeColor.toFillStyle();
        ctx.lineWidth = drawable.lineWidth;
        ctx.font = `${drawable.fontSize}px ${drawable.font}`;
        for (const key in drawable.textOptions) {
            /** @ts-ignore - I know what I'm doing. */
            ctx[key] = drawable.textOptions[key];
        }
        if (drawable.scale instanceof Vector) {
            ctx.scale(...drawable.scale.toTuple());
        } else {
            ctx.transform(...drawable.scale.toTuple(), 0, 0);
        }
        ctx.fillText(drawable.text, 0, 0);
        ctx.strokeText(drawable.text, 0, 0);
    } else if (isComponent({ component: drawable, Type: ParagraphRenderer })) {
        ctx.fillStyle = drawable.color.toFillStyle();
        ctx.strokeStyle = drawable.strokeColor.toFillStyle();
        ctx.lineWidth = drawable.lineWidth;
        ctx.font = `${drawable.fontSize}px ${drawable.font}`;
        for (const key in drawable.textOptions) {
            /** @ts-ignore - I know what I'm doing. */
            ctx[key] = drawable.textOptions[key];
        }
        if (drawable.scale instanceof Vector) {
            ctx.scale(...drawable.scale.toTuple());
        } else {
            ctx.transform(...drawable.scale.toTuple(), 0, 0);
        }
        const textCount = drawable.text.length;
        switch (drawable.textOptions.textBaseline) {
            case "hanging":
            case "top":
                for (let i = 0; i < textCount; i++) {
                    ctx.fillText(drawable.text[textCount - i - 1], 0, -drawable.fontSize * i);
                    ctx.strokeText(drawable.text[textCount - i - 1], 0, -drawable.fontSize * i);
                }
                break;
            case "alphabetic":
            case "bottom":
            case "ideographic":
                for (let i = 0; i < textCount; i++) {
                    ctx.fillText(drawable.text[i], 0, drawable.fontSize * i);
                    ctx.strokeText(drawable.text[i], 0, drawable.fontSize * i);
                }
                break;
            case "middle":
                for (let i = 0; i < textCount; i++) {
                    ctx.fillText(drawable.text[textCount - i - 1], 0, -drawable.fontSize * (i - textCount / 2 + 0.5));
                    ctx.strokeText(drawable.text[textCount - i - 1], 0, -drawable.fontSize * (i - textCount / 2 + 0.5));
                }
                break;
        }
    }
    ctx.restore();
}
