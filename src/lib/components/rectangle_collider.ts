import { Entity } from "../ecs";
import { Collider } from "../systems/collision_system";
import { Polygon } from "../util/collision";
import { Vector } from "../util/vector";

export class RectangleCollider implements Collider {
    constructor(
        public entity: Entity,
        public dims: Vector,
        public offset: Vector = Vector.zero()
    ) {}

    getPolygons(): Polygon[] {
        return [new Polygon([
            Vector.new(-this.dims.x / 2, -this.dims.y / 2).add(this.offset),
            Vector.new(-this.dims.x / 2, this.dims.y / 2).add(this.offset),
            Vector.new(this.dims.x / 2, this.dims.y / 2).add(this.offset),
            Vector.new(this.dims.x / 2, -this.dims.y / 2).add(this.offset)
        ])];
    }

    inertia(mass: number): number {
        return this.getPolygons()[0].inertia(mass);
    }
}
