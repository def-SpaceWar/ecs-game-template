import { System } from "../ecs";
import { Time } from "../util/time";

export function createFpsSystem(sampleSize: number): System {
    const fpsText = document.getElementById('app')!.appendChild(
        document.createElement('p')
    );
    fpsText.id = "fps";

    const fpsCounts: number[] = [];
    const average = () => {
        if (fpsCounts.length > sampleSize) fpsCounts.shift();
        const total = fpsCounts.reduce((p, v) => v + p, 0);
        return Math.floor(total / fpsCounts.length);
    },
        max = () => Math.floor(Math.max(...fpsCounts)),
        min = () => Math.floor(Math.min(...fpsCounts));

    return () => {
        fpsCounts.push(1 / Time.renderDeltaTime);
        fpsText.innerText = `FPS: ${average()}; [${min()}, ${max()}]`;
    };
}
