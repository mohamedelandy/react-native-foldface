import { Pressable, StyleSheet, Text, View } from "react-native";
import { useDemoStore } from "../demoStore";
import type { DirectPrice, Product } from "../productTypes";
import { theme } from "../theme";
import AttributeSwatches from "./AttributeSwatches";
import { Badge } from "./common/Badge";
import { Chip } from "./common/Chip";
import { IconButton } from "./common/IconButton";
import { RatingStars } from "./common/RatingStars";
import { SectionLabel } from "./common/SectionLabel";
import { ThemeCard } from "./common/ThemeCard";
import PriceTag from "./PriceTag";

type ProductDetailsCardProps = {
  product: Product;
  onPress: () => void;
};

const formatPrice = (value: number, currencyCode: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode }).format(value);

const optionMatchingAttribute = (
  product: Product,
  title: string,
  value: string
): string | undefined =>
  product.options.find((option) =>
    option.attributes.some((attribute) => attribute.title === title && attribute.value === value)
  )?.id;

export default function ProductDetailsCard({ product, onPress }: ProductDetailsCardProps) {
  const {
    addToCart,
    cartCount,
    decrementCart,
    isWishlisted,
    quantity,
    selectedOptions,
    selectOption,
    toggleWishlist,
  } = useDemoStore();

  const selectedOption = product.options.find(
    (option) => option.id === selectedOptions[product.id]
  );
  const primary = selectedOption ?? product.options[0];
  const flashSale = product.options.find((option) => option.flashSale?.isSale)?.flashSale;
  const bannerPromo = product.options.find((option) => option.banner?.isPromo)?.banner;
  const wished = isWishlisted(product.id);
  const inCart = quantity(product.id) > 0;

  const selectedValues = Object.fromEntries(
    primary.attributes.map((attribute) => [attribute.title, attribute.value])
  );

  return (
    <Pressable style={styles.container} onPress={onPress} testID="product-details">
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titles}>
            <Text style={theme.typography.label}>{product.brand}</Text>
            <Text style={theme.typography.title} numberOfLines={2}>
              {product.title}
            </Text>
          </View>
          <IconButton
            glyph="♥"
            onPress={() => toggleWishlist(product.id)}
            active={wished}
            testID="details-wishlist-header"
            accessibilityLabel={`Wishlist ${product.title}`}
          />
        </View>

        {product.badges.length > 0 && (
          <View style={styles.badges}>
            {product.badges.map((badge) => (
              <Badge key={badge} label={badge} />
            ))}
          </View>
        )}

        {product.highlights.length > 0 && (
          <View style={styles.section}>
            <SectionLabel title="Highlights" />
            {product.highlights.map((highlight) => (
              <View key={highlight} style={styles.bullet}>
                <Text style={styles.check}>✓</Text>
                <Text style={theme.typography.body}>{highlight}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <SectionLabel title="Description" />
          <Text style={theme.typography.body}>{product.description}</Text>
        </View>

        {product.options.length > 0 && (
          <View style={styles.section}>
            <SectionLabel title="Options" />
            {product.options.map((option) => (
              <View key={option.id} style={styles.optionRow}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <AttributeSwatches
                  attributes={option.attributes}
                  selectedValues={selectedValues}
                  onSelect={(title, value) => {
                    const optionId = optionMatchingAttribute(product, title, value);
                    if (optionId != null) {
                      selectOption(product.id, optionId);
                    }
                  }}
                  disabled={option.totalStock === 0}
                />
                <PriceTag
                  priceBeforeDiscount={option.priceBeforeDiscount}
                  discountValue={option.discountValue}
                  finalPrice={option.finalPrice}
                  size="sm"
                />
              </View>
            ))}
          </View>
        )}

        {(flashSale != null || bannerPromo != null) && (
          <View style={styles.section}>
            <SectionLabel title="Offers" />
            {flashSale != null && (
              <ThemeCard padding={theme.spacing.md} style={styles.offerCard}>
                <View style={styles.offerTitleRow}>
                  <Text style={styles.offerTitle}>Flash sale</Text>
                  <Chip label="Ends soon" tone="danger" />
                </View>
                <Text style={theme.typography.body}>Limited-time discount on this option.</Text>
                {flashSale.id != null && (
                  <Text style={styles.offerMeta}>Offer id: {flashSale.id}</Text>
                )}
              </ThemeCard>
            )}
            {bannerPromo != null && (
              <ThemeCard padding={theme.spacing.md} style={styles.offerCard}>
                <Text style={styles.offerTitle}>{bannerPromo.title}</Text>
                <Text style={theme.typography.body}>{bannerPromo.description}</Text>
                <Text style={styles.offerMeta}>Ends {bannerPromo.endDate}</Text>
              </ThemeCard>
            )}
          </View>
        )}

        {product.directPrices.length > 0 && (
          <View style={styles.section}>
            <SectionLabel title="Prices" />
            {product.directPrices.map((price: DirectPrice) => (
              <View key={price.currencyCode} style={styles.priceRow}>
                <Text style={styles.currency}>{price.currencyCode}</Text>
                <PriceTag
                  priceBeforeDiscount={price.priceBeforeDiscount}
                  discountValue={price.discountValue}
                  finalPrice={price.finalPrice}
                  currencyCode={price.currencyCode}
                  size="sm"
                />
              </View>
            ))}
            <Text style={styles.shippingNote}>
              {product.freeShipping
                ? "Free shipping"
                : `Free shipping over ${formatPrice(product.shipping?.freeThreshold ?? 0, product.directPrices[0]?.currencyCode ?? "USD")}`}
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <SectionLabel title="Ratings" />
          <View style={styles.ratingHeader}>
            <Text style={styles.ratingScore}>{product.averageRating.toFixed(1)}</Text>
            <View>
              <RatingStars rating={product.averageRating} />
              <Text style={styles.ratingCount}>{product.reviewCount} reviews</Text>
            </View>
          </View>
          {([5, 4, 3, 2, 1] as const).map((stars) => {
            const count = product.ratingBreakdown[stars];
            const total = product.reviewCount || 1;
            return (
              <View key={stars} style={styles.barRow}>
                <Text style={styles.barLabel}>{stars}★</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[styles.barFill, { width: `${Math.round((count / total) * 100)}%` }]}
                  />
                </View>
                <Text style={styles.barCount}>{count}</Text>
              </View>
            );
          })}
          {product.reviews.slice(0, 3).map((review) => (
            <View key={review.id} style={styles.review}>
              <View style={styles.reviewHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{review.author.charAt(0)}</Text>
                </View>
                <View style={styles.reviewMeta}>
                  <Text style={styles.reviewAuthor}>
                    {review.author}
                    {review.verified && <Text style={styles.verified}> · Verified</Text>}
                  </Text>
                  <RatingStars rating={review.rating} size={11} />
                </View>
              </View>
              <Text style={styles.reviewDate}>{review.date}</Text>
              <Text style={styles.reviewTitle}>{review.title}</Text>
              <Text style={theme.typography.body}>{review.body}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <SectionLabel title="Shipping & returns" />
          <ThemeCard padding={theme.spacing.md}>
            <Text style={theme.typography.body}>
              Estimated delivery: {product.shipping?.etaDays ?? "3-5 days"}
            </Text>
            <Text style={theme.typography.body}>
              {product.freeShipping
                ? "Free standard shipping"
                : `Free shipping on orders over ${formatPrice(product.shipping?.freeThreshold ?? 0, product.directPrices[0]?.currencyCode ?? "USD")}`}
            </Text>
            <Text style={theme.typography.body}>30-day hassle-free returns.</Text>
          </ThemeCard>
        </View>

        <View style={styles.footer}>
          <IconButton
            glyph="♥"
            onPress={() => toggleWishlist(product.id)}
            active={wished}
            testID="details-wishlist"
            accessibilityLabel={`Wishlist ${product.title}`}
          />
          {inCart ? (
            <View style={styles.stepper}>
              <IconButton
                glyph="−"
                onPress={() => decrementCart(product.id)}
                testID="cart-decrement"
              />
              <Text style={styles.quantity} testID="cart-quantity">
                {quantity(product.id)}
              </Text>
              <IconButton
                glyph="＋"
                onPress={() => addToCart(product.id)}
                testID="cart-increment"
              />
            </View>
          ) : (
            <Pressable
              style={styles.addToCart}
              onPress={() => addToCart(product.id)}
              testID="add-to-cart"
              accessibilityRole="button"
            >
              <Text style={styles.addToCartText}>
                Add to cart{cartCount > 0 ? ` · ${cartCount}` : ""}
              </Text>
            </Pressable>
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
    borderRadius: theme.radii.md,
    ...theme.shadows.card,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  titles: {
    flex: 1,
    marginEnd: theme.spacing.sm,
  },
  badges: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  section: {
    padding: theme.spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
  bullet: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.xs,
  },
  check: {
    color: theme.colors.success,
    marginEnd: theme.spacing.sm,
    fontSize: 13,
  },
  optionRow: {
    marginBottom: theme.spacing.md,
  },
  optionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  offerCard: {
    marginBottom: theme.spacing.sm,
  },
  offerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
  },
  offerMeta: {
    ...theme.typography.caption,
    marginTop: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  currency: {
    width: 44,
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  shippingNote: {
    ...theme.typography.caption,
    color: theme.colors.success,
    marginTop: theme.spacing.xs,
  },
  ratingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  ratingScore: {
    fontSize: 40,
    fontWeight: "700",
    color: theme.colors.text,
    marginEnd: theme.spacing.md,
  },
  ratingCount: {
    ...theme.typography.caption,
    marginTop: 2,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  barLabel: {
    width: 28,
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  barTrack: {
    flex: 1,
    height: 6,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.border,
    overflow: "hidden",
    marginHorizontal: theme.spacing.sm,
  },
  barFill: {
    height: 6,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.star,
  },
  barCount: {
    width: 36,
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "right",
  },
  review: {
    marginTop: theme.spacing.md,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginEnd: theme.spacing.sm,
  },
  avatarText: {
    color: theme.colors.accent,
    fontWeight: "700",
  },
  reviewMeta: {
    flex: 1,
  },
  reviewAuthor: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
  },
  verified: {
    color: theme.colors.success,
  },
  reviewDate: {
    ...theme.typography.caption,
    marginTop: 2,
  },
  reviewTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
    marginTop: 4,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  quantity: {
    minWidth: 28,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  addToCart: {
    flex: 1,
    alignItems: "center",
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.md,
  },
  addToCartText: {
    color: theme.colors.surface,
    fontSize: 15,
    fontWeight: "700",
  },
});
