# React Native FoldFace

[![npm version](https://img.shields.io/npm/v/react-native-foldface.svg?style=flat-square)](https://www.npmjs.com/package/react-native-foldface)
[![License](https://img.shields.io/npm/l/react-native-foldface.svg?style=flat-square)](https://github.com/mohamedelandy/react-native-foldface/blob/main/LICENSE.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue?style=flat-square)](https://www.typescriptlang.org/)
[![Reanimated 4](https://img.shields.io/badge/Reanimated%204-powered-6948ff?style=flat-square)](https://docs.swmansion.com/react-native-reanimated/)

A `FoldView` component for React Native that renders a folding card animation — a `cover` face folds open to reveal a `reveal` face underneath. Built with Reanimated 4 and `react-native-worklets`.

<div align="center">

![FoldView demo](assets/demo.gif)

</div>

## What it does

Place a `FoldView` anywhere in your React Native UI. The `cover` face collapses like a card; tap or programmatically expand it and the `reveal` face flips open underneath. Nest folds inside folds for cascading layouts.

## Features

- **Cover / Reveal API** — `cover` is the collapsed front face; `reveal` is the expanded back face.
- **Nesting** — place `<FoldView>` inside a `reveal` to build multi-section fold cascades.
- **Custom animation** — `expand` / `collapse` props receive an array of `FoldRef`s for full control.
- **Automatic rasterization** — hardware texture caching handled for you.
- **TypeScript end to end** — shipped as compiled JS + `.d.ts` declarations.
- **Zero runtime deps beyond Reanimated 4** — `react-native-worklets` is the only peer.

## Quickstart

```sh
npm install react-native-foldface
```

```tsx
import { useState } from "react";
import FoldView from "react-native-foldface";

function Row() {
  const [expanded, setExpanded] = useState(false);

  return (
    <FoldView
      expanded={expanded}
      cover={<Frontface onPress={() => setExpanded(true)} />}
      reveal={<Backface onPress={() => setExpanded(false)} />}
    >
      <Base />
    </FoldView>
  );
}
```

The cover face is interactive while collapsed; the reveal face becomes interactive once expanded.

## Nesting

Place `<FoldView>` components inside a `reveal` to build the multi-section fold effect. Nested folds are discovered automatically, and the root fold accounts for their heights and durations when expanding and collapsing.

```tsx
<FoldView expanded={expanded} cover={/* ... */} reveal={/* ... */}>
  <Base />
</FoldView>
```

## Custom animation

The `expand` and `collapse` props receive an array of registered `FoldRef`s, giving you full control over the animation. Each `FoldRef` exposes:

| Method                                | Returns         |
| ------------------------------------- | --------------- |
| `expand()`                            | `Promise<void>` |
| `collapse()`                          | `Promise<void>` |
| `rasterize(shouldRasterize: boolean)` | `Promise<void>` |
| `getBaseHeight()`                     | `number`        |
| `getRevealHeight()`                   | `number`        |
| `getTreeRevealHeight()`               | `number`        |
| `getFlipDuration()`                   | `number`        |

```tsx
const collapse = async (foldViews: FoldRef[]) => {
  await Promise.all(foldViews.map((foldView) => foldView.collapse()));
};

<FoldView collapse={collapse} /* ... */>/* ... */</FoldView>;
```

## Props

| Prop                | Type               | Description                                                          |
| ------------------- | ------------------ | -------------------------------------------------------------------- |
| **`children`**      | `ReactNode`        | Content of the collapsed cell.                                       |
| **`cover`**         | `?ReactNode`       | Content rendered on the cover face. Defaults to `children`.          |
| **`reveal`**        | `?ReactNode`       | Content rendered on the reveal face. May contain nested `FoldView`s. |
| **`renderLoading`** | `?() => ReactNode` | Temporary content rendered while the base layout is being measured.  |
| **`flipDuration`**  | `?number`          | Length of a single flip in milliseconds. Default `280`.              |
| **`perspective`**   | `?number`          | 3D depth of the fold animation. Default `1000`.                      |

### Root-only props

Nested `FoldView`s inherit configuration from the root. The following props can only be set on the root `FoldView`:

| Prop                   | Type                                          | Description                                                                           |
| ---------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------- |
| **`expanded`**         | `boolean`                                     | Controls whether the cell is expanded.                                                |
| **`expand`**           | `?(foldViews: FoldRef[]) => Promise<void>`    | Called when the cell should expand. Defaults to expanding folds one after another.    |
| **`collapse`**         | `?(foldViews: FoldRef[]) => Promise<void>`    | Called when the cell should collapse. Defaults to collapsing folds one after another. |
| **`onAnimationStart`** | `?(duration: number, height: number) => void` | Called before an expand/collapse animation starts.                                    |
| **`onAnimationEnd`**   | `?(duration: number, height: number) => void` | Called after an expand/collapse animation ends.                                       |

## Example app

A working Expo app is in `examples/demo`.

```sh
cd examples/demo
npm install
npm run ios
```

## Development

```sh
npm install
npm run lint
npm run typecheck
npm run format:check
npm test
npm run build
```

## Contributing

Contributions are very welcome — bug fixes, features, documentation, tests. Make sure the CI is green.

## Docs

- [API reference](./docs/api.md)
- [Nesting guide](./docs/guides/nesting.md)
- [Custom animation guide](./docs/guides/custom-animation.md)
- [Performance guide](./docs/guides/performance.md)
- [Migration from react-native-foldview](./docs/migration.md)

## Credits

- **Original author:** Jake Murzy — [`react-native-foldview`](https://github.com/jmurzy/react-native-foldview) (the original idea and first implementation)
- **This rewrite:** mohamed elnady — `react-native-foldface` (a full TypeScript-first, Reanimated 4–powered rework with a redesigned `cover` / `reveal` API)

## License

[MIT](https://github.com/mohamedelandy/react-native-foldface/blob/main/LICENSE.md)

Copyright (c) 2016-2017 Jake Murzy
Copyright (c) 2026 Mohamed Elnady
