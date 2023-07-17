# TODO

- Documentation!!!
    - lib (Only folder that needs documentation)
        - ecs.ts << In Progress >>
        - components
            - ...
        - systems
            - ...
        - util
            - ...

```typescript
EntityWrapper.bind((e: Entity) => (world: World) => void): EntityWrapper;
```
- Bind!
    - EntityWrapper.bindRender((e: Entity) => (world: World) => void)
    - Use it to do some quick stuff! (Save a bind as a Bind or BindRender component)
    - bindSystem, bindRenderSystem

- UI Elements (Input.mouseX,Y,Input.mouseDown,Input.mouseUp)
    - This will be almost as complicated as the physics engine.
    - Example: Button
        - Components: Button {onClick: () => void}, ButtonRectangleCollider, ButtonCircleCollider, ButtonPolygonCollider, (Buttons can have multiple collider components!)
            - Use regular render components to render.
        - System(s): buttonSystem

- Event System
    - Events and listeners, but not from the DOM!
        - Works hand in hand with buttons

- Sprite Sheet Support
    - SpriteSheet component
    - spriteSheetRenderSystem that updates Sprite based on SpriteSheet
    - Obviously animations will work fine with this

- Entity destruction handling
    - Lifetime component and Lifetime system so users don't have to make it.

- Directional colliders (collide from only up not down etc.)

- Constraints (like axels, and stuff rubber bands that hold stuff together)

## FAR FUTURE

- Make this an npm package
- WEBGL instead of 2D Canvas
- WASM: probably Rust
