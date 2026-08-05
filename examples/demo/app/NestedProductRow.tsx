import { View } from "react-native";
import Animated from "react-native-reanimated";
import FoldView from "react-native-foldface";

import ProductDetailsCard from "./components/ProductDetailsCard";
import ProductExpandedHero from "./components/ProductExpandedHero";
import ProductHeroImage from "./components/ProductHeroImage";
import ProductSummaryCard from "./components/ProductSummaryCard";
import type { Product } from "./productTypes";
import { PRODUCT_ROW_HEIGHT, useNestedProductRowViewModel } from "./useNestedProductRowViewModel";
import { theme } from "./theme";

type NestedProductRowProps = {
  product: Product;
};

export default function NestedProductRow({ product }: NestedProductRowProps) {
  const { expanded, flip, handleAnimationStart, spacerStyle } = useNestedProductRowViewModel();

  const blankFace = (
    <View
      style={{
        backgroundColor: "#D6EFFF",
        flex: 1,
        borderRadius: theme.radii.md,
      }}
    />
  );

  const detailsFold = (
    <View
      style={{
        flex: 1,
        borderRadius: theme.radii.md,
      }}
    >
      <FoldView cover={blankFace} reveal={<ProductDetailsCard product={product} onPress={flip} />}>
        <ProductExpandedHero product={product} onPress={flip} />
      </FoldView>
    </View>
  );

  return (
    <View>
      <View style={{ height: PRODUCT_ROW_HEIGHT, margin: 10 }}>
        <FoldView
          expanded={expanded}
          onAnimationStart={handleAnimationStart}
          perspective={1000}
          cover={<ProductSummaryCard product={product} onPress={flip} />}
          reveal={detailsFold}
        >
          <ProductHeroImage product={product} onPress={flip} />
        </FoldView>
      </View>

      <Animated.View testID="product-row-spacer" pointerEvents="none" style={spacerStyle} />
    </View>
  );
}
