import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../theme";

type BadgeProps = {
  label: string;
  testID?: string;
};

export function Badge({ label, testID }: BadgeProps) {
  return (
    <View testID={testID} style={styles.badge}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radii.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  text: {
    color: theme.colors.surface,
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
