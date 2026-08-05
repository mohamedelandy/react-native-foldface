import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";
import type { ProductAttribute } from "../productTypes";

type AttributeSwatchesProps = {
  attributes: ProductAttribute[];
  selectedValues?: Record<string, string>;
  onSelect?: (title: string, value: string) => void;
  disabled?: boolean;
};

export default function AttributeSwatches({
  attributes,
  selectedValues = {},
  onSelect,
  disabled = false,
}: AttributeSwatchesProps) {
  return (
    <View style={styles.row}>
      {attributes.map((attribute) => {
        const selected = selectedValues[attribute.title] === attribute.value;
        const interactive = onSelect !== undefined;
        const content =
          attribute.type === "COLOR" ? (
            <View
              testID="color-swatch"
              style={[
                styles.swatch,
                { backgroundColor: attribute.hex ?? "#C7C7CC" },
                selected && styles.swatchSelected,
              ]}
            />
          ) : (
            <View testID="attribute-chip" style={[styles.chip, selected && styles.chipSelected]}>
              <Text style={styles.chipText} testID="swatch-value">
                {attribute.value}
              </Text>
            </View>
          );

        if (!interactive) {
          return (
            <View key={attribute.id} style={[styles.item, disabled && styles.disabled]}>
              {content}
            </View>
          );
        }

        return (
          <Pressable
            key={attribute.id}
            testID={attribute.type === "COLOR" ? "color-swatch" : "attribute-chip"}
            onPress={() => onSelect(attribute.title, attribute.value)}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityState={{ selected, disabled }}
            accessibilityLabel={`${attribute.title} ${attribute.value}`}
            style={({ pressed }) => [
              styles.item,
              pressed && styles.pressed,
              disabled && styles.disabled,
            ]}
          >
            {content}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  item: {
    marginEnd: theme.spacing.sm,
    marginVertical: 2,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
  swatch: {
    width: 22,
    height: 22,
    borderRadius: theme.radii.full,
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  swatchSelected: {
    borderColor: theme.colors.accent,
  },
  chip: {
    backgroundColor: theme.colors.accentSoft,
    borderRadius: theme.radii.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
  },
  chipSelected: {
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  chipText: {
    fontSize: 12,
    color: theme.colors.text,
  },
});
