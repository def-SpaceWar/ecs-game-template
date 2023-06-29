// --- Entity ------------------------------------------------------------------
export type Entity = number;

class EntityWrapper {
    constructor(public entity: Entity, private world: World) { }
    add<T extends any[]>(Type: ComponentConstructor<T>, ...args: T) {
        this.world.addComponent(new Type(this.entity, ...args));
        return this;
    }
}

// --- Component ---------------------------------------------------------------
export interface Component {
    entity: Entity
}

export interface ComponentConstructor<T extends any[]> {
    new(entity: Entity, ...args: T): Component;
}

type ComponentClass = new (...args: any) => Component;

export function isComponent<T extends Component>(
    component: Component,
    Type: new (...args: any[]) => T
): component is T {
    return component instanceof Type;
}

export abstract class UnitComponent {
    constructor(public entity: Entity) { }
}

// --- System ------------------------------------------------------------------
export type System = (world: World) => void;

export abstract class World {
    private static currentWorld: World;
    static cache = new Map<Entity, Map<new(...args: any[]) => Component, Component>>();
    static cacheLists = new Map<Entity, Map<new(...args: any[]) => Component, Component[]>>();

    static setWorld(Type: new () => World) {
        this.cache = new Map<Entity, Map<new(...args: any[]) => Component, Component>>();
        this.cacheLists = new Map<Entity, Map<new(...args: any[]) => Component, Component[]>>();
        this.currentWorld = new Type();
    }

    static getWorld() {
        return this.currentWorld;
    }

    constructor() { this.setup() }
    abstract setup(): void;
    systems: System[] = [];

    private entityCount = 0;
    protected createEntity() {
        World.cache.set(this.entityCount, new Map<new(...args: any[]) => Component, Component>());
        World.cacheLists.set(this.entityCount, new Map<new(...args: any[]) => Component, Component[]>());
        return new EntityWrapper(this.entityCount++, this);
    }

    private components: Component[] = [];
    addComponent(component: Component) {
        this.components.push(component);
    }

    requireEntitiesAllOf(ComponentTypes: ComponentClass[]): Entity[] {
        const entities: Entity[] = [];
        for (let e = 0; e < this.entityCount; e++) entities.push(e);

        for (const ComponentType of ComponentTypes) {
            for (let i = 0; i < entities.length; i++) {
                const e = entities[i];
                let isSufficient = false;
                for (const component of this.components) {
                    if (component.entity != e) continue;
                    isSufficient = isSufficient || component instanceof ComponentType;
                }
                if (isSufficient) continue;
                entities.splice(i, 1);
                i--;
            }
        }

        return entities;
    }

    requireEntitiesAnyOf(ComponentTypes: ComponentClass[]): Entity[] {
        const entities: Entity[] = [];
        for (let e = 0; e < this.entityCount; e++) entities.push(e);

        for (let i = 0; i < entities.length; i++) {
            const e = entities[i];
            let isSufficient = false;
            for (const ComponentType of ComponentTypes) {
                for (const component of this.components) {
                    if (component.entity != e) continue;
                    isSufficient = isSufficient || component instanceof ComponentType;
                }
                if (isSufficient) continue;
                entities.splice(i, 1);
                i--;
            }
        }

        return entities;
    }

    getComponent<T extends Component>(
        Type: new (...args: any) => T,
        entity: Entity
    ): T | undefined {
        const cachedResult = World.cache.get(entity)!.get(Type)! as T;
        if (cachedResult) return cachedResult;

        for (const component of this.components) {
            if (component.entity != entity) continue;
            if (!isComponent(component, Type)) continue;
            World.cache.get(entity)!.set(Type, component);
            return component as T;
        }
    }

    getComponents<T extends Component>(
        Type: new (...args: any) => T,
        entity: Entity
    ): T[] {
        const cachedResult = World.cacheLists.get(entity)!.get(Type)! as T[];
        if (cachedResult) return cachedResult;

        const comps: T[] = [];
        for (const component of this.components) {
            if (component.entity != entity) continue;
            if (isComponent(component, Type)) comps.push(component);
        }
        World.cacheLists.get(entity)!.set(Type, comps);
        return comps;
    }

    getComponentsOfTypes<T extends Component>(
        Types: (new (...args: any[]) => T)[],
        entity: Entity
    ): T[] {
        const comps: T[] = [];
        for (const component of this.components) {
            for (const Type of Types) {
                if (component.entity != entity) continue;
                if (isComponent(component, Type)) comps.push(component as T);
            }
        }
        return comps;
    }

    findComponent<T extends Component>(
        Type: new (...args: any) => T
    ): T | undefined {
        for (const component of this.components) {
            if (isComponent(component, Type)) return component as T;
        }
    }

    findComponents<T extends Component>(
        Type: new (...args: any) => T
    ): T[] {
        const comps: T[] = [];
        for (const component of this.components) {
            if (isComponent(component, Type)) comps.push(component);
        }
        return comps;
    }

    findComponentsOfTypes<T extends Component>(
        Types: (new (...args: any[]) => T)[]
    ): T[] {
        const comps: T[] = [];
        for (const component of this.components) {
            for (const Type of Types) {
                if (isComponent(component, Type)) comps.push(component as T);
            }
        }
        return comps;
    }
}
