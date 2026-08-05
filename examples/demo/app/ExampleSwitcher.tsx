import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "./theme";

export type ExampleName = "profile" | "products";

type ExampleSwitcherProps = {
  example: ExampleName;
  onChange: (example: ExampleName) => void;
};

export default function ExampleSwitcher({ example, onChange }: ExampleSwitcherProps) {
  return (
    <View style={styles.container}>
      <Pressable
        testID="switcher-profile"
        style={[styles.button, example === "profile" && styles.active]}
        onPress={() => onChange("profile")}
      >
        <Text style={[styles.label, example === "profile" && styles.activeLabel]}>Profile</Text>
      </Pressable>
      <Pressable
        testID="switcher-products"
        style={[styles.button, example === "products" && styles.active]}
        onPress={() => onChange("products")}
      >
        <Text style={[styles.label, example === "products" && styles.activeLabel]}>Products</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: theme.colors.border,
    borderRadius: theme.radii.md,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    padding: 4,
  },
  button: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radii.sm,
    alignItems: "center",
  },
  active: {
    backgroundColor: theme.colors.surface,
    ...theme.shadows.card,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  activeLabel: {
    color: theme.colors.text,
  },
});
