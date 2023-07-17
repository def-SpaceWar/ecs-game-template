// --- Entity ------------------------------------------------------------------
/** 
 * An entity is represented by a unique ID.
 */
export type Entity = number;

/** 
 * Wraps an entity ID for easy modification of data related to it.
 */
class EntityWrapper {
    constructor(public entity: Entity, private world: World) { }
    /**
     * @param Type - The constructor/class of a Component.
     * @param args - The arguments for initializing the component.
     * @returns The entity wrapper back for more modification.
     */
    add<T extends any[]>(Type: ComponentConstructor<T>, ...args: T): this {
        this.world._addComponent(new Type(this.entity, ...args));
        return this;
    }
}

// --- Component ---------------------------------------------------------------
/**
 * All components link to an entity.
 */
export interface Component {
    entity: Entity
}

/**
 * Interface of the constructor of a component which must take an entity as its
 * first parameter.
 * 
 * @example ```typescript
 * export class MyComponent implements Component { ... } 
 * const componentConstructor: ComponentConstructor<any[]> = MyComponent;
 * ```
 */
export interface ComponentConstructor<T extends any[]> {
    new(entity: Entity, ...args: T): Component;
}

/**
 * Represents the type of a class of a Component.
 * 
 * @example ```typescript
 * export class MyComponent implements Component { ... } 
 * const componentClass: ComponentClass = MyComponent;
 * ```
 */
type ComponentClass = new (...args: any) => Component;

/**
 * Represents a component that doesn't take any parameters.
 * 
 * @example ```typescript
 * class Explosive extends UnitComponent { }
 * ...
 * this.createEntity()
 * ...
 * .add(Explosive)
 * ...
 * ```
 */
export abstract class UnitComponent {
    constructor(public entity: Entity) { }
}

export function isComponent<T extends Component>(
    component: Component,
    Type: new (...args: any[]) => T
): component is T {
    return component instanceof Type;
}

// --- System ------------------------------------------------------------------
export type System = (world: World) => void;

export abstract class World {
    private static currentWorld: World;

    static async setWorld(Type: new () => World) {
        this.currentWorld = new Type();
        await this.currentWorld.load();
        this.currentWorld.setup();
    }

    static getWorld() {
        return this.currentWorld;
    }

    constructor() { }
    async load(): Promise<void> { }
    abstract setup(): void;
    renderSystems: System[] = [];
    systems: System[] = [];

    private entityCount = 0;
    private destroyedEntities: Entity[] = [];

    createEntity() {
        if (this.destroyedEntities[0]) return new EntityWrapper(this.destroyedEntities.shift()!, this);
        return new EntityWrapper(this.entityCount++, this);
    }

    destroy(entity: Entity) {
        this.destroyedEntities.push(entity);
        for (let i = 0; i < this.components.length; i++) {
            if (this.components[i].entity != entity) continue;
            this.components.splice(i, 1);
        }
    }

    private components: Component[] = [];
    /** Only used in the EntityWrapper class:
     * DO NOT USE!
     */
    _addComponent(component: Component) {
        this.components.push(component);
    }

    *requireEntitiesAllOf(ComponentTypes: ComponentClass[]): Generator<Entity, void, unknown> {
        entityLoop: for (let e = 0; e < this.entityCount; e++) {
            for (const ComponentType of ComponentTypes) {
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

    requireEntitiesAllOfArray(ComponentTypes: ComponentClass[]): Entity[] {
        const entities: Entity[] = [];

        entityLoop: for (let e = 0; e < this.entityCount; e++) {
            for (const ComponentType of ComponentTypes) {
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

    *requireEntitiesAnyOf(ComponentTypes: ComponentClass[]): Generator<Entity, void, unknown> {
        entityLoop: for (let e = 0; e < this.entityCount; e++) {
            for (const ComponentType of ComponentTypes) {
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

    requireEntitiesAnyOfArray(ComponentTypes: ComponentClass[]): Entity[] {
        const entities: Entity[] = [];

        entityLoop: for (let e = 0; e < this.entityCount; e++) {
            for (const ComponentType of ComponentTypes) {
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

    getComponent<T extends Component>(
        Type: new (...args: any) => T,
        entity: Entity
    ): T | undefined {
        for (const component of this.components) {
            if (component.entity != entity) continue;
            if (!isComponent(component, Type)) continue;
            return component as T;
        }
    }

    *getComponents<T extends Component>(
        Type: new (...args: any) => T,
        entity: Entity
    ): Generator<T, void, unknown> {
        for (const component of this.components) {
            if (component.entity != entity) continue;
            if (isComponent(component, Type)) yield component;
        }
    }

    getComponentsArray<T extends Component>(
        Type: new (...args: any) => T,
        entity: Entity
    ): T[] {
        const comps: T[] = [];
        for (const component of this.components) {
            if (component.entity != entity) continue;
            if (isComponent(component, Type)) comps.push(component);
        }
        return comps;
    }

    *getComponentsOfTypes<T extends Component>(
        Types: (new (...args: any[]) => T)[],
        entity: Entity
    ): Generator<T, void, unknown> {
        for (const Type of Types) {
            for (const component of this.components) {
                if (component.entity != entity) continue;
                if (!isComponent(component, Type)) continue;
                yield component as T;
            }
        }
    }

    getComponentsOfTypesArray<T extends Component>(
        Types: (new (...args: any[]) => T)[],
        entity: Entity
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

    findComponent<T extends Component>(
        Type: new (...args: any) => T
    ): T | undefined {
        for (const component of this.components) {
            if (!isComponent(component, Type)) continue;
            return component as T;
        }
    }

    *findComponents<T extends Component>(
        Type: new (...args: any) => T
    ): Generator<T, void, unknown> {
        for (const component of this.components) {
            if (!isComponent(component, Type)) continue;
            yield component;
        }
    }

    findComponentsArray<T extends Component>(
        Type: new (...args: any) => T
    ): T[] {
        const comps: T[] = [];
        for (const component of this.components) {
            if (!isComponent(component, Type)) continue;
            comps.push(component);
        }
        return comps;
    }

    *findComponentsOfTypes<T extends Component>(
        Types: (new (...args: any[]) => T)[]
    ): Generator<T, void, unknown> {
        for (const component of this.components) {
            for (const Type of Types) {
                if (!isComponent(component, Type)) continue;
                yield component;
            }
        }
    }

    findComponentsOfTypesArray<T extends Component>(
        Types: (new (...args: any[]) => T)[]
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
}
