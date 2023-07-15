import { CameraController } from "../components/camera_controller";
import { ctx } from "../systems/render_system";

export namespace Camera {
    export let mainCamera: CameraController;

    export function getCoords(): [number, number] {
        return mainCamera
            ? mainCamera.pos.tuple()
            : [ctx.canvas.width / 2, ctx.canvas.height / 2];
    }
}
