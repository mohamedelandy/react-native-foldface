import { StyleSheet, View } from "react-native";
import FoldView from "react-native-foldface";

import AdditionalInfoCard from "./AdditionalInfoCard";
import PhotoCard from "./PhotoCard";
import ProfileDetailCard from "./ProfileDetailCard";

type ProfileCardProps = {
  onPress: () => void;
};

export default function ProfileCard({ onPress }: ProfileCardProps) {
  const blankFace = <View style={styles.blankFace} />;

  const innerBackface = (
    <View style={styles.innerBackface}>
      <AdditionalInfoCard onPress={onPress} />
    </View>
  );

  const reveal = (
    <View style={styles.reveal}>
      <FoldView cover={blankFace} reveal={innerBackface}>
        <ProfileDetailCard onPress={onPress} />
      </FoldView>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.foldArea}>
        <FoldView cover={blankFace} reveal={reveal}>
          <PhotoCard onPress={onPress} />
        </FoldView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  foldArea: {
    flex: 1,
  },
  reveal: {
    flex: 1,
  },
  blankFace: {
    backgroundColor: "#D6EFFF",
    flex: 1,
  },
  innerBackface: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E5EA",
    borderRadius: 12,
  },
});
