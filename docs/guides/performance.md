# Performance guide

## Rasterization

`FoldView` automatically rasterizes the cover face during the flip animation. This converts the React Native view into a hardware texture, which is much cheaper to animate than re-rendering the component tree on every frame.

You can control this manually via `FoldRef.rasterize`:

```tsx
// Cache the fold as a texture before expanding
await fold.rasterize(true);
await fold.expand();

// Free the texture after collapsing
await fold.rasterize(false);
```

## Perspective

The `perspective` prop controls the 3D depth of the fold animation. Higher values produce a subtler 3D effect; lower values produce a more dramatic fold.

```tsx
<FoldView perspective={500} /* more dramatic */ />
<FoldView perspective={2000} /* subtler */ />
```

Default is `1000`.

## Tips

- Keep `renderLoading` lightweight — it's measured during the first layout pass.
- Avoid deeply nested `FoldView`s inside a single `reveal` if the content is complex — each nested fold adds a layout pass.
- Use `rasterize(true)` for folds with heavy content (lists, images, maps) to avoid frame drops during animation.
