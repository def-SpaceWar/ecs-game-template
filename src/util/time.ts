export class Time {
    private static _deltaTime = 0;

    static get deltaTime() {
        return Math.max(
            Math.min(
                this._deltaTime,
                0.05
            ),
            0.001
        );
    }

    static get rawDeltaTime() {
        return this._deltaTime;
    }

    private static before: number;
    private static now: number;
    static {
        this.before = performance.now();
        this.now = performance.now();
    }
    static createSystem() {
        return () => {
            this.now = performance.now();
            this._deltaTime = (this.now - this.before) / 1_000;
            this.before = this.now;
        };
    }
}
