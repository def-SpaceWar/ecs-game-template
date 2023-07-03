import { CameraController } from "../components/camera_controller";
import { Position } from "../components/position";
import { Tag } from "../components/tag";
import { World } from "../ecs";
import { Camera } from "../util/camera";
import { Time } from "../util/time";
import { Vector } from "../util/vector";

export function cameraControllerSystem(world: World) {
    const cameras = world.findComponents(CameraController);
    if (!Camera.mainCamera) Camera.mainCamera = cameras[0];

    const tags = world.findComponents(Tag);
    for (const camera of cameras) {
        const avgPos = Vector.zero();
        let tagCount = 0;
        for (const tag of tags) {
            if (tag.tag == camera.centerTag) {
                tagCount++;
                const position = world.getComponent(Position, tag.entity);
                if (position) {
                    avgPos.add(position.pos);
                }
            }
        }
        avgPos.scale(1 / tagCount);
        const lerpConstant = 1 - Math.pow(0.5, Time.renderDeltaTime * camera.lerpSpeed)
        camera.pos.scale(1 - lerpConstant).add(avgPos.scale(lerpConstant));
    }
}
