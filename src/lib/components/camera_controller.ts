import { Component, Entity } from "../ecs";
import { Vector } from "../util/vector";

export class CameraController implements Component {
    constructor(
        public entity: Entity,
        public pos: Vector = Vector.zero(),
        public centerTag: string = "camera_center",
        public lerpSpeed: number = 5
    ) { }
}
