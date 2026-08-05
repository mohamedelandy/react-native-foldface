import { PRODUCT_ROWS, type ProductRowItem } from "./productData";

export function useProductExampleViewModel() {
  return {
    rows: PRODUCT_ROWS,
    keyExtractor: (item: ProductRowItem) => item.id,
  };
}
