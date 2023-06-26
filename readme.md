# p0006 - gravity gallery

- [Live demo](https://.vercel.app/)

## Description

Simple gallery with gravity effect.

## Tech used

- [Framer Motion](https://www.framer.com/motion/) - animations
- [rapier.rs (wasm)](https://rapier.rs/) - physics engine
- [React Router](https://reactrouter.com/en/main) - routing
- [Radix UI](https://www.radix-ui.com/) primitives - modal, portal, `Slot` component
- [Vite] - bundler
- [Tailwind CSS](https://tailwindcss.com/)- styling
- Images from [Unsplash](https://unsplash.com/)

## More

### `<Physics>`

Handles loading rapier.rs, world initalization, updating motion values of all `<RigidBody>`s and serves as
`PhysicsContext` provider. Rapier.rs is loaded asynchronously using `useAsset` meaning it works with React Suspense.

```tsx
<Suspense fallback={<Loading />}>
  <Physics gravity={{ x: 0, y: -200 }}>{/* ... */}</Physics>
</Suspense>
```

### `<RigidBody>`

Adds rigid body and collider to physics world. It's also a wrapper for `<motion.div>` component, but accepts `asChild` prop (using Radix UI `Slot` component), so transfroms are applied to the child (which needs to be `motion` component - checked at runtime by `RigidBody` component)

`<RigidBody>` is added to physics world on mount and removed on unmount. But this can controlled externally via ref. Which is useful when DOM element (children of `<RigidBody>`) coresponding to rigid body is loading (it' size will change after loading) - in this case rigid body should be added to physics world after loading.

```tsx
const rigidBodyRef = useRef(null);

return (
  <RigidBody asChild ref={rigidBodyRef}>
    <motion.img
      class="w-[40%]"
      onLoad={() => rigidBodyRef.current?.initialize()}
    />
  </RigidBody>
);
```
