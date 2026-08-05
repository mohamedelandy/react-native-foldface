import { Text, View } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import type { TestInstance } from "test-renderer";

import FoldView, { type FoldRef } from "../FoldView";

const layoutEvent = (layout: { x: number; y: number; width: number; height: number }) => ({
  nativeEvent: { layout },
});

const layout = { x: 0, y: 0, width: 100, height: 50 };

const parentOf = (element: TestInstance): TestInstance => {
  const parent = element.parent;
  if (parent == null) {
    throw new Error("Expected the element to have a parent");
  }
  return parent;
};

const ancestorOf = (element: TestInstance, levels: number): TestInstance =>
  levels === 0 ? element : ancestorOf(parentOf(element), levels - 1);

const findAnimatedStyleFn = (style: unknown): (() => unknown) | null => {
  if (Array.isArray(style)) {
    for (const entry of style) {
      const found = findAnimatedStyleFn(entry);
      if (found != null) {
        return found;
      }
    }
  }
  return typeof style === "function" ? (style as () => unknown) : null;
};

const rotateXOf = (element: TestInstance): string | undefined => {
  const style = parentOf(element).props["style"];
  const animatedStyle = findAnimatedStyleFn(style);
  const result = animatedStyle?.() as
    { transform?: Array<{ perspective?: number; rotateX?: string }> } | undefined;
  return result?.transform?.find((entry) => entry.rotateX)?.rotateX;
};

describe("FoldView", () => {
  it("renders the base content and faces once the base is laid out", async () => {
    const { getByTestId, queryByTestId } = await render(
      <FoldView
        cover={<Text testID="front">front</Text>}
        reveal={<Text testID="back">back</Text>}
      >
        <Text testID="base">base</Text>
      </FoldView>
    );

    expect(getByTestId("base")).toBeTruthy();
    expect(queryByTestId("front")).toBeNull();
    expect(queryByTestId("back")).toBeNull();

    await fireEvent(parentOf(getByTestId("base")), "layout", layoutEvent(layout));

    expect(getByTestId("front")).toBeTruthy();
    expect(getByTestId("back")).toBeTruthy();
  });

  it("keeps the front face interactive while collapsed and the back face interactive when expanded", async () => {
    const { getByTestId, rerender } = await render(
      <FoldView
        expanded={false}
        cover={<Text testID="front">front</Text>}
        reveal={<Text testID="back">back</Text>}
      >
        <Text testID="base">base</Text>
      </FoldView>
    );

    await fireEvent(parentOf(getByTestId("base")), "layout", layoutEvent(layout));

    expect(parentOf(getByTestId("front")).props["pointerEvents"]).toBe("auto");
    expect(parentOf(getByTestId("back")).props["pointerEvents"]).toBe("none");

    await rerender(
      <FoldView
        expanded
        cover={<Text testID="front">front</Text>}
        reveal={<Text testID="back">back</Text>}
      >
        <Text testID="base">base</Text>
      </FoldView>
    );

    await waitFor(() => {
      expect(parentOf(getByTestId("front")).props["pointerEvents"]).toBe("box-none");
      expect(parentOf(getByTestId("back")).props["pointerEvents"]).toBe("auto");
    });
  });

  it("flips the root's own faces when expanded", async () => {
    const { getByTestId, rerender } = await render(
      <FoldView
        expanded={false}
        cover={<Text testID="front">front</Text>}
        reveal={<Text testID="back">back</Text>}
      >
        <Text testID="base">base</Text>
      </FoldView>
    );

    await fireEvent(parentOf(getByTestId("base")), "layout", layoutEvent(layout));

    expect(rotateXOf(getByTestId("front"))).toBe("0deg");
    expect(rotateXOf(getByTestId("back"))).toBe("-180deg");

    await rerender(
      <FoldView
        expanded
        cover={<Text testID="front">front</Text>}
        reveal={<Text testID="back">back</Text>}
      >
        <Text testID="base">base</Text>
      </FoldView>
    );

    await waitFor(() => {
      expect(rotateXOf(getByTestId("front"))).toBe("180deg");
      expect(rotateXOf(getByTestId("back"))).toBe("0deg");
    });
  });

  it("flips the root's own faces back when collapsed", async () => {
    const { getByTestId, rerender } = await render(
      <FoldView
        expanded
        cover={<Text testID="front">front</Text>}
        reveal={<Text testID="back">back</Text>}
      >
        <Text testID="base">base</Text>
      </FoldView>
    );

    await fireEvent(parentOf(getByTestId("base")), "layout", layoutEvent(layout));

    await rerender(
      <FoldView
        expanded={false}
        cover={<Text testID="front">front</Text>}
        reveal={<Text testID="back">back</Text>}
      >
        <Text testID="base">base</Text>
      </FoldView>
    );

    await waitFor(() => {
      expect(rotateXOf(getByTestId("front"))).toBe("0deg");
      expect(rotateXOf(getByTestId("back"))).toBe("-180deg");
    });
  });

  it("calls the custom expand and animation callbacks when expanded", async () => {
    const expand = jest.fn(async (_foldViews: FoldRef[]) => {});
    const onAnimationStart = jest.fn();
    const onAnimationEnd = jest.fn();

    const renderFoldView = (expanded: boolean) => (
      <FoldView
        expanded={expanded}
        expand={expand}
        onAnimationStart={onAnimationStart}
        onAnimationEnd={onAnimationEnd}
        reveal={<Text>back</Text>}
      >
        <Text testID="base">base</Text>
      </FoldView>
    );

    const { getByTestId, rerender } = await render(renderFoldView(false));
    await fireEvent(parentOf(getByTestId("base")), "layout", layoutEvent(layout));

    await rerender(renderFoldView(true));

    await waitFor(() => expect(expand).toHaveBeenCalled());
    expect(onAnimationStart).toHaveBeenCalledWith(280, 100);
    expect(onAnimationEnd).toHaveBeenCalledWith(280, 100);
    expect(expand.mock.calls[0]?.[0]).toEqual([]);
  });

  it("registers nested fold views and accounts for their height and duration", async () => {
    const expand = jest.fn(async (_foldViews: FoldRef[]) => {});
    const onAnimationStart = jest.fn();
    const onAnimationEnd = jest.fn();

    const reveal = (
      <FoldView>
        <Text testID="nested-base">nested</Text>
      </FoldView>
    );

    const renderFoldView = (expanded: boolean) => (
      <FoldView
        expanded={expanded}
        expand={expand}
        onAnimationStart={onAnimationStart}
        onAnimationEnd={onAnimationEnd}
        reveal={reveal}
      >
        <Text testID="base">base</Text>
      </FoldView>
    );

    const { getByTestId, rerender } = await render(renderFoldView(false));
    await fireEvent(parentOf(getByTestId("base")), "layout", layoutEvent(layout));
    await fireEvent(
      parentOf(getByTestId("nested-base")),
      "layout",
      layoutEvent({ x: 0, y: 0, width: 100, height: 25 })
    );

    await rerender(renderFoldView(true));

    await waitFor(() => expect(expand).toHaveBeenCalled());
    const foldViews = expand.mock.calls[0]?.[0] ?? [];
    expect(foldViews).toHaveLength(1);
    expect(foldViews[0]?.getBaseHeight()).toBe(25);
    expect(foldViews[0]?.getFlipDuration()).toBe(280);
    expect(onAnimationStart).toHaveBeenCalledWith(560, 125);
    expect(onAnimationEnd).toHaveBeenCalledWith(560, 125);
  });

  it("calls the custom collapse and animation callbacks when collapsed", async () => {
    const collapse = jest.fn(async (_foldViews: FoldRef[]) => {});
    const onAnimationStart = jest.fn();
    const onAnimationEnd = jest.fn();

    const renderFoldView = (expanded: boolean) => (
      <FoldView
        expanded={expanded}
        collapse={collapse}
        onAnimationStart={onAnimationStart}
        onAnimationEnd={onAnimationEnd}
        reveal={<Text>back</Text>}
      >
        <Text testID="base">base</Text>
      </FoldView>
    );

    const { getByTestId, rerender } = await render(renderFoldView(true));
    await fireEvent(parentOf(getByTestId("base")), "layout", layoutEvent(layout));

    await rerender(renderFoldView(false));

    await waitFor(() => expect(collapse).toHaveBeenCalled());
    expect(onAnimationStart).toHaveBeenCalledWith(280, 50);
    await waitFor(() => expect(onAnimationEnd).toHaveBeenCalledWith(280, 50));
  });

  it("uses a smooth easing when flipping", async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const reanimated = require("react-native-reanimated") as {
      withTiming: (...args: unknown[]) => unknown;
    };
    const withTimingSpy = jest.spyOn(reanimated, "withTiming");

    try {
      const { getByTestId, rerender } = await render(
        <FoldView
          expanded={false}
          cover={<Text testID="front">front</Text>}
          reveal={<Text testID="back">back</Text>}
        >
          <Text testID="base">base</Text>
        </FoldView>
      );

      await fireEvent(parentOf(getByTestId("base")), "layout", layoutEvent(layout));

      await rerender(
        <FoldView
          expanded
          cover={<Text testID="front">front</Text>}
          reveal={<Text testID="back">back</Text>}
        >
          <Text testID="base">base</Text>
        </FoldView>
      );

      await waitFor(() => expect(withTimingSpy).toHaveBeenCalled());

      const configs = withTimingSpy.mock.calls.map((call) => call[1]) as Array<{
        easing?: unknown;
      }>;

      expect(configs.length).toBeGreaterThan(0);
      for (const config of configs) {
        expect(typeof config?.easing).toBe("function");
      }
    } finally {
      withTimingSpy.mockRestore();
    }
  });

  it("aggregates heights and durations for folds nested two levels deep", async () => {
    const expand = jest.fn(async (_foldViews: FoldRef[]) => {});
    const onAnimationStart = jest.fn();
    const onAnimationEnd = jest.fn();

    const deep = (
      <FoldView>
        <Text testID="deep-base">deep</Text>
      </FoldView>
    );
    const mid = (
      <FoldView reveal={deep}>
        <Text testID="mid-base">mid</Text>
      </FoldView>
    );

    const renderFoldView = (expanded: boolean) => (
      <FoldView
        expanded={expanded}
        expand={expand}
        onAnimationStart={onAnimationStart}
        onAnimationEnd={onAnimationEnd}
        reveal={mid}
      >
        <Text testID="base">base</Text>
      </FoldView>
    );

    const { getByTestId, rerender } = await render(renderFoldView(false));
    await fireEvent(parentOf(getByTestId("base")), "layout", layoutEvent(layout));
    await waitFor(() => expect(getByTestId("mid-base")).toBeTruthy());
    await fireEvent(
      parentOf(getByTestId("mid-base")),
      "layout",
      layoutEvent({ x: 0, y: 0, width: 100, height: 30 })
    );
    await waitFor(() => expect(getByTestId("deep-base")).toBeTruthy());
    await fireEvent(
      parentOf(getByTestId("deep-base")),
      "layout",
      layoutEvent({ x: 0, y: 0, width: 100, height: 20 })
    );

    await rerender(renderFoldView(true));

    await waitFor(() => expect(expand).toHaveBeenCalled());
    const foldViews = expand.mock.calls[0]?.[0] ?? [];
    expect(foldViews).toHaveLength(2);
    expect(foldViews[0]?.getBaseHeight()).toBe(30);
    expect(foldViews[1]?.getBaseHeight()).toBe(20);
    expect(onAnimationStart).toHaveBeenCalledWith(840, 150);
    await waitFor(() => expect(onAnimationEnd).toHaveBeenCalledWith(840, 150));
  });

  it("reports a taller flip height when the reveal wraps content taller than the base", async () => {
    const onAnimationStart = jest.fn();
    const onAnimationEnd = jest.fn();

    const renderFoldView = (expanded: boolean) => (
      <FoldView
        expanded={expanded}
        onAnimationStart={onAnimationStart}
        onAnimationEnd={onAnimationEnd}
        reveal={<Text testID="back">back</Text>}
      >
        <Text testID="base">base</Text>
      </FoldView>
    );

    const { getByTestId, rerender } = await render(renderFoldView(false));
    await fireEvent(parentOf(getByTestId("base")), "layout", layoutEvent(layout));
    await fireEvent(
      parentOf(getByTestId("back")),
      "layout",
      layoutEvent({ x: 0, y: 50, width: 100, height: 80 }),
    );

    await rerender(renderFoldView(true));

    await waitFor(() => expect(onAnimationEnd).toHaveBeenCalledWith(280, 130));
    expect(onAnimationStart).toHaveBeenCalledWith(280, 130);
  });

  it("aggregates measured reveal heights for folds nested two levels deep", async () => {
    const expand = jest.fn(async (_foldViews: FoldRef[]) => {});
    const onAnimationStart = jest.fn();
    const onAnimationEnd = jest.fn();

    const deep = (
      <FoldView>
        <Text testID="deep-base">deep</Text>
      </FoldView>
    );
    const mid = (
      <FoldView reveal={deep}>
        <Text testID="mid-base">mid</Text>
      </FoldView>
    );

    const renderFoldView = (expanded: boolean) => (
      <FoldView
        expanded={expanded}
        expand={expand}
        onAnimationStart={onAnimationStart}
        onAnimationEnd={onAnimationEnd}
        reveal={mid}
      >
        <Text testID="base">base</Text>
      </FoldView>
    );

    const { getByTestId, getAllByTestId, rerender } = await render(renderFoldView(false));
    await fireEvent(parentOf(getByTestId("base")), "layout", layoutEvent(layout));
    await waitFor(() => expect(getByTestId("mid-base")).toBeTruthy());
    await fireEvent(
      parentOf(getByTestId("mid-base")),
      "layout",
      layoutEvent({ x: 0, y: 0, width: 100, height: 30 }),
    );
    await waitFor(() => expect(getByTestId("deep-base")).toBeTruthy());
    await fireEvent(
      parentOf(getByTestId("deep-base")),
      "layout",
      layoutEvent({ x: 0, y: 0, width: 100, height: 20 }),
    );

    await fireEvent(
      ancestorOf(getAllByTestId("mid-base")[0] as TestInstance, 3),
      "layout",
      layoutEvent({ x: 0, y: 30, width: 100, height: 60 }),
    );
    await fireEvent(
      ancestorOf(getAllByTestId("deep-base")[0] as TestInstance, 3),
      "layout",
      layoutEvent({ x: 0, y: 30, width: 100, height: 40 }),
    );

    await rerender(renderFoldView(true));

    await waitFor(() => expect(expand).toHaveBeenCalled());
    expect(onAnimationStart).toHaveBeenCalledWith(840, 170);
    await waitFor(() => expect(onAnimationEnd).toHaveBeenCalledWith(840, 170));
  });

  it("flips nested fold faces when the root expands", async () => {
    const mid = (
      <FoldView
        cover={<Text testID="mid-front">mf</Text>}
        reveal={<Text testID="mid-back">mb</Text>}
      >
        <Text testID="mid-base">mid</Text>
      </FoldView>
    );

    const renderFoldView = (expanded: boolean) => (
      <FoldView expanded={expanded} reveal={mid}>
        <Text testID="base">base</Text>
      </FoldView>
    );

    const { getByTestId, rerender } = await render(renderFoldView(false));
    await fireEvent(parentOf(getByTestId("base")), "layout", layoutEvent(layout));
    await waitFor(() => expect(getByTestId("mid-base")).toBeTruthy());
    await fireEvent(
      parentOf(getByTestId("mid-base")),
      "layout",
      layoutEvent({ x: 0, y: 0, width: 100, height: 30 })
    );
    await waitFor(() => expect(getByTestId("mid-front")).toBeTruthy());

    await rerender(renderFoldView(true));

    await waitFor(() => {
      expect(rotateXOf(getByTestId("mid-front"))).toBe("180deg");
      expect(rotateXOf(getByTestId("mid-back"))).toBe("0deg");
    });
  });

  it("makes nested reveals touch-interactive when the root expands", async () => {
    const deep = (
      <FoldView
        cover={<Text testID="deep-front">df</Text>}
        reveal={<Text testID="deep-back">db</Text>}
      >
        <Text testID="deep-base">deep</Text>
      </FoldView>
    );
    const mid = (
      <FoldView
        cover={<Text testID="mid-front">mf</Text>}
        reveal={<View testID="mid-back-content">{deep}</View>}
      >
        <Text testID="mid-base">mid</Text>
      </FoldView>
    );

    const renderFoldView = (expanded: boolean) => (
      <FoldView expanded={expanded} reveal={mid}>
        <Text testID="base">base</Text>
      </FoldView>
    );

    const { getByTestId, rerender } = await render(renderFoldView(false));
    await fireEvent(parentOf(getByTestId("base")), "layout", layoutEvent(layout));
    await waitFor(() => expect(getByTestId("mid-base")).toBeTruthy());
    await fireEvent(
      parentOf(getByTestId("mid-base")),
      "layout",
      layoutEvent({ x: 0, y: 0, width: 100, height: 30 })
    );
    await waitFor(() => expect(getByTestId("deep-base")).toBeTruthy());
    await fireEvent(
      parentOf(getByTestId("deep-base")),
      "layout",
      layoutEvent({ x: 0, y: 0, width: 100, height: 20 })
    );

    expect(parentOf(getByTestId("mid-back-content")).props["pointerEvents"]).toBe("none");
    expect(parentOf(getByTestId("deep-back")).props["pointerEvents"]).toBe("none");

    await rerender(renderFoldView(true));

    await waitFor(() => {
      expect(parentOf(getByTestId("mid-back-content")).props["pointerEvents"]).toBe("auto");
      expect(parentOf(getByTestId("deep-back")).props["pointerEvents"]).toBe("auto");
      expect(parentOf(getByTestId("deep-front")).props["pointerEvents"]).toBe("box-none");
      expect(parentOf(getByTestId("mid-front")).props["pointerEvents"]).toBe("box-none");
    });
  });
});
