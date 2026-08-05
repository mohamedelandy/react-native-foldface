import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useDemoStore } from "../demoStore";
import type { Product } from "../productTypes";
import { theme } from "../theme";
import { Badge } from "./common/Badge";
import { IconButton } from "./common/IconButton";
import { RatingStars } from "./common/RatingStars";
import PriceTag from "./PriceTag";

type ProductSummaryCardProps = {
  product: Product;
  onPress: () => void;
};

export default function ProductSummaryCard({ product, onPress }: ProductSummaryCardProps) {
  const { isWishlisted, selectedOptions, toggleWishlist } = useDemoStore();
  const selectedOption = product.options.find(
    (option) => option.id === selectedOptions[product.id]
  );
  const option = selectedOption ?? product.options[0];
  const wished = isWishlisted(product.id);

  const price = {
    priceBeforeDiscount: option.priceBeforeDiscount,
    discountValue: option.discountValue,
    finalPrice: option.finalPrice,
  };

  return (
    <Pressable style={styles.container} onPress={onPress} testID="product-summary">
      <Image
        source={{ uri: product.images[0] }}
        style={styles.thumbnail}
        testID="product-summary-thumb"
      />
      <View style={styles.info}>
        <View style={styles.headerRow}>
          <View style={styles.titles}>
            <Text style={theme.typography.label}>{product.brand}</Text>
            <Text style={theme.typography.subtitle} numberOfLines={1}>
              {product.title}
            </Text>
          </View>
          <IconButton
            glyph="♥"
            onPress={() => toggleWishlist(product.id)}
            active={wished}
            testID="summary-wishlist"
            accessibilityLabel={`Wishlist ${product.title}`}
          />
        </View>
        <View style={styles.metaRow}>
          {product.badges.length > 0 && <Badge label={product.badges[0]} />}
        </View>
        <PriceTag size="sm" {...price} />
        <View style={styles.metaRow}>
          <RatingStars rating={product.averageRating} />
          <Text style={styles.reviews}>
            {product.averageRating.toFixed(1)} ({product.reviewCount})
          </Text>
          {product.totalStock === 0 ? (
            <Text style={styles.soldOut}>Sold out</Text>
          ) : (
            <Text style={styles.stock}>In stock</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    flexDirection: "row",
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    ...theme.shadows.card,
  },
  thumbnail: {
    width: 84,
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.border,
  },
  info: {
    flex: 1,
    marginStart: theme.spacing.md,
    justifyContent: "space-between",
    borderRadius: theme.radii.md,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  titles: {
    flex: 1,
    marginEnd: theme.spacing.sm,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  reviews: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginStart: theme.spacing.sm,
    marginEnd: theme.spacing.md,
  },
  soldOut: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.danger,
  },
  stock: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.success,
  },
});
