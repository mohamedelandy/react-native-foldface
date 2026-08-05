import { View } from "react-native";
import Animated from "react-native-reanimated";
import FoldView from "react-native-foldface";

import InfoCard from "./components/InfoCard";
import PhotoCard from "./components/PhotoCard";
import ProfileCard from "./components/ProfileCard";
import { ROW_HEIGHT, useRowViewModel } from "./useRowViewModel";

export default function Row() {
  const { expanded, flip, handleAnimationStart, spacerStyle } = useRowViewModel();

  return (
    <View>
      <View style={{ height: ROW_HEIGHT, margin: 10 }}>
        <FoldView
          expanded={expanded}
          onAnimationStart={handleAnimationStart}
          perspective={1000}
          cover={<InfoCard onPress={flip} />}
          reveal={<ProfileCard onPress={flip} />}
        >
          <PhotoCard onPress={flip} />
        </FoldView>
      </View>

      <Animated.View testID="row-spacer" pointerEvents="none" style={spacerStyle} />
    </View>
  );
}
