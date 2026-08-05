import { View } from "react-native";
import Animated from "react-native-reanimated";
import FoldView from "react-native-foldface";

import ProductDetailsCard from "./components/ProductDetailsCard";
import ProductHeroImage from "./components/ProductHeroImage";
import ProductSummaryCard from "./components/ProductSummaryCard";
import type { Product } from "./productTypes";
import { PRODUCT_ROW_HEIGHT, useProductRowViewModel } from "./useProductRowViewModel";

type ProductRowProps = {
  product: Product;
};

export default function ProductRow({ product }: ProductRowProps) {
  const { expanded, flip, handleAnimationStart, spacerStyle } = useProductRowViewModel();

  return (
    <View>
      <View style={{ height: PRODUCT_ROW_HEIGHT, margin: 10 }}>
        <FoldView
          expanded={expanded}
          onAnimationStart={handleAnimationStart}
          perspective={1000}
          cover={<ProductSummaryCard product={product} onPress={flip} />}
          reveal={<ProductDetailsCard product={product} onPress={flip} />}
        >
          <ProductHeroImage product={product} onPress={flip} />
        </FoldView>
      </View>

      <Animated.View testID="product-row-spacer" pointerEvents="none" style={spacerStyle} />
    </View>
  );
}
