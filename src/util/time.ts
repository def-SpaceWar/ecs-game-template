export class Time {
    private static _deltaTime = 0;
    private static _renderDeltaTime = 0;

    static get deltaTime() {
        return Math.max(
            Math.min(
                this._deltaTime,
                0.01
            ),
            0.001
        );
    }

    static get rawDeltaTime() {
        return this._deltaTime;
    }

    static get renderDeltaTime() {
        return this._renderDeltaTime;
    }

    static createTickSystem() {
        let before = performance.now();
        let now = performance.now();
        return () => {
            now = performance.now();
            this._deltaTime = (now - before) / 1_000;
            before = now;
        };
    }

    static createRenderTickSystem() {
        let before = performance.now();
        let now = performance.now();
        return () => {
            now = performance.now();
            this._renderDeltaTime = (now - before) / 1_000;
            before = now;
        };
    }
}
