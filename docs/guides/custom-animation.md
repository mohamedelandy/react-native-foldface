# Custom animation

The `expand` and `collapse` props give you full control over fold animation orchestration. Each prop receives an array of registered `FoldRef`s.

## Sequential (default)

If you don't provide `expand` or `collapse`, folds animate one after another in registration order:

```tsx
<FoldView expanded={expanded} cover={Cover} reveal={Reveal}>
  <Base />
</FoldView>
```

## Parallel expansion

Expand all folds at once:

```tsx
const expand = async (foldViews: FoldRef[]) => {
  await Promise.all(foldViews.map((foldView) => foldView.expand()));
};

<FoldView expand={expand} /* ... */>/* ... */</FoldView>;
```

## Staggered animation

Add a delay between each fold:

```tsx
const expand = async (foldViews: FoldRef[]) => {
  for (const [index, foldView] of foldViews.entries()) {
    await new Promise((r) => setTimeout(r, index * 100));
    await foldView.expand();
  }
};
```

## Custom duration per fold

Control the duration of each fold independently:

```tsx
<FoldView
  flipDuration={400}
  expand={async (folds) => {
    await Promise.all(
      folds.map((fold) => Promise.all([
        fold.rasterize(true),
        fold.expand(),
      ]))
    );
  }}
  /* ... */
>
```

## `rasterize`

Call `fold.rasterize(true)` before expanding to cache the fold as a hardware texture. This avoids re-rendering complex content during the animation and improves performance on lower-end devices. Call `fold.rasterize(false)` after collapsing to free the texture.
