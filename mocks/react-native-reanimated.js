const { useState } = require("react");

const NOOP = () => undefined;
const ID = (value) => value;

const hook = {
  useSharedValue: (init) => {
    const [shared] = useState(() => ({ value: init }));
    return shared;
  },
  useAnimatedStyle: ID,
  useDerivedValue: (processor) => ({ value: processor() }),
  useAnimatedRef: () => ({ current: null }),
  useAnimatedScrollHandler: NOOP,
  useAnimatedProps: ID,
  useEvent: () => NOOP,
  useAnimatedReaction: NOOP,
};

const animation = {
  cancelAnimation: NOOP,
  withDecay: (_userConfig, callback) => {
    callback?.(true);
    return 0;
  },
  withDelay: (_delayMs, nextAnimation) => nextAnimation,
  withRepeat: ID,
  withSequence: () => 0,
  withSpring: (toValue) => toValue,
  withTiming: (toValue, _config, callback) => {
    callback?.(true);
    return toValue;
  },
};

const interpolation = {
  Extrapolation: { CLAMP: "clamp", EXTEND: "extend", IDENTITY: "identity" },
  interpolate: NOOP,
  clamp: NOOP,
};

const Animated = {
  View: "Animated.View",
  Text: "Animated.Text",
  Image: "Animated.Image",
  ScrollView: "Animated.ScrollView",
  FlatList: "Animated.FlatList",
  Extrapolate: interpolation.Extrapolation,
  interpolate: NOOP,
  interpolateColor: NOOP,
  clamp: NOOP,
  createAnimatedComponent: ID,
  addWhitelistedUIProps: NOOP,
  addWhitelistedNativeProps: NOOP,
};

module.exports = {
  __esModule: true,
  default: Animated,
  Animated,
  ...hook,
  ...animation,
  ...interpolation,
  Easing: {
    linear: ID,
    ease: ID,
    quad: ID,
    cubic: ID,
    poly: ID,
    sin: ID,
    circle: ID,
    exp: ID,
    elastic: ID,
    back: ID,
    bounce: ID,
    bezier: () => ({ factory: ID }),
    bezierFn: ID,
    steps: ID,
    in: ID,
    out: ID,
    inOut: ID,
  },
  runOnJS: ID,
  runOnUI: ID,
  enableLayoutAnimations: NOOP,
  isReanimated3: () => true,
  layout: {
    FadeIn: {},
    FadeOut: {},
    SlideInRight: {},
    SlideOutLeft: {},
  },
};
