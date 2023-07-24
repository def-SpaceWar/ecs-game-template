import { Bind, BindType } from "./components/bind";
import { Name } from "./components/name";

// --- Entity ------------------------------------------------------------------

/** 
 * @description An entity is represented by a unique ID.
 */
export type Entity = number;

/** 
 * @description Wraps an entity ID for easy modification of data related to it.
 */
class EntityWrapper {
    /**
     * @description Not to be accessible to the user.
     */
    constructor(public entity: Entity, private world: World) { }

    /**
     * @deprecated
     * @description Adds a component with the id of the wrapped entity.
     * @param Type The constructor/class of a Component.
     * @param args The arguments for initializing the component.
     * @returns The entity wrapper back for more modification.
     * @example ```ts
     * this.createEntity().add(Position, Vector.new(100, 100));
     * ```
     */
    add<T extends unknown[]>(Type: ComponentConstructor<T>, ...args: T): this {
        this.world._addComponent(new Type(this.entity, ...args));
        return this;
    }

    /**
     * @description Takes a function that takes in an entity, and returns a
     * component, to add a component to the current entity. The reasons is for
     * better intellisense when using parameters in a component. It can be also 
     * used to add repeated component values and dynamically add components.
     * @param component A function that takes an entity and returns 1 or a list
     * of components.
     * @returns The entity wrapper back for more modification.
     * @example ```ts
     * const customCoords = e => new Position(e, Vector.new(100, 100));
     * this.createEntity().$(customCoords);
     * ```
     * @example ```ts
     * const customCoords2 = e => [new Position(e, Vector.new(100, 100))];
     * this.createEntity().$(customCoords2);
     * ```
     */
    $(generateComponents: (e: Entity) => Component): this;
    $(generateComponents: (e: Entity) => Component[]): this;
    $(
        generateComponents: (e: Entity) => Component | Component[]
    ): this {
        const result = generateComponents(this.entity);
        if (Array.isArray(result)) {
            for (const component of result as Component[]) {
                this.world._addComponent(component);
            }
        } else {
            this.world._addComponent(result as Component);
        }
        return this;
    }

    bind(generateBinding: (e: Entity) => System, type: BindType = "tick"): EntityWrapper {
        return this.$(e =>
            new Bind(e, generateBinding(e), type)
        );
    }
}

// --- Component ---------------------------------------------------------------

/**
 * @description All components link to an entity.
 */
export interface Component {
    /**
     * @description The entity ID this component is linked to. Usually provided
     * by an entity wrapper.
     */
    entity: Entity
}

/**
 * @description Interface of the constructor of a component which must take an entity as its
 * first parameter.
 */
export interface ComponentConstructor<T extends unknown[]> {
    new(entity: Entity, ...args: T): Component;
}

/**
 * @description Represents the type of a class of a Component.
 */
type ComponentClass = new (...args: never[]) => Component;

/**
 * @description Represents the base of a component that doesn't take any parameters.
 * @example ```typescript
 * class Explosive extends UnitComponent { }
 * ```
 */
export abstract class UnitComponent {
    constructor(public entity: Entity) { }
}

/** 
 * @description Checks whether or not a Component is an instance of a component constructor.
 */
export function isComponent<T extends Component>(
    component: Component,
    Type: new (...args: never[]) => T
): component is T {
    return component instanceof Type;
}

// --- System ------------------------------------------------------------------

/**
 * @description The type alias of a system.
 */
export type System = (world: World) => void;

/**
 * @description A namespace and a class that holds data about the current world
 * that is running.
 */
export abstract class World {
    /**
     * @description The current world that is being ran.
     */
    private static currentWorld: World;

    /**
     * @description Sets the current world.
     * @param Type A closs that extends World.
     */
    static async setWorld(Type: new () => World) {
        this.currentWorld = new Type();
        await this.currentWorld.load();
        this.currentWorld.setup();
    }

    /**
     * @returns The current world that is running.
     */
    static getWorld(): World {
        return this.currentWorld;
    }

    /**
     * @description Not to be called or modified by any child class.
     */
    constructor() { }

    /**
     * @description Runs before `this.setup` and is meant for loading assets
     * like images or audio.
     */
    async load(): Promise<void> { }

    /**
     * @description Contains all the systems that will run on the render loop 
     * of the current world after the global render systems.
     */
    renderSystems: System[] = [];

    /**
     * @description Contains all the systems that will run on the current world 
     * after the global systems.
     */
    systems: System[] = [];

    /**
     * @description Add all of the entities to the world.
     */
    abstract setup(): void;

    /**
     * @description The maximum amount of entities in the world. It isn't
     * constant, it increases every time an entity is added, but doesn't
     * decrease any time an entity is destroyed.
     */
    private entitySize = 0;

    /**
     * @description Holds a list of entities that are destroyed and have no 
     * components attached to them. Used to reassigned deleted entities ID's.
     */
    private destroyedEntities: Entity[] = [];

    /**
     * @description Creates an entity ID that is free and wraps it in a 
     * user-friendly wrapper for easy modification.
     * 
     * @returns A user friendly wrapper of the entity ID.
     */
    createEntity(): EntityWrapper {
        return this.destroyedEntities[0]
            ? new EntityWrapper(this.destroyedEntities.shift()!, this)
            : new EntityWrapper(this.entitySize++, this);
    }

    /**
     * @returns A generator of all active entities.
     */
    *getEntities(): Generator<number, void, unknown> {
        for (let e = 0; e < this.entitySize; e++) {
            if (this.destroyedEntities.indexOf(e) != -1) continue;
            yield e;
        }
    }

    /**
     * @description Destroys an entity and its components by its ID.
     * 
     * @param entity The ID of the entity to destroy along with its 
     * components.
     */
    destroy(entity: Entity): void {
        this.destroyedEntities.push(entity);
        for (let i = 0; i < this.components.length; i++) {
            if (this.components[i].entity != entity) continue;
            this.components.splice(i, 1);
        }
    }

    /**
     * @description A list of all the components in the world.
     */
    private components: Component[] = [];

    /** 
     * @description ***Only used in the EntityWrapper class! DO NOT USE UNLESS 
     * YOU KNOW WHAT YOU ARE DOING!***
     * 
     * @param component Component to add to the world.
     */
    _addComponent(component: Component): void {
        this.components.push(component);
    }

    /**
     * @description Queries all the entities.
     * @param componentTypes All the component classes that must be on an 
     * entity.
     * @returns A generator of entities that satisfies the component 
     * requirements.
     */
    *requireEntitiesAllOf(...componentTypes: ComponentClass[]): Generator<Entity, void, unknown> {
        entityLoop: for (const e of this.getEntities()) {
            for (const ComponentType of componentTypes) {
                let hasComponent = false;
                for (const component of this.components) {
                    if (component.entity != e) continue;
                    hasComponent = hasComponent || isComponent(component, ComponentType);
                }
                if (!hasComponent) continue entityLoop;
            }
            yield e;
        }
    }

    /**
     * @description Queries all the entities.
     * @param componentTypes All the component classes that must be on an 
     * entity.
     * @returns A list of entities that satisfies the component requirements.
     */
    requireEntitiesAllOfArray(...componentTypes: ComponentClass[]): Entity[] {
        const entities: Entity[] = [];

        entityLoop: for (const e of this.getEntities()) {
            for (const ComponentType of componentTypes) {
                let hasComponent = false;
                for (const component of this.components) {
                    if (component.entity != e) continue;
                    hasComponent = hasComponent || isComponent(component, ComponentType);
                }
                if (!hasComponent) continue entityLoop;
            }
            entities.push(e);
        }

        return entities;
    }

    /**
     * @description Queries all the entities.
     * @param componentTypes All of the component classes that an entity must
     * one or more of.
     * @returns A generator of entities that satisfies the component 
     * requirements.
     */
    *requireEntitiesAnyOf(...componentTypes: ComponentClass[]): Generator<Entity, void, unknown> {
        entityLoop: for (const e of this.getEntities()) {
            for (const ComponentType of componentTypes) {
                let hasComponent = false;
                for (const component of this.components) {
                    if (component.entity != e) continue;
                    hasComponent = hasComponent || isComponent(component, ComponentType);
                }
                if (!hasComponent) continue;
                yield e;
                continue entityLoop;
            }
        }
    }

    /**
     * @description Queries all the entities.
     * @param componentTypes All of the component classes that an entity must
     * one or more of.
     * @returns A list of entities that satisfies the component requirements.
     */
    requireEntitiesAnyOfArray(...componentTypes: ComponentClass[]): Entity[] {
        const entities: Entity[] = [];

        entityLoop: for (const e of this.getEntities()) {
            for (const ComponentType of componentTypes) {
                let hasComponent = false;
                for (const component of this.components) {
                    if (component.entity != e) continue;
                    hasComponent = hasComponent || isComponent(component, ComponentType);
                }
                if (!hasComponent) continue;
                entities.push(e);
                continue entityLoop;
            }
        }

        return entities;
    }

    /**
     * @description Gets a component from an entity.
     * @param entity The ID of an entity to request a component from.
     * @param Type The component class of the component to get.
     * @returns The first component that points to the entity that is an
     * instance of the component class provided.
     */
    getComponent<T extends Component>(
        entity: Entity,
        Type: new (...args: never[]) => T
    ): T | undefined {
        for (const component of this.components) {
            if (component.entity != entity) continue;
            if (!isComponent(component, Type)) continue;
            return component as T;
        }
    }

    /**
     * @description Gets a components from an entity.
     * @param entity The ID of an entity to request a component from.
     * @param Type The component class of the components to get.
     * @returns A generator that has all the components that are instances
     * of the component class and point to the entity's ID.
     */
    *getComponents<T extends Component>(
        entity: Entity,
        Type: new (...args: never[]) => T
    ): Generator<T, void, unknown> {
        for (const component of this.components) {
            if (component.entity != entity) continue;
            if (isComponent(component, Type)) yield component;
        }
    }

    /**
     * @description Gets a components from an entity.
     * @param entity The ID of an entity to request a component from.
     * @param Type The component class of the components to get.
     * @returns A list that has all the components that are instances of the 
     * component class and point to the entity's ID.
     */
    getComponentsArray<T extends Component>(
        entity: Entity,
        Type: new (...args: never[]) => T
    ): T[] {
        const comps: T[] = [];
        for (const component of this.components) {
            if (component.entity != entity) continue;
            if (isComponent(component, Type)) comps.push(component);
        }
        return comps;
    }

    /**
     * @description Gets a components of different types from an entity.
     * @param entity The ID of an entity to request a component from.
     * @param Types The component classes of the components to get.
     * @returns A generator that has all the components that are instances
     * of the component classes and point to the entity's ID.
     */
    *getComponentsOfTypes<T extends Component>(
        entity: Entity,
        ...Types: (new (...args: never[]) => T)[]
    ): Generator<T, void, unknown> {
        for (const Type of Types) {
            for (const component of this.components) {
                if (component.entity != entity) continue;
                if (!isComponent(component, Type)) continue;
                yield component as T;
            }
        }
    }

    /**
     * @description Gets a components of different types from an entity.
     * @param entity The ID of an entity to request a component from.
     * @param Types The component classes of the components to get.
     * @returns A list that has all the components that are instances of the
     * component classes and point to the entity's ID.
     */
    getComponentsOfTypesArray<T extends Component>(
        entity: Entity,
        ...Types: (new (...args: never[]) => T)[]
    ): T[] {
        const comps: T[] = [];
        for (const Type of Types) {
            for (const component of this.components) {
                if (component.entity != entity) continue;
                if (!isComponent(component, Type)) continue;
                comps.push(component as T);
            }
        }
        return comps;
    }

    /**
     * @description Finds a component in the world.
     * @param Type The component class of the component to find.
     * @returns The first component that is an instance of the component class.
     */
    findComponent<T extends Component>(
        Type: new (...args: never[]) => T
    ): T | undefined {
        for (const component of this.components) {
            if (!isComponent(component, Type)) continue;
            return component as T;
        }
    }

    /**
     * @description Finds components in the world.
     * @param Type The component class of the components to find.
     * @returns A generator of components that are instances of the component 
     * class.
     */
    *findComponents<T extends Component>(
        Type: new (...args: never[]) => T
    ): Generator<T, void, unknown> {
        for (const component of this.components) {
            if (!isComponent(component, Type)) continue;
            yield component;
        }
    }

    /**
     * @description Finds components in the world.
     * @param Type The component class of the components to find.
     * @returns A list of components that are instances of the component class.
     */
    findComponentsArray<T extends Component>(
        Type: new (...args: never[]) => T
    ): T[] {
        const comps: T[] = [];
        for (const component of this.components) {
            if (!isComponent(component, Type)) continue;
            comps.push(component);
        }
        return comps;
    }

    /**
     * @description Finds components of different types in the world.
     * @param Types The component classes of the components to find.
     * @returns A generator of components that are instances of the component
     * classes.
     */
    *findComponentsOfTypes<T extends Component>(
        Types: (new (...args: never[]) => T)[]
    ): Generator<T, void, unknown> {
        for (const component of this.components) {
            for (const Type of Types) {
                if (!isComponent(component, Type)) continue;
                yield component;
            }
        }
    }

    /**
     * @description Finds components of different types in the world.
     * @param Types The component classes of the components to find.
     * @returns A list of components that are instances of the component
     * classes.
     */
    findComponentsOfTypesArray<T extends Component>(
        Types: (new (...args: never[]) => T)[]
    ): T[] {
        const comps: T[] = [];
        for (const component of this.components) {
            for (const Type of Types) {
                if (!isComponent(component, Type)) continue;
                comps.push(component);
            }
        }
        return comps;
    }

    /**
     * @description Gets the name of an entity.
     * @param entity The ID of the entity.
     * @returns The name of the entity provided by the Name component or 
     * "unnamed" if no name is found.
     */
    getName(
        entity: Entity
    ): string {
        const name = this.getComponent(entity, Name);
        return name
            ? name.name
            : "unnamed";
    }
}
