import { Entity } from "../ecs";
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
        const points: Vector[] = [
            Vector.new(this.diameter / 2, 0).add(this.offset)
        ];

        return new Polygon(points, true, this.diameter / 2);
    }
}
