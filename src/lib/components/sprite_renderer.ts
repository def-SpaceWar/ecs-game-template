import { Entity } from "../ecs";
import { Drawable } from "../systems/render_system";
import { Matrix } from "../util/matrix";
import { Vector } from "../util/vector";

/**
 * @description Adds an image renderer to an entity.
 */
export class SpriteRenderer implements Drawable {
    /**
     * @description The x-coordinate of the image source.
     */
    sx = 0;
    /**
     * @description The y-coordinate of the image source.
     */
    sy = 0;
    /**
     * @description The width of the image source.
     */
    sw: number;
    /**
     * @description The height of the image source.
     */
    sh: number;

    /**
     * @param entity Provided by an entity wrapper.
     * @param dims The dimensions of the sprite.
     * @param image The image (or any other canvas image source that has a 
     * width and height) of the sprite.
     * @param zIndex The z-index a drawable is rendered at.
     * @param offset The positional offset a drawable is rendered at.
     * @param rotation The rotational offset a drawable is rendered at.
     * @param scale A Vector or Matrix transformation to apply to the sprite.
     */
    constructor(
        public entity: Entity,
        public dims: Vector,
        public image: HTMLImageElement
            | HTMLVideoElement
            | HTMLCanvasElement
            | OffscreenCanvas
            | ImageBitmap,
        public zIndex: number = 0,
        public offset: Vector = Vector.zero(),
        public rotation: number = 0,
        public scale: Vector | Matrix = Matrix.identity(),
    ) {
        this.sw = image.width;
        this.sh = image.height;
    }
}
