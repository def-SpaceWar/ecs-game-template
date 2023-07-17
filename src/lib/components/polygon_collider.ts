import { Entity } from "../ecs";
import { Collider } from "../systems/collision_system";
import { Polygon } from "../util/collision";
import { Vector } from "../util/vector";

export class PolygonCollider implements Collider {
    constructor(
        public entity: Entity,
        public points: Vector[],
        public offset: Vector = Vector.zero()
    ) {
        const average: Vector = Vector.zero();
        for (const point of points) {
            average.add(point);
        }
        const amountOfPoints = points.length;
        average.scale(1 / amountOfPoints);
        points.forEach(p => p.subtract(average));
    }

    getPolygons(): Polygon[] {
        const clonedPoints: Vector[] = this.points.map(p => p.clone()
            .add(this.offset));
        return [new Polygon(clonedPoints)];
    }

    inertia(mass: number): number {
        return this.getPolygons()[0].inertia(mass);
    }
}