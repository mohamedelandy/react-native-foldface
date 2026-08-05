import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";
import { SectionLabel } from "./common/SectionLabel";

type AdditionalInfoCardProps = {
  onPress: () => void;
};

export default function AdditionalInfoCard({ onPress }: AdditionalInfoCardProps) {
  return (
    <View style={styles.container}>
      <SectionLabel title="Highlights" />
      <View style={styles.grid}>
        {["h1", "h2", "h3"].map((seed) => (
          <View key={seed} style={styles.cell} />
        ))}
      </View>
      <Pressable style={styles.centerpiece} onPress={onPress} testID="highlights-centerpiece">
        <Text style={styles.centerpieceText}>PRESS ME</Text>
      </Pressable>
      <View style={styles.posts}>
        <View style={styles.post} />
        <View style={styles.post} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
  grid: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.accentSoft,
  },
  centerpiece: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radii.md,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.lg,
  },
  centerpieceText: {
    color: theme.colors.surface,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1,
  },
  posts: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  post: {
    height: 36,
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.background,
  },
});
