# Nesting folds

Place `<FoldView>` components inside a `reveal` to build multi-section fold cascades. Nested folds are discovered automatically, and the root fold accounts for their heights and durations when expanding and collapsing.

## Basic nesting

```tsx
<FoldView expanded={expanded} cover={Cover} reveal={Reveal}>
  <Base />
</FoldView>
```

Where `Reveal` contains another `<FoldView>`:

```tsx
const Reveal = () => (
  <View>
    <FoldView expanded={innerExpanded} cover={InnerCover} reveal={InnerReveal}>
      <InnerContent />
    </FoldView>
  </View>
);
```

## How it works

When the root fold expands:

1. The root cover flips 0 → 180°.
2. The root calls `child.expand()` for each nested `FoldRef`.
3. Each child fold flips its own cover 0 → 180° in sequence.
4. The root receives `onAnimationEnd` with the **total** duration and height of the entire tree.

The same logic applies in reverse for `collapse`.

## Height behavior

- A fold's `reveal` wraps to its content height automatically.
- A tall reveal grows the fold; a short reveal stays at the base height.
- `getTreeRevealHeight()` returns the sum of all nested reveal heights, so rows below are pushed exactly as far as the content needs.
