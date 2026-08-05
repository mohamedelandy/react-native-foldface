import { Pressable, StyleSheet, Text } from "react-native";
import { theme } from "../../theme";

type IconButtonProps = {
  glyph: string;
  onPress: () => void;
  active?: boolean;
  disabled?: boolean;
  testID?: string;
  accessibilityLabel?: string;
};

export function IconButton({
  glyph,
  onPress,
  active = false,
  disabled = false,
  testID,
  accessibilityLabel,
}: IconButtonProps) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: active, disabled }}
      hitSlop={8}
      style={[styles.button, active && styles.active, disabled && styles.disabled]}
    >
      <Text style={[styles.glyph, active && styles.activeGlyph]}>{glyph}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 32,
    height: 32,
    borderRadius: theme.radii.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
  active: {
    backgroundColor: theme.colors.accent,
  },
  disabled: {
    opacity: 0.4,
  },
  glyph: {
    fontSize: 15,
    color: theme.colors.textSecondary,
  },
  activeGlyph: {
    color: theme.colors.surface,
  },
});
