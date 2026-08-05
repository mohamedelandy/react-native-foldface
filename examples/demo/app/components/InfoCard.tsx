import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";
import { Chip } from "./common/Chip";
import { ThemeCard } from "./common/ThemeCard";

type InfoCardProps = {
  onPress: () => void;
};

export default function InfoCard({ onPress }: InfoCardProps) {
  const [following, setFollowing] = useState(false);

  return (
    <View style={styles.container}>
      <ThemeCard padding={theme.spacing.lg} style={styles.card}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>
          <View style={styles.identity}>
            <Text style={theme.typography.title}>Alex Morgan</Text>
            <Text style={styles.handle}>@alexmorgan</Text>
          </View>
          <Chip
            label={following ? "Following" : "Follow"}
            tone={following ? "accent" : "default"}
            onPress={() => setFollowing((current) => !current)}
            selected={following}
            testID="follow-button"
          />
        </View>
        <Text style={theme.typography.body}>Product designer exploring fold animations.</Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>128</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>12.4k</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>321</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
        <Pressable style={styles.pressHint} onPress={onPress} accessibilityRole="button">
          <Text style={styles.pressHintText}>Tap to open profile ›</Text>
        </Pressable>
      </ThemeCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  card: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginEnd: theme.spacing.md,
  },
  avatarText: {
    color: theme.colors.surface,
    fontSize: 24,
    fontWeight: "700",
  },
  identity: {
    flex: 1,
  },
  handle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  stats: {
    flexDirection: "row",
    marginTop: theme.spacing.lg,
  },
  stat: {
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  statLabel: {
    ...theme.typography.caption,
  },
  pressHint: {
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
  pressHintText: {
    color: theme.colors.accent,
    fontSize: 13,
    fontWeight: "600",
  },
});
