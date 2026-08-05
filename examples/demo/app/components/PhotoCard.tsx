import { Image, Pressable, StyleSheet, View } from "react-native";
import { theme } from "../theme";
import { SectionLabel } from "./common/SectionLabel";

type PhotoCardProps = {
  onPress: () => void;
};

export default function PhotoCard({ onPress }: PhotoCardProps) {
  return (
    <Pressable style={styles.container} onPress={onPress} accessibilityRole="button">
      <Image
        source={{ uri: "https://picsum.photos/seed/photo-card/600/400" }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <SectionLabel title="Photos" />
        <View style={styles.grid}>
          {["a", "b", "c"].map((seed) => (
            <View key={seed} style={styles.cell}>
              <Image
                source={{ uri: `https://picsum.photos/seed/photo-${seed}/120/120` }}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
              />
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.border,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.overlay,
  },
  content: {
    padding: theme.spacing.lg,
  },
  grid: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: theme.radii.sm,
    overflow: "hidden",
    backgroundColor: theme.colors.background,
  },
});
