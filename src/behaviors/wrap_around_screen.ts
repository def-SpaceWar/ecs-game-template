import { Position } from "../components/position";
import { UnitComponent, World } from "../ecs";
import { HEIGHT, WIDTH } from "../parameters";

export class WrapAroundScreen extends UnitComponent {}

export function wrapAroundScreenSystem(world: World) {
    const entities = world.requireEntitiesAllOf([
        WrapAroundScreen,
        Position,
    ]);

    for (const e of entities) {
        const position = world.getComponent(Position, e)!;

        if (position.pos.y > HEIGHT + 50) {
            position.pos.y -= HEIGHT + 100;
        }

        if (position.pos.y < -50) {
            position.pos.y += HEIGHT + 100;
        }

        if (position.pos.x > WIDTH + 50) {
            position.pos.x -= WIDTH + 100;
        }

        if (position.pos.x < -50) {
            position.pos.x += WIDTH + 100;
        }
    }
}
