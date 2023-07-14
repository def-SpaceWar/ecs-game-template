import { ctx } from "../systems/render_system";
import { Vector } from "./vector";

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

    let _mouseX = 0, _mouseY = 0;
    export const getMousePos = () => Vector.new(_mouseX, _mouseY);

    let _mouseDown = false;
    export const getMouseDown = () => _mouseDown;

    export const initMouse = () => {
        if (!hasInit) {
            document.addEventListener('mousemove', e => {
                const boundingRect = ctx.canvas.getBoundingClientRect();
                _mouseX = e.x - boundingRect.left;
                _mouseY = e.y - boundingRect.top;
            });

            document.addEventListener('mousedown', _ => {
                _mouseDown = true;
            });

            document.addEventListener('mouseup', _ => {
                _mouseDown = false;
            });
        }
    };
}
