import { fireEvent } from "@testing-library/react-native";
import { PRODUCTS } from "../productData";
import ProductExpandedHero from "../components/ProductExpandedHero";
import { renderWithStore } from "./renderWithStore";

describe("ProductExpandedHero", () => {
  it("renders category, title, description, and price", async () => {
    const { getByText } = await renderWithStore(
      <ProductExpandedHero product={PRODUCTS[2]} onPress={() => undefined} />
    );
    expect(getByText("Wearables")).toBeTruthy();
    expect(getByText("Apex Fitness Watch")).toBeTruthy();
    expect(getByText("$224.10")).toBeTruthy();
  });

  it("reports a swatch selection on the current option", async () => {
    const { getByText, getAllByTestId } = await renderWithStore(
      <ProductExpandedHero product={PRODUCTS[0]} onPress={() => undefined} />
    );
    expect(getByText("$103.20")).toBeTruthy();
    const swatch = getAllByTestId("color-swatch")[0] as {
      props: { accessibilityState?: { selected?: boolean } };
    };
    await fireEvent.press(swatch as never);
    expect(swatch.props.accessibilityState?.selected).toBe(true);
  });
});
