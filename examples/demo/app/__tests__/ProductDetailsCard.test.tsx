import { fireEvent } from "@testing-library/react-native";
import { PRODUCTS } from "../productData";
import ProductDetailsCard from "../components/ProductDetailsCard";
import { renderWithStore } from "./renderWithStore";

describe("ProductDetailsCard", () => {
  it("renders the detail sections", async () => {
    const { getByText } = await renderWithStore(
      <ProductDetailsCard product={PRODUCTS[0]} onPress={() => undefined} />
    );
    expect(getByText("Highlights")).toBeTruthy();
    expect(getByText("Description")).toBeTruthy();
    expect(getByText("Ratings")).toBeTruthy();
    expect(getByText("Shipping & returns")).toBeTruthy();
  });

  it("adds to cart and shows the quantity stepper", async () => {
    const { getByTestId } = await renderWithStore(
      <ProductDetailsCard product={PRODUCTS[0]} onPress={() => undefined} />
    );
    await fireEvent.press(getByTestId("add-to-cart"));
    expect(getByTestId("cart-quantity").props.children).toBe(1);
    await fireEvent.press(getByTestId("cart-increment"));
    expect(getByTestId("cart-quantity").props.children).toBe(2);
    await fireEvent.press(getByTestId("cart-decrement"));
    expect(getByTestId("cart-quantity").props.children).toBe(1);
  });

  it("toggles the wishlist", async () => {
    const { getByTestId } = await renderWithStore(
      <ProductDetailsCard product={PRODUCTS[0]} onPress={() => undefined} />
    );
    const heart = getByTestId("details-wishlist");
    expect(heart.props.accessibilityState?.selected).toBe(false);
    await fireEvent.press(heart);
    expect(getByTestId("details-wishlist").props.accessibilityState?.selected).toBe(true);
  });
});
