import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { FoldViewContext } from "./foldViewContext";
import type { FoldViewProps } from "./types";
import { useFoldViewViewModel } from "./useFoldViewViewModel";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  base: {
    flex: 1,
    backgroundColor: "transparent",
  },
  face: {
    backfaceVisibility: "hidden",
    backgroundColor: "transparent",
    position: "absolute",
  },
});

export default function FoldView(props: FoldViewProps) {
  const { cover, children, reveal, renderLoading } = props;
  const {
    coverAnimatedStyle,
    baseLayout,
    contextValue,
    revealAnimatedStyle,
    handleLayout,
    handleRevealLayout,
    isFlipped,
    rasterize,
    showLoading,
  } = useFoldViewViewModel(props);

  return (
    <FoldViewContext.Provider value={contextValue}>
      <View style={styles.container}>
        <View
          onLayout={handleLayout}
          style={[styles.base, baseLayout != null && { height: baseLayout.height }]}
        >
          {showLoading ? renderLoading?.() : children}
        </View>
        {baseLayout != null && reveal != null && (
          <Animated.View
            onLayout={handleRevealLayout}
            style={[
              styles.face,
              {
                top: baseLayout.y + baseLayout.height,
                left: baseLayout.x,
                minHeight: baseLayout.height,
                width: baseLayout.width,
                transformOrigin: "top",
                zIndex: 1,
              },
              revealAnimatedStyle,
            ]}
            pointerEvents={isFlipped ? "auto" : "none"}
            shouldRasterizeIOS={rasterize}
            renderToHardwareTextureAndroid={rasterize}
          >
            {reveal}
          </Animated.View>
        )}
        {baseLayout != null && (
          <Animated.View
            style={[
              styles.face,
              {
                top: baseLayout.y,
                left: baseLayout.x,
                height: baseLayout.height,
                width: baseLayout.width,
                transformOrigin: "bottom",
                zIndex: 0,
              },
              coverAnimatedStyle,
            ]}
            pointerEvents={isFlipped ? "box-none" : "auto"}
            shouldRasterizeIOS={rasterize}
            renderToHardwareTextureAndroid={rasterize}
          >
            {cover ?? children}
          </Animated.View>
        )}
      </View>
    </FoldViewContext.Provider>
  );
}

export type { FoldRef, FoldViewProps } from "./types";
