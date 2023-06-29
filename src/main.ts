import './style.css';
import { System, World } from './ecs';
import { HEIGHT, WIDTH } from './parameters';
import { createRenderSystem } from './systems/render_system';
import { Time } from './util/time';
import { createFpsSystem } from './systems/fps_system';
import { Input } from './util/input';
import { Game } from './game';

onload = () => {
    World.setWorld(Game);
    Input.initKeys();

    const globalSystems: System[] = [
        Time.createSystem(),
        createFpsSystem(25),
        createRenderSystem(WIDTH, HEIGHT)
    ];

    (function update() {
        for (const system of globalSystems) system(World.getWorld());
        for (const system of World.getWorld().systems) system(World.getWorld());
        requestAnimationFrame(update);
    })();
};
