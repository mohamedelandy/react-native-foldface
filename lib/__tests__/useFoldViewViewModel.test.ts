import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { LayoutChangeEvent } from "react-native";
import type { Layout } from "../types";
import { useFoldViewViewModel } from "../useFoldViewViewModel";

const layout: Layout = { x: 0, y: 0, width: 100, height: 50 };

const layoutEvent = (value: Layout): LayoutChangeEvent =>
  ({ nativeEvent: { layout: value } }) as LayoutChangeEvent;

const makeFakeFold = () => ({
  expand: jest.fn(async () => {}),
  collapse: jest.fn(async () => {}),
  rasterize: jest.fn(async () => {}),
  getBaseHeight: jest.fn(() => 25),
  getFlipDuration: jest.fn(() => 280),
  getRevealHeight: jest.fn(() => 25),
  getTreeRevealHeight: jest.fn(() => 25),
});

describe("useFoldViewViewModel", () => {
  it("treats a null register as the root and provides a registration function", async () => {
    const { result } = await renderHook(() => useFoldViewViewModel({}));
    expect(result.current.isRoot).toBe(true);
    expect(typeof result.current.contextValue).toBe("function");
  });

  it("records the base layout", async () => {
    const { result } = await renderHook(() => useFoldViewViewModel({}));
    await act(() => result.current.handleLayout(layoutEvent(layout)));
    expect(result.current.baseLayout).toEqual(layout);
  });

  it("reports the double-counted base height plus nested heights on expand", async () => {
    const onAnimationStart = jest.fn();
    const onAnimationEnd = jest.fn();

    const { result, rerender } = await renderHook(
      (props: { expanded: boolean }) =>
        useFoldViewViewModel({ expanded: props.expanded, onAnimationStart, onAnimationEnd }),
      { initialProps: { expanded: false } },
    );

    await act(() => result.current.handleLayout(layoutEvent(layout)));

    const fakeFold = makeFakeFold();
    await act(() => {
      const unsubscribe = result.current.contextValue?.(fakeFold);
      expect(unsubscribe).toBeDefined();
    });

    await rerender({ expanded: true });

    await waitFor(() => expect(onAnimationEnd).toHaveBeenCalled());
    expect(onAnimationStart).toHaveBeenCalledWith(560, 125);
    expect(onAnimationEnd).toHaveBeenCalledWith(560, 125);
    expect(fakeFold.expand).toHaveBeenCalled();
  });

  it("uses a measured reveal height taller than the base in the expanded height", async () => {
    const onAnimationStart = jest.fn();
    const onAnimationEnd = jest.fn();

    const { result, rerender } = await renderHook(
      (props: { expanded: boolean }) =>
        useFoldViewViewModel({ expanded: props.expanded, onAnimationStart, onAnimationEnd }),
      { initialProps: { expanded: false } },
    );

    await act(() => result.current.handleLayout(layoutEvent(layout)));
    await act(() =>
      result.current.handleRevealLayout(layoutEvent({ x: 0, y: 50, width: 100, height: 80 })),
    );

    await rerender({ expanded: true });

    await waitFor(() => expect(onAnimationEnd).toHaveBeenCalled());
    expect(onAnimationStart).toHaveBeenCalledWith(280, 130);
  });

  it("animates the root faces when expanded", async () => {
    const { result, rerender } = await renderHook(
      (props: { expanded: boolean }) => useFoldViewViewModel({ expanded: props.expanded }),
      { initialProps: { expanded: false } },
    );

    expect(result.current.isFlipped).toBe(false);

    await rerender({ expanded: true });

    await waitFor(() => expect(result.current.isFlipped).toBe(true));
  });

  it("expands children sequentially and collapses them in reverse order", async () => {
    const { result, rerender } = await renderHook(
      (props: { expanded: boolean }) => useFoldViewViewModel({ expanded: props.expanded }),
      { initialProps: { expanded: false } },
    );

    const callOrder: string[] = [];

    const fold1 = makeFakeFold();
    fold1.expand.mockImplementation(async () => { callOrder.push('expand1'); });
    fold1.collapse.mockImplementation(async () => { callOrder.push('collapse1'); });

    const fold2 = makeFakeFold();
    fold2.expand.mockImplementation(async () => { callOrder.push('expand2'); });
    fold2.collapse.mockImplementation(async () => { callOrder.push('collapse2'); });

    await act(() => {
      result.current.contextValue?.(fold1);
      result.current.contextValue?.(fold2);
    });

    await rerender({ expanded: true });

    await waitFor(() => {
      expect(callOrder).toEqual(['expand1', 'expand2']);
    });

    callOrder.length = 0;

    await rerender({ expanded: false });

    await waitFor(() => {
      expect(callOrder).toEqual(['collapse2', 'collapse1']);
    });
  });
});
