# react-native-foldface docs

A `FoldView` component for React Native that renders a folding card animation — a `cover` face folds open to reveal a `reveal` face underneath. Built with Reanimated 4 and `react-native-worklets`.

## Contents

- [API reference](./api.md) — full `FoldViewProps`, `FoldRef`, and root-only props
- [Nesting guide](./guides/nesting.md) — multi-section fold cascades
- [Custom animation guide](./guides/custom-animation.md) — `expand` / `collapse` orchestration
- [Performance guide](./guides/performance.md) — `rasterize`, `perspective`, and texture caching
- [Migration from react-native-foldview](./migration.md) — coming from the original library

## Quick install

```sh
npm install react-native-foldface
```

## Minimum requirements

- React Native `>= 0.85`
- React `>= 19.2`
- `react-native-reanimated` `^4.3`
- `react-native-worklets` `^0.8`
