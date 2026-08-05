# Migration from `react-native-foldview`

This library is a full rewrite of [`react-native-foldview`](https://github.com/jmurzy/react-native-foldview) by Jake Murzy. Key differences:

## API changes

| `react-native-foldview` | `react-native-foldface`                                       |
| ----------------------- | ------------------------------------------------------------- |
| `foldView` prop         | `cover` / `reveal` props                                      |
| `onFold` callback       | `expanded` boolean + `onAnimationStart` / `onAnimationEnd`    |
| No nesting support      | Nested `FoldView` inside `reveal`                             |
| No `FoldRef` type       | `FoldRef` with `expand`, `collapse`, `rasterize`, and getters |
| JavaScript only         | TypeScript end to end                                         |

## Installation

```sh
npm uninstall react-native-foldview
npm install react-native-foldface
```

## Basic usage

```tsx
// Before (react-native-foldview)
import { FoldView } from 'react-native-foldview';

<FoldView foldView={<Front />} onFold={(isFolded) => ...}>
  <Back />
</FoldView>;

// After (react-native-foldface)
import FoldView from 'react-native-foldface';

<FoldView
  expanded={isFolded}
  cover={<Front />}
  reveal={<Back />}
>
  <Base />
</FoldView>;
```

## Nesting (new)

`react-native-foldface` supports nested folds out of the box — a feature not available in the original library.
