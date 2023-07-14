import { AnimationController } from "../components/animation_controller";
import { Name } from "../components/name";
import { World } from "../ecs";
import { Time } from "../util/time";
import { Vector } from "../util/vector";

export function animationSystem(world: World) {
    for (const animationController of world.findComponents(AnimationController)) {
        for (const animation of animationController.animations) {
            if (animation.name != animationController.currentAnimation) continue;

            animation.currentKeyframeLength -= Time.renderDeltaTime;
            if (animation.currentKeyframeLength <= 0) {
                animation.currentKeyframe += 1;

                if (animation.currentKeyframe >= animation.keyframes.length) {
                    animation.currentKeyframe = 0;
                }

                animation.currentKeyframeLength = animation.keyframes[animation.currentKeyframe].timeLength;
                animation.isUpdated = false;
            }

            const currentKeyframe = animation.keyframes[animation.currentKeyframe];
            const entity = animationController.entity;

            if (!animation.isUpdated && (!animation.isContinuous || !currentKeyframe.isRelative)) {
                for (const propertyMap of currentKeyframe.propertyMaps) {
                    const target = world.getComponent(propertyMap.Target, entity);

                    if (!target) {
                        throw new Error(
                            `${propertyMap.Target.name} not found on ` +
                            `${world.getComponent(Name, entity)?.name || "Unnamed"} ` +
                            `[${entity}]!`
                        );
                    }

                    if (currentKeyframe.isRelative) {
                        if ((target[propertyMap.key] as unknown) instanceof Vector) {
                            (target[propertyMap.key] as unknown as Vector)
                                .add(propertyMap.value as unknown as Vector);
                        } else {
                            target[propertyMap.key] += propertyMap.value;
                        }
                    } else {
                        target[propertyMap.key] = propertyMap.value;
                    }
                }

                animation.isUpdated = true;
            } else if (animation.isContinuous && currentKeyframe.isRelative) {
                for (const propertyMap of currentKeyframe.propertyMaps) {
                    const target = world.getComponent(propertyMap.Target, entity);

                    if (!target) {
                        throw new Error(
                            `${propertyMap.Target.name} not found on ` +
                            `${world.getComponent(Name, entity)?.name || "Unnamed"} ` +
                            `[${entity}]!`
                        );
                    }

                    if ((target[propertyMap.key] as unknown) instanceof Vector) {
                        (target[propertyMap.key] as unknown as Vector)
                            .add((propertyMap.value as unknown as Vector)
                                .clone()
                                .scale(Time.renderDeltaTime));
                    } else {
                        target[propertyMap.key] += propertyMap.value * Time.renderDeltaTime;
                    }
                }
            }
        }
    }
}
