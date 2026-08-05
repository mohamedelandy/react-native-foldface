import { fireEvent, render } from "@testing-library/react-native";
import AttributeSwatches from "../components/AttributeSwatches";
import type { ProductAttribute } from "../productTypes";

const ATTRIBUTES: ProductAttribute[] = [
  { id: "c1", title: "Color", value: "Black", type: "COLOR", hex: "#1C1C1E" },
  { id: "s1", title: "Size", value: "42", type: "SIZE" },
];

describe("AttributeSwatches", () => {
  it("renders a color swatch and a size chip", async () => {
    const { getByTestId, getAllByTestId } = await render(
      <AttributeSwatches attributes={ATTRIBUTES} />
    );
    expect(getAllByTestId("color-swatch")).toHaveLength(1);
    expect(getAllByTestId("attribute-chip")).toHaveLength(1);
    expect(getByTestId("swatch-value")).toBeTruthy();
  });

  it("reports a selection", async () => {
    const onSelect = jest.fn();
    const { getAllByTestId } = await render(
      <AttributeSwatches attributes={ATTRIBUTES} onSelect={onSelect} />
    );
    await fireEvent.press(getAllByTestId("color-swatch")[0] as never);
    expect(onSelect).toHaveBeenCalledWith("Color", "Black");
  });

  it("marks the selected value", async () => {
    const { getAllByTestId } = await render(
      <AttributeSwatches
        attributes={ATTRIBUTES}
        selectedValues={{ Color: "Black" }}
        onSelect={() => undefined}
      />
    );
    const swatch = getAllByTestId("color-swatch")[0] as {
      props: { accessibilityState?: { selected?: boolean } };
    };
    expect(swatch.props.accessibilityState?.selected).toBe(true);
  });
});
