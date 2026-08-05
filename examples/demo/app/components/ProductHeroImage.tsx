import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { Product } from "../productTypes";
import { theme } from "../theme";
import { Badge } from "./common/Badge";
import { Chip } from "./common/Chip";

type ProductHeroImageProps = {
  product: Product;
  onPress: () => void;
};

export default function ProductHeroImage({ product, onPress }: ProductHeroImageProps) {
  return (
    <Pressable style={styles.container} onPress={onPress} testID="product-hero">
      <Image
        source={{ uri: product.images[0] }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        testID="product-hero-image"
      />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          {product.badges.length > 0 && <Badge label={product.badges[0]} />}
          {product.freeShipping && <Chip label="Free shipping" tone="accent" />}
        </View>
        <View>
          <Text style={styles.category}>{product.category?.name ?? "Uncategorized"}</Text>
          <Text style={styles.title} numberOfLines={1}>
            {product.title}
          </Text>
        </View>
        <View style={styles.dots}>
          {product.images.map((image, index) => (
            <View key={image} style={[styles.dot, index === 0 && styles.dotActive]} />
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.border,
    justifyContent: "flex-end",
    borderRadius: theme.radii.md,
    overflow: "hidden",
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: theme.colors.overlay,
  },
  content: {
    padding: theme.spacing.lg,
    justifyContent: "space-between",
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  category: {
    ...theme.typography.label,
    color: "rgba(255,255,255,0.8)",
  },
  title: {
    color: theme.colors.surface,
    fontSize: 20,
    fontWeight: "700",
  },
  dots: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    alignSelf: "flex-start",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: theme.radii.full,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  dotActive: {
    backgroundColor: theme.colors.surface,
  },
});
