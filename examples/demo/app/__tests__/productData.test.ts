import { PRODUCTS, PRODUCT_ROWS } from "../productData";

describe("product data", () => {
  it("keeps four rows with the approved variant order", () => {
    expect(PRODUCT_ROWS).toHaveLength(4);
    expect(PRODUCT_ROWS.map((row) => row.variant)).toEqual([
      "nested",
      "nested",
      "single",
      "single",
    ]);
  });

  it("enriches every product", () => {
    expect(PRODUCTS).toHaveLength(4);
    for (const product of PRODUCTS) {
      expect(product.brand.length).toBeGreaterThan(0);
      expect(product.badges).toBeInstanceOf(Array);
      expect(product.images.length).toBeGreaterThanOrEqual(3);
      expect(product.highlights.length).toBeGreaterThanOrEqual(3);
      expect(product.reviews.length).toBeGreaterThanOrEqual(2);
      expect(typeof product.freeShipping).toBe("boolean");
      const breakdownTotal =
        product.ratingBreakdown[5] +
        product.ratingBreakdown[4] +
        product.ratingBreakdown[3] +
        product.ratingBreakdown[2] +
        product.ratingBreakdown[1];
      expect(breakdownTotal).toBe(product.reviewCount);
    }
  });

  it("provides a shipping threshold for every product", () => {
    for (const product of PRODUCTS) {
      expect(product.shipping).toBeDefined();
      expect(product.shipping?.freeThreshold).toBeGreaterThanOrEqual(0);
      expect(product.shipping?.etaDays.length).toBeGreaterThan(0);
    }
  });
});
