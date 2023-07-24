import { Bind, BindType } from "../components/bind";
import { World } from "../ecs";

export function createBindSystem(type: BindType) {
    return (world: World) => {
        for (const bind of world.findComponents(Bind)) {
            if (bind.type != type) continue;
            bind.binding(world);
        }
    };
}
