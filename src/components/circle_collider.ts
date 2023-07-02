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

    getPolygons(): Polygon[] {
        return [new Polygon([], true, this.diameter / 2)];
    }

    inertia(mass: number): number {
        return this.getPolygons()[0].inertia(mass);
    }
}
