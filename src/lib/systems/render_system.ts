import { CircleRenderer } from "../components/circle_renderer";
import { ParagraphRenderer } from "../components/paragraph_renderer";
import { PolygonRenderer } from "../components/polygon_renderer";
import { Position } from "../components/position";
import { RectangleRenderer } from "../components/rectangle_renderer";
import { Rotation } from "../components/rotation";
import { SpriteRenderer } from "../components/sprite_renderer";
import { TextRenderer } from "../components/text_renderer";
import { Component, System, World, isComponent } from "../ecs";
import { Camera } from "../util/camera";
import { Vector } from "../util/vector";

export interface FillSource {
    /**
     * @description Turns a FillSource into a fillStyle.
     */
    toFillStyle(): string | CanvasGradient | CanvasPattern;
}

export interface Drawable extends Component {
    /**
     * @description The z-index a drawable is rendered at.
     */
    zIndex: number;
    /**
     * @description The positional offset a drawable is rendered at.
     */
    offset: Vector;
    /**
     * @description The rotational offset a drawable is rendered at.
     */
    rotation: number;
}

export interface ColoredDrawable extends Drawable {
    /**
     * @description The output color/fillStyle of the drawable.
     */
    color: FillSource;
    /**
     * @description The output strokeColor/strokeStyle of the drawable.
     */
    strokeColor: FillSource;
    /**
     * @description The lineWidth of the strokes of the drawable.
     */
    lineWidth: number;
}

/**
 * @description Options for rendering text.
 */
export type TextOptions = {
    /**
     * @description The direction to render the text in.
     */
    direction: CanvasDirection;
    /**
     * @description The horizontal alignment of the text.
     */
    textAlign: CanvasTextAlign;
    /**
     * @description The vertical alignment of the text.
     */
    textBaseline: CanvasTextBaseline;
};

/**
 * @description The rendering context of the global render system.
 */
export let ctx: CanvasRenderingContext2D;

export function createRenderSystem(
    width: number,
    height: number,
    isDynamic: boolean
): System {
    ctx = document.getElementById("app")!
        .appendChild(document
            .createElement("canvas"))
        .getContext("2d")!;

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
            RectangleRenderer,
            CircleRenderer,
            PolygonRenderer,
            SpriteRenderer,
            TextRenderer,
            ParagraphRenderer
        ]);
        drawables.sort((a, b) => b.zIndex - a.zIndex);

        for (const drawable of drawables) {
            const position = world.getComponent(drawable.entity, Position)!;
            const rotation = world.getComponent(drawable.entity, Rotation)!;

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
    if (isComponent(drawable, RectangleRenderer)) {
        ctx.fillStyle = drawable.color.toFillStyle();
        ctx.strokeStyle = drawable.strokeColor.toFillStyle();
        ctx.lineWidth = drawable.lineWidth;
        ctx.fillRect(-drawable.dims.x / 2, -drawable.dims.y / 2, drawable.dims.x, drawable.dims.y);
        ctx.strokeRect(-drawable.dims.x / 2, -drawable.dims.y / 2, drawable.dims.x, drawable.dims.y);
    } else if (isComponent(drawable, CircleRenderer)) {
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
    } else if (isComponent(drawable, PolygonRenderer)) {
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
    } else if (isComponent(drawable, SpriteRenderer)) {
        if (drawable.scale instanceof Vector) {
            ctx.scale(...drawable.scale.toTuple());
        } else {
            ctx.transform(...drawable.scale.toTuple(), 0, 0);
        }
        ctx.drawImage(
            drawable.image,
            drawable.sx, drawable.sy, drawable.sw, drawable.sh,
            ...drawable.dims.clone().scale(-.5).toTuple(), ...drawable.dims.toTuple()
        );
    } else if (isComponent(drawable, TextRenderer)) {
        ctx.fillStyle = drawable.color.toFillStyle();
        ctx.strokeStyle = drawable.strokeColor.toFillStyle();
        ctx.lineWidth = drawable.lineWidth;
        ctx.font = `${drawable.fontSize}px ${drawable.font}`;
        ctx.direction = drawable.textOptions.direction;
        ctx.textAlign = drawable.textOptions.textAlign;
        ctx.textBaseline = drawable.textOptions.textBaseline;
        if (drawable.scale instanceof Vector) {
            ctx.scale(...drawable.scale.toTuple());
        } else {
            ctx.transform(...drawable.scale.toTuple(), 0, 0);
        }
        ctx.fillText(drawable.text, 0, 0);
        ctx.strokeText(drawable.text, 0, 0);
    } else if (isComponent(drawable, ParagraphRenderer)) {
        ctx.fillStyle = drawable.color.toFillStyle();
        ctx.strokeStyle = drawable.strokeColor.toFillStyle();
        ctx.lineWidth = drawable.lineWidth;
        ctx.font = `${drawable.fontSize}px ${drawable.font}`;
        ctx.direction = drawable.textOptions.direction;
        ctx.textAlign = drawable.textOptions.textAlign;
        ctx.textBaseline = drawable.textOptions.textBaseline;
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
