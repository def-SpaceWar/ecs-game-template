import { CameraController } from "../components/camera_controller";
import { Position } from "../components/position";
import { Tag } from "../components/tag";
import { World } from "../ecs";
import { Camera } from "../util/camera";
import { Time } from "../util/time";
import { Vector } from "../util/vector";

export function cameraSystem(world: World) {
    for (const camera of world.findComponents(CameraController)) {
        if (!Camera.mainCamera) Camera.mainCamera = camera;

        const avgPos = Vector.zero();
        let tagCount = 0;
        for (const tag of world.findComponents(Tag)) {
            if (tag.tag == camera.centerTag) {
                tagCount++;
                const position = world.getComponent(tag.entity, Position);
                if (position) {
                    avgPos.add(position.pos);
                }
            }
        }
        avgPos.scale(1 / tagCount);
        const lerpConstant = 1 - Math.pow(0.5, Time.renderDeltaTime * camera.lerpSpeed);
        camera.pos.scale(1 - lerpConstant).add(avgPos.scale(lerpConstant));
    }
}
