import { Game } from "./worlds/game";

/**
 * @description The width of the canvas.
 */
export const WIDTH = 800;

/**
 * @description The height of the canvas.
 */
export const HEIGHT = 800;

/**
 * @description Should the canvas fill the screen.
 */
export const IS_DYNAMIC_SIZE = false;

/**
 * @description The scene that will be loaded on startup.
 */
export const STARTING_SCENE = Game;

/**
 * @description Only used for calculating inertia.
 */
export const CIRCLE_POINTS = 60;
