import './style.css';
import { System, World } from './lib/ecs';
import { IS_DYNAMIC_SIZE, HEIGHT, STARTING_SCENE, WIDTH } from './parameters';
import { createRenderSystem } from './lib/systems/render_system';
import { Time } from './lib/util/time';
import { createFpsSystem } from './lib/systems/fps_system';
import { Input } from './lib/util/input';
import { createTpsSystem } from './lib/systems/tps_system';
import { cameraControllerSystem } from './lib/systems/camera_controller_system';

onload = async () => {
    await World.setWorld(STARTING_SCENE);
    Input.initKeys();

    const globalRenderSystems: System[] = [
        Time.createRenderTickSystem(),
        cameraControllerSystem,
        createFpsSystem(25),
        createRenderSystem(WIDTH, HEIGHT, IS_DYNAMIC_SIZE)
    ];

    (function render() {
        for (const system of globalRenderSystems) system(World.getWorld());
        for (const system of World.getWorld().renderSystems) system(World.getWorld());
        requestAnimationFrame(render);
    })();

    const globalSystems: System[] = [
        Time.createTickSystem(),
        createTpsSystem(100)
    ];

    setInterval(() => {
        for (const system of globalSystems) system(World.getWorld());
        for (const system of World.getWorld().systems) system(World.getWorld());
    }, 0);
};
