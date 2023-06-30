import { Entity } from "../ecs";
import { CIRCLE_POINTS } from "../parameters";
import { Collider } from "../systems/collision_system";
import { Polygon } from "../util/collision";
import { Vector } from "../util/vector";

export class CircleCollider implements Collider {
    constructor(
        public entity: Entity,
        public diameter: number,
        public offset: Vector = Vector.zero()
    ) {}

    getPolygon(): Polygon {
        const points: Vector[] = [];

        for (let i = 0; i < CIRCLE_POINTS; i++) {
            points.push(
                Vector.new(
                    Math.cos(i * Math.PI * 2 / CIRCLE_POINTS) * this.diameter / 2,
                    Math.sin(i * Math.PI * 2 / CIRCLE_POINTS) * this.diameter / 2
                ).add(this.offset)
            );
        }

        return new Polygon(points);
    }
}
