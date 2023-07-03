export namespace Input {
    export const keys: string[] = [];
    let hasInit = false;

    export const initKeys = () => {
        if (!hasInit) {
            document.addEventListener('keydown', e => {
                if (keys.indexOf(e.key) != -1) return;
                keys.push(e.key);
            });

            document.addEventListener('keyup', (e) => {
                const i = keys.indexOf(e.key);
                if (i == -1) return;
                keys.splice(i, 1);
            });
        }
    };

    export const getKey = (k: string) => {
        if (keys.indexOf(k) != -1) return true;
        return false;
    };
}
