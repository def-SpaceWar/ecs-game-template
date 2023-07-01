import { System } from "../ecs";
import { Time } from "../util/time";

export function createTpsSystem(sampleSize: number): System {
    const tpsText = document.getElementById('app')!.appendChild(
        document.createElement('p')
    );
    tpsText.id = "tps";

    const tpsCounts: number[] = [];
    const average = () => {
        if (tpsCounts.length > sampleSize) tpsCounts.shift();
        const total = tpsCounts.reduce((p, v) => v + p, 0);
        return Math.floor(total / tpsCounts.length);
    },
        max = () => Math.floor(Math.max(...tpsCounts)),
        min = () => Math.floor(Math.min(...tpsCounts));

    return () => {
        tpsCounts.push(1 / Time.deltaTime);
        tpsText.innerText = `TPS: ${average()}; [${min()}, ${max()}]`;
    };
}
