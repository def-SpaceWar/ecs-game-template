import './style.css';
import { System, World } from './ecs';
import { HEIGHT, STARTING_SCENE, WIDTH } from './parameters';
import { createRenderSystem } from './systems/render_system';
import { Time } from './util/time';
import { createFpsSystem } from './systems/fps_system';
import { Input } from './util/input';
import { createTpsSystem } from './systems/tps_system';

onload = () => {
    World.setWorld(STARTING_SCENE);
    Input.initKeys();

    const globalRenderSystems: System[] = [
        Time.createRenderTickSystem(),
        createFpsSystem(25),
        createRenderSystem(WIDTH, HEIGHT)
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
