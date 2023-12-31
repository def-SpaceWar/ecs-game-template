import "./style.css";
import { System, World } from "./lib/ecs";
import { IS_DYNAMIC_SIZE, HEIGHT, STARTING_SCENE, WIDTH } from "./parameters";
import { createRenderSystem } from "./lib/systems/render_system";
import { Time } from "./lib/util/time";
import { createDebugFpsSystem } from "./lib/systems/debug_fps_system";
import { Input } from "./lib/util/input";
import { createDebugTpsSystem } from "./lib/systems/debug_tps_system";
import { cameraSystem } from "./lib/systems/camera_system";
import { createBindSystem } from "./lib/systems/bind_system";

onload = async () => {
    await World.setWorld(STARTING_SCENE);

    const globalRenderSystems: System[] = [
        Time.createRenderTickSystem(),
        cameraSystem,
        createDebugFpsSystem(25),
        createBindSystem("render"),
        createRenderSystem(WIDTH, HEIGHT, IS_DYNAMIC_SIZE)
    ];

    Input.initKeys();
    Input.initMouse();

    (function render() {
        const currentWorld = World.getWorld();
        for (const system of globalRenderSystems) system(currentWorld);
        for (const system of World.getWorld().renderSystems) system(currentWorld);
        requestAnimationFrame(render);
    })();

    const globalSystems: System[] = [
        Time.createTickSystem(),
        createDebugTpsSystem(100),
        createBindSystem("tick"),
    ];

    setInterval(() => {
        const currentWorld = World.getWorld();
        for (const system of globalSystems) system(currentWorld);
        for (const system of World.getWorld().systems) system(currentWorld);
    }, 0);
};
