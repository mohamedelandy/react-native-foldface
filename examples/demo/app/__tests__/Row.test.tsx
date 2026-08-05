import { fireEvent, render } from "@testing-library/react-native";
import type { LayoutChangeEvent } from "react-native";
import Row from "../Row";

const layoutEvent = (layout: {
  x: number;
  y: number;
  width: number;
  height: number;
}): LayoutChangeEvent => ({ nativeEvent: { layout } }) as LayoutChangeEvent;

describe("Row", () => {
  it("renders a spacer driven by the animated height", async () => {
    const { getByTestId } = await render(<Row />);
    const spacer = getByTestId("row-spacer");
    expect(typeof spacer.props.style).toBe("function");
  });

  it("measures the base and renders the fold faces", async () => {
    const { container, getByTestId } = await render(<Row />);
    expect(container.queryAll((node) => node.type === "Animated.View")).toHaveLength(1);

    const base = container.queryAll((node) => node.props.onLayout != null)[0];
    await fireEvent(base, "layout", layoutEvent({ x: 0, y: 0, width: 300, height: 180 }));

    const style = Array.isArray(base.props.style) ? base.props.style : [base.props.style];
    expect(style).toEqual(expect.arrayContaining([{ height: 180 }]));
    expect(container.queryAll((node) => node.type === "Animated.View")).toHaveLength(3);
    expect(getByTestId("row-spacer")).toBeTruthy();
  });
});
