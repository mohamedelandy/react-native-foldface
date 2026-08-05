import { useCallback, useState } from "react";
import { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export const ROW_HEIGHT = 180;

export function useRowViewModel() {
  const [expanded, setExpanded] = useState(false);
  const spacerHeight = useSharedValue(0);

  const flip = useCallback(() => {
    setExpanded((current) => !current);
  }, []);

  const handleAnimationStart = useCallback(
    (duration: number, nextHeight: number) => {
      spacerHeight.value = withTiming(nextHeight - ROW_HEIGHT, {
        duration,
        easing: Easing.inOut(Easing.ease),
      });
    },
    [spacerHeight]
  );

  const spacerStyle = useAnimatedStyle(() => ({
    height: spacerHeight.value,
  }));

  return {
    expanded,
    flip,
    handleAnimationStart,
    spacerHeight,
    spacerStyle,
  };
}
