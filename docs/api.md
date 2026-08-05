# API reference

## `FoldView`

The main component. Accepts the following props.

### `FoldViewProps`

| Prop               | Type                                          | Default             | Description                                                          |
| ------------------ | --------------------------------------------- | ------------------- | -------------------------------------------------------------------- |
| `children`         | `ReactNode`                                   | —                   | Content of the collapsed cell.                                       |
| `cover`            | `?ReactNode`                                  | `children`          | Content rendered on the cover face.                                  |
| `reveal`           | `?ReactNode`                                  | —                   | Content rendered on the reveal face. May contain nested `FoldView`s. |
| `renderLoading`    | `?() => ReactNode`                            | —                   | Temporary content rendered while the base layout is being measured.  |
| `expanded`         | `boolean`                                     | —                   | Controls whether the cell is expanded. (Root-only)                   |
| `flipDuration`     | `number`                                      | `280`               | Length of a single flip in milliseconds.                             |
| `perspective`      | `number`                                      | `1000`              | 3D depth of the fold animation.                                      |
| `expand`           | `?(foldViews: FoldRef[]) => Promise<void>`    | Sequential expand   | Called when the cell should expand. (Root-only)                      |
| `collapse`         | `?(foldViews: FoldRef[]) => Promise<void>`    | Sequential collapse | Called when the cell should collapse. (Root-only)                    |
| `onAnimationStart` | `?(duration: number, height: number) => void` | —                   | Called before an expand/collapse animation starts. (Root-only)       |
| `onAnimationEnd`   | `?(duration: number, height: number) => void` | —                   | Called after an expand/collapse animation ends. (Root-only)          |

## `FoldRef`

Registered per nested `FoldView` via the root's `expand` / `collapse` callbacks.

| Method                                | Returns         | Description                                                                |
| ------------------------------------- | --------------- | -------------------------------------------------------------------------- |
| `expand()`                            | `Promise<void>` | Animates the fold open.                                                    |
| `collapse()`                          | `Promise<void>` | Animates the fold closed.                                                  |
| `rasterize(shouldRasterize: boolean)` | `Promise<void>` | Enables or disables hardware texture caching.                              |
| `getBaseHeight()`                     | `number`        | The collapsed height of this fold.                                         |
| `getRevealHeight()`                   | `number`        | The expanded height of this fold (content height, floored at base height). |
| `getTreeRevealHeight()`               | `number`        | The total expanded height including all nested folds.                      |
| `getFlipDuration()`                   | `number`        | The flip duration in milliseconds for this fold.                           |

## `Register`

```ts
type Register = (fold: FoldRef) => () => void;
```

A callback that registers a `FoldRef` and returns an unregister function. Used internally by `FoldView` to collect nested fold references.

## `Layout`

```ts
type Layout = {
  x: number;
  y: number;
  width: number;
  height: number;
};
```

Represents the measured layout of a fold cell. Used internally for height calculations.
