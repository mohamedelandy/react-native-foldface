import { fireEvent } from "@testing-library/react-native";
import { PRODUCTS } from "../productData";
import ProductSummaryCard from "../components/ProductSummaryCard";
import { renderWithStore } from "./renderWithStore";

describe("ProductSummaryCard", () => {
  it("renders title, price, rating, and stock", async () => {
    const { getByText } = await renderWithStore(
      <ProductSummaryCard product={PRODUCTS[0]} onPress={() => undefined} />
    );
    expect(getByText("Aurora Sneakers")).toBeTruthy();
    expect(getByText("$103.20")).toBeTruthy();
    expect(getByText("4.8 (213)")).toBeTruthy();
  });

  it("toggles the wishlist", async () => {
    const { getByTestId } = await renderWithStore(
      <ProductSummaryCard product={PRODUCTS[0]} onPress={() => undefined} />
    );
    const heart = getByTestId("summary-wishlist");
    expect(heart.props.accessibilityState?.selected).toBe(false);
    await fireEvent.press(heart);
    expect(getByTestId("summary-wishlist").props.accessibilityState?.selected).toBe(true);
  });
});
