import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { LayoutChangeEvent } from "react-native";
import { scheduleOnRN } from "react-native-worklets";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { FoldViewContext } from "./foldViewContext";
import type { FoldRef, FoldViewProps, Layout, Register } from "./types";

const sequentialExpand = async (foldViews: FoldRef[]) => {
  for (const foldView of foldViews) {
    await foldView.expand();
  }
};

const sequentialCollapse = async (foldViews: FoldRef[]) => {
  const reversed = [...foldViews].reverse();
  for (const foldView of reversed) {
    await foldView.collapse();
  }
};

const animateTo = (value: SharedValue<number>, toValue: number, duration: number) =>
  new Promise<void>((resolve) => {
    value.value = withTiming(
      toValue,
      { duration, easing: Easing.inOut(Easing.ease) },
      () => {
        "worklet";
        scheduleOnRN(resolve);
      },
    );
  });

export type UseFoldViewViewModelResult = {
  coverAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
  baseLayout: Layout | null;
  contextValue: Register | null;
  revealAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
  handleLayout: (event: LayoutChangeEvent) => void;
  handleRevealLayout: (event: LayoutChangeEvent) => void;
  isFlipped: boolean;
  isRoot: boolean;
  rasterize: boolean;
  showLoading: boolean;
};

export function useFoldViewViewModel(props: FoldViewProps): UseFoldViewViewModelResult {
  const {
    collapse = sequentialCollapse,
    expanded = false,
    expand = sequentialExpand,
    flipDuration = 280,
    onAnimationEnd,
    onAnimationStart,
    perspective = 1000,
    renderLoading,
  } = props;

  const register = useContext(FoldViewContext);
  const isRoot = register == null;

  const coverRot = useSharedValue(0);
  const revealRot = useSharedValue(-180);

  const [baseLayout, setBaseLayout] = useState<Layout | null>(null);
  const [rasterize, setRasterize] = useState(false);
  const [isFlipped, setIsFlipped] = useState(expanded);

  const childrenFolds = useRef<FoldRef[]>([]);
  const flipInProgress = useRef(false);

  const propsRef = useRef({ collapse, expand, onAnimationEnd, onAnimationStart });
  propsRef.current = { collapse, expand, onAnimationEnd, onAnimationStart };

  const baseLayoutRef = useRef<Layout | null>(baseLayout);
  baseLayoutRef.current = baseLayout;

  const revealHeightRef = useRef<number | null>(null);

  const flipDurationRef = useRef(flipDuration);
  flipDurationRef.current = flipDuration;

  const expandFold = useCallback(async () => {
    setIsFlipped(true);
    await Promise.all([
      animateTo(coverRot, 180, flipDurationRef.current),
      animateTo(revealRot, 0, flipDurationRef.current),
    ]);
  }, [coverRot, revealRot]);

  const collapseFold = useCallback(async () => {
    setIsFlipped(false);
    await Promise.all([
      animateTo(coverRot, 0, flipDurationRef.current),
      animateTo(revealRot, -180, flipDurationRef.current),
    ]);
  }, [coverRot, revealRot]);

  const expandRef = useRef(expandFold);
  expandRef.current = expandFold;
  const collapseRef = useRef(collapseFold);
  collapseRef.current = collapseFold;

  const rasterizeRef = useRef<(shouldRasterize: boolean) => Promise<void>>(async () => {});
  rasterizeRef.current = (shouldRasterize) => {
    setRasterize(shouldRasterize);
    return Promise.resolve();
  };

  const selfRef = useRef<FoldRef | null>(null);
  selfRef.current ??= {
    expand: () => expandRef.current(),
    collapse: () => collapseRef.current(),
    rasterize: (shouldRasterize) => rasterizeRef.current(shouldRasterize),
    getBaseHeight: () => baseLayoutRef.current?.height ?? 0,
    getRevealHeight: () => revealHeightRef.current ?? baseLayoutRef.current?.height ?? 0,
    getTreeRevealHeight: () =>
      (revealHeightRef.current ?? baseLayoutRef.current?.height ?? 0) +
      childrenFolds.current.reduce((sum, fold) => sum + fold.getTreeRevealHeight(), 0),
    getFlipDuration: () => flipDurationRef.current,
  };

  useEffect(() => {
    if (register != null && selfRef.current != null) {
      return register(selfRef.current);
    }
    return undefined;
  }, [register]);

  const registerChild = useCallback((fold: FoldRef) => {
    childrenFolds.current.push(fold);
    return () => {
      const index = childrenFolds.current.indexOf(fold);
      if (index !== -1) {
        childrenFolds.current.splice(index, 1);
      }
    };
  }, []);

  const contextValue = useMemo(() => register ?? registerChild, [register, registerChild]);

  const flip = useCallback(async (nextExpanded: boolean) => {
    if (flipInProgress.current) {
      return;
    }
    flipInProgress.current = true;
    try {
      const folds = childrenFolds.current;
      const totalDuration =
        flipDurationRef.current + folds.reduce((sum, fold) => sum + fold.getFlipDuration(), 0);

      const baseHeight = baseLayoutRef.current?.height ?? 0;
      let height = baseHeight;
      if (nextExpanded) {
        const treeRevealHeight = selfRef.current?.getTreeRevealHeight() ?? baseHeight;
        height = baseHeight + treeRevealHeight;
      }

      const { onAnimationStart, onAnimationEnd } = propsRef.current;
      onAnimationStart?.(totalDuration, height);

      if (nextExpanded) {
        await Promise.all(folds.map((fold) => fold.rasterize(true)));
        await selfRef.current?.expand();
        await propsRef.current.expand(folds);
      } else {
        await propsRef.current.collapse(folds);
        await selfRef.current?.collapse();
        await Promise.all(folds.map((fold) => fold.rasterize(false)));
      }

      onAnimationEnd?.(totalDuration, height);
    } finally {
      flipInProgress.current = false;
    }
  }, []);

  const prevExpanded = useRef(expanded);
  useEffect(() => {
    if (isRoot && prevExpanded.current !== expanded) {
      prevExpanded.current = expanded;
      void flip(expanded);
    }
  }, [expanded, flip, isRoot]);

  const coverAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ perspective }, { rotateX: `${coverRot.value}deg` }],
    }),
    [perspective],
  );

  const revealAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ perspective }, { rotateX: `${revealRot.value}deg` }],
    }),
    [perspective],
  );

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { height, width, x, y } = event.nativeEvent.layout;
    setBaseLayout({ height, width, x, y });
  }, []);

  const handleRevealLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    revealHeightRef.current = height;
  }, []);

  const showLoading = isRoot && baseLayout == null && renderLoading != null;

  return {
    coverAnimatedStyle,
    baseLayout,
    contextValue,
    revealAnimatedStyle,
    handleLayout,
    handleRevealLayout,
    isFlipped,
    isRoot,
    rasterize,
    showLoading,
  };
}
