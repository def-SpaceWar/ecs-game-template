import { AnimationController } from "../components/animation_controller";
import { Name } from "../components/name";
import { World } from "../ecs";
import { Time } from "../util/time";
import { Vector } from "../util/vector";

export function animationSystem(world: World) {
    for (const animationController of world.findComponents(AnimationController)) {
        for (const animation of animationController.animations) {
            if (animation.name != animationController.currentAnimation) continue;

            if (animation.currentKeyframeLength < 0) {
                animation.currentKeyframe += 1;

                if (animation.currentKeyframe >= animation.keyframes.length) {
                    animation.currentKeyframe = 0;
                }

                animation.currentKeyframeLength = animation.keyframes[animation.currentKeyframe].timeLength;
                animation.isUpdated = false;
            }

            const currentKeyframe = animation.keyframes[animation.currentKeyframe];
            const entity = animationController.entity;

            if (!animation.isUpdated && (!currentKeyframe.isContinuous || !currentKeyframe.isRelative)) {
                for (const propertyMap of currentKeyframe.propertyMaps) {
                    if (!propertyMap.target) propertyMap.target = world.getComponent(propertyMap.Target, entity);

                    if (!propertyMap.target) {
                        throw new Error(
                            `${propertyMap.Target.name} not found on ` +
                            `${world.getComponent(Name, entity)?.name || "Unnamed"} ` +
                            `[${entity}]!`
                        );
                    }

                    if (currentKeyframe.isRelative) {
                        if ((propertyMap.target[propertyMap.key] as unknown) instanceof Vector) {
                            (propertyMap.target[propertyMap.key] as unknown as Vector)
                                .add(propertyMap.value as unknown as Vector);
                        } else {
                            propertyMap.target[propertyMap.key] += propertyMap.value;
                        }
                    } else {
                        if ((propertyMap.target[propertyMap.key] as unknown) instanceof Vector) {
                            (propertyMap.target[propertyMap.key] as unknown as Vector) =
                                (propertyMap.value as unknown as Vector).clone();
                        } else {
                            propertyMap.target[propertyMap.key] = propertyMap.value;
                        }
                    }
                }

                animation.isUpdated = true;
            } else if (currentKeyframe.isContinuous && currentKeyframe.isRelative) {
                const properRenderTime = Math.max(
                    animation.currentKeyframeLength - Time.renderDeltaTime,
                    0
                );
                for (const propertyMap of currentKeyframe.propertyMaps) {
                    if (!propertyMap.target) propertyMap.target = world.getComponent(propertyMap.Target, entity);

                    if (!propertyMap.target) {
                        throw new Error(
                            `${propertyMap.Target.name} not found on ` +
                            `${world.getComponent(Name, entity)?.name || "Unnamed"} ` +
                            `[${entity}]!`
                        );
                    }

                    if ((propertyMap.target[propertyMap.key] as unknown) instanceof Vector) {
                        (propertyMap.target[propertyMap.key] as unknown as Vector)
                            .add((propertyMap.value as unknown as Vector)
                                .clone()
                                .scale(properRenderTime));
                    } else {
                        propertyMap.target[propertyMap.key] += propertyMap.value * properRenderTime;
                    }
                }
            }

            animation.currentKeyframeLength -= Time.renderDeltaTime;
        }
    }
}
