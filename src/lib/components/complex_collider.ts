import { Entity } from "../ecs";
import { Collider } from "../systems/collision_system";
import { Polygon } from "../util/collision";
import { Vector } from "../util/vector";

export type ColliderDesc
    = [type: 'rect', mass: number, dims: Vector, offset: Vector, rotation: number]
    | [type: 'circle', mass: number, diameter: number, offset: Vector]
    | [type: 'polygon', mass: number, points: Vector[], offset: Vector, rotation: number];

export class ComplexCollider implements Collider {
    constructor(
        public entity: Entity,
        public types: ColliderDesc[],
        public offset: Vector = Vector.zero()
    ) {
        for (const type of types) {
            if (type[0] != 'polygon') continue;
            const points = type[2];
            const average: Vector = Vector.zero();
            for (const point of points) {
                average.add(point);
            }
            const amountOfPoints = points.length;
            average.scale(1 / amountOfPoints);
            points.forEach(p => p.subtract(average));
        }
    }

    getPolygons(): Polygon[] {
        const polygons: Polygon[] = [];

        for (const type of this.types) {
            switch (type[0]) {
                case "rect":
                    {
                        const dims = type[2];
                        const offset = type[3];
                        const rotation = type[4];
                        polygons.push(new Polygon([
                            Vector.new(dims.x / 2, dims.y / 2),
                            Vector.new(dims.x / 2, -dims.y / 2),
                            Vector.new(-dims.x / 2, -dims.y / 2),
                            Vector.new(-dims.x / 2, dims.y / 2),
                        ]).rotate(rotation).translate(offset))
                    }
                    break;
                case "circle":
                    {
                        const diameter = type[2];
                        const offset = type[3];
                        const polygon = new Polygon([], true, diameter / 2);
                        polygon.center = offset.clone();
                        polygons.push(polygon);
                    }
                    break;
                case "polygon":
                    {
                        const points = type[2];
                        const offset = type[3];
                        const rotation = type[4];
                        const polygon = new Polygon(points.map(p => p.clone().rotate(rotation).add(offset)));
                        polygons.push(polygon);
                    }
                    break;
            }
        }

        return polygons;
    }

    inertia(mass: number): number {
        let amount = 0;

        const polygons = this.getPolygons();
        for (let i = 0; i < polygons.length; i++) {
            amount += polygons[i].inertia(mass * this.types[i][1]);
        }

        return amount;
    }
}
