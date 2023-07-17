import { Entity } from "../ecs";
import { ColoredDrawable, FillSource } from "../systems/render_system";
import { Color } from "../util/color";
import { Vector } from "../util/vector";

export class PolygonRenderer implements ColoredDrawable {
    constructor(
        public entity: Entity,
        public points: Vector[],
        public color: FillSource,
        public zIndex: number = 0,
        public offset: Vector = Vector.zero(),
        public rotation: number = 0,
        public strokeColor: FillSource = Color.black(),
        public lineWidth: number = 1
    ) {
        const average: Vector = Vector.zero();
        for (const point of points) {
            average.add(point);
        }
        const amountOfPoints = points.length;
        average.scale(1 / amountOfPoints);
        points.forEach(p => p.subtract(average));
    }
}