import { CameraController } from "../components/camera_controller";
import { Entity, World } from "../ecs";

export namespace Camera {
    export let mainCamera: CameraController;

    export function setMainCamera(world: World, entity: Entity) {
        mainCamera = world.getComponent(CameraController, entity)!;
    }

    export function getCoords(): [number, number] {
        return mainCamera.pos.tuple();
    }
}
