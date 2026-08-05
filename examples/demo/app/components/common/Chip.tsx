import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../../theme";

type ChipTone = "default" | "success" | "warning" | "danger" | "accent";

type ChipProps = {
  label: string;
  tone?: ChipTone;
  onPress?: () => void;
  selected?: boolean;
  testID?: string;
};

const TONE_COLOR: Record<ChipTone, string> = {
  default: theme.colors.text,
  success: theme.colors.success,
  warning: theme.colors.warning,
  danger: theme.colors.danger,
  accent: theme.colors.accent,
};

export function Chip({ label, tone = "default", onPress, selected = false, testID }: ChipProps) {
  const textStyle = [styles.text, { color: TONE_COLOR[tone] }];
  if (onPress != null) {
    return (
      <Pressable
        testID={testID}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        style={[styles.chip, selected && styles.selected]}
      >
        <Text style={textStyle}>{label}</Text>
      </Pressable>
    );
  }
  return (
    <View testID={testID} style={styles.chip}>
      <Text style={textStyle}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: theme.colors.accentSoft,
    borderRadius: theme.radii.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    alignSelf: "flex-start",
  },
  selected: {
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
