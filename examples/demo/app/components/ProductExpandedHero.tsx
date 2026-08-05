import { Pressable, StyleSheet, Text, View } from "react-native";
import { useDemoStore } from "../demoStore";
import type { Product } from "../productTypes";
import { theme } from "../theme";
import AttributeSwatches from "./AttributeSwatches";
import PriceTag from "./PriceTag";

type ProductExpandedHeroProps = {
  product: Product;
  onPress: () => void;
};

const optionMatchingAttribute = (
  product: Product,
  title: string,
  value: string
): string | undefined =>
  product.options.find((option) =>
    option.attributes.some((attribute) => attribute.title === title && attribute.value === value)
  )?.id;

export default function ProductExpandedHero({ product, onPress }: ProductExpandedHeroProps) {
  const { selectOption, selectedOptions } = useDemoStore();
  const selectedOption = product.options.find(
    (option) => option.id === selectedOptions[product.id]
  );
  const option = selectedOption ?? product.options[0];

  const selectedValues = Object.fromEntries(
    option.attributes.map((attribute) => [attribute.title, attribute.value])
  );

  return (
    <Pressable style={styles.container} onPress={onPress} testID="product-expanded-hero">
      <Text style={styles.category}>{product.category?.name ?? "Uncategorized"}</Text>
      <Text style={theme.typography.title} numberOfLines={2}>
        {product.title}
      </Text>
      <Text style={theme.typography.body} numberOfLines={3}>
        {product.description}
      </Text>
      <AttributeSwatches
        attributes={option.attributes}
        selectedValues={selectedValues}
        onSelect={(title, value) => {
          const optionId = optionMatchingAttribute(product, title, value);
          if (optionId != null) {
            selectOption(product.id, optionId);
          }
        }}
      />
      <View style={styles.priceRow}>
        <PriceTag
          priceBeforeDiscount={option.priceBeforeDiscount}
          discountValue={option.discountValue}
          finalPrice={option.finalPrice}
        />
        {product.totalStock === 0 && <Text style={styles.soldOut}>Sold out</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    justifyContent: "space-between",
    borderRadius: theme.radii.md,
    ...theme.shadows.card,
  },
  category: {
    ...theme.typography.label,
    color: theme.colors.textSecondary,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  soldOut: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.danger,
  },
});
