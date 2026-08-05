import type { ReactNode } from "react";

export type FoldRef = {
  expand: () => Promise<void>;
  collapse: () => Promise<void>;
  rasterize: (shouldRasterize: boolean) => Promise<void>;
  getBaseHeight: () => number;
  getRevealHeight: () => number;
  getTreeRevealHeight: () => number;
  getFlipDuration: () => number;
};

export type FoldViewProps = {
  children?: ReactNode;
  cover?: ReactNode;
  reveal?: ReactNode;
  renderLoading?: () => ReactNode;
  expanded?: boolean;
  flipDuration?: number;
  perspective?: number;
  expand?: (foldViews: FoldRef[]) => Promise<void>;
  collapse?: (foldViews: FoldRef[]) => Promise<void>;
  onAnimationStart?: (duration: number, height: number) => void;
  onAnimationEnd?: (duration: number, height: number) => void;
};

export type Register = (fold: FoldRef) => () => void;

export type Layout = {
  x: number;
  y: number;
  width: number;
  height: number;
};
