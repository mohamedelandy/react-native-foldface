import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

type PriceTagProps = {
  priceBeforeDiscount: number;
  discountValue: number;
  finalPrice: number;
  currencyCode?: string;
  size?: "sm" | "md";
};

const formatPrice = (value: number, currencyCode: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode }).format(value);

export default function PriceTag({
  priceBeforeDiscount,
  discountValue,
  finalPrice,
  currencyCode = "USD",
  size = "md",
}: PriceTagProps) {
  const percent =
    priceBeforeDiscount > 0 ? Math.round((discountValue / priceBeforeDiscount) * 100) : 0;
  const isSmall = size === "sm";

  return (
    <View style={styles.row}>
      <Text style={[styles.final, isSmall && styles.finalSmall]}>
        {formatPrice(finalPrice, currencyCode)}
      </Text>
      {discountValue > 0 && (
        <>
          <Text style={[styles.original, isSmall && styles.originalSmall]}>
            {formatPrice(priceBeforeDiscount, currencyCode)}
          </Text>
          <Text style={styles.badge}>-{percent}%</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  final: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  finalSmall: {
    fontSize: 14,
  },
  original: {
    fontSize: 13,
    color: theme.colors.textTertiary,
    textDecorationLine: "line-through",
    marginStart: theme.spacing.sm,
  },
  originalSmall: {
    fontSize: 12,
  },
  badge: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.surface,
    backgroundColor: theme.colors.danger,
    borderRadius: theme.radii.sm,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 1,
    marginStart: theme.spacing.sm,
    overflow: "hidden",
  },
});
