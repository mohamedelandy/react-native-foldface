# Changelog

All notable changes to `react-native-foldface` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] — 2026-08-06

### Changed

- Republished after account email change; no source changes.

## [1.0.0] — 2026-08-04

### Added

- Initial release of `react-native-foldface`.
- `FoldView` component with `cover` / `reveal` API.
- `FoldRef` type with `expand`, `collapse`, `rasterize`, `getBaseHeight`, `getFlipDuration`.
- Nested fold support with automatic height and duration aggregation.
- TypeScript end to end with compiled `dist/` output.
- Example app in `examples/demo` with profile and products demos.

### Changed

- `FoldView` reveals now wrap to their content height (floored at the base height)
  instead of being clipped to the base height. `FoldRef` gains `getRevealHeight` and
  `getTreeRevealHeight`.
