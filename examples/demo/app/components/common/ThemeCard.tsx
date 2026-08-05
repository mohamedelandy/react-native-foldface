import type { ReactNode } from "react";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { theme } from "../../theme";

type ThemeCardProps = {
  children: ReactNode;
  padding?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function ThemeCard({
  children,
  padding = theme.spacing.lg,
  onPress,
  style,
  testID,
}: ThemeCardProps) {
  const cardStyle = [styles.card, { padding }, style];
  if (onPress != null) {
    return (
      <Pressable
        testID={testID}
        onPress={onPress}
        style={({ pressed }) => [cardStyle, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }
  return (
    <View testID={testID} style={cardStyle}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    ...theme.shadows.card,
  },
  pressed: {
    opacity: 0.85,
  },
});
