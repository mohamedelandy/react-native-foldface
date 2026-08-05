import { fireEvent } from "@testing-library/react-native";
import type { LayoutChangeEvent } from "react-native";
import { PRODUCTS } from "../productData";
import ProductRow from "../ProductRow";
import { renderWithStore } from "./renderWithStore";

const layoutEvent = (layout: {
  x: number;
  y: number;
  width: number;
  height: number;
}): LayoutChangeEvent => ({ nativeEvent: { layout } }) as LayoutChangeEvent;

describe("ProductRow", () => {
  it("renders a spacer driven by the animated height", async () => {
    const { getByTestId } = await renderWithStore(<ProductRow product={PRODUCTS[0]} />);
    const spacer = getByTestId("product-row-spacer");
    expect(typeof spacer.props.style).toBe("function");
  });

  it("measures the base and renders the fold faces", async () => {
    const { container } = await renderWithStore(<ProductRow product={PRODUCTS[0]} />);
    expect(container.queryAll((node) => node.type === "Animated.View")).toHaveLength(1);

    const base = container.queryAll((node) => node.props.onLayout != null)[0];
    await fireEvent(base, "layout", layoutEvent({ x: 0, y: 0, width: 300, height: 180 }));

    expect(container.queryAll((node) => node.type === "Animated.View")).toHaveLength(3);
  });
});
