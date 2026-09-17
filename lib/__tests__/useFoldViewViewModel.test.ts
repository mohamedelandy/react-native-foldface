import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { LayoutChangeEvent } from "react-native";
import type { Layout, FoldRef } from "../types";
import { useFoldViewViewModel, sequentialExpand, sequentialCollapse } from "../useFoldViewViewModel";

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

  it("removes unregistered children from flip height and duration", async () => {
    const onAnimationStart = jest.fn();
    const onAnimationEnd = jest.fn();

    const { result, rerender } = await renderHook(
      (props: { expanded: boolean }) =>
        useFoldViewViewModel({ expanded: props.expanded, onAnimationStart, onAnimationEnd }),
      { initialProps: { expanded: false } },
    );

    await act(() => result.current.handleLayout(layoutEvent(layout)));

    const fakeFold = makeFakeFold();
    let unsubscribe: (() => void) | undefined;
    await act(() => {
      unsubscribe = result.current.contextValue?.(fakeFold);
      expect(unsubscribe).toBeDefined();
    });

    await act(() => {
      unsubscribe?.();
    });

    await rerender({ expanded: true });

    await waitFor(() => expect(onAnimationEnd).toHaveBeenCalled());
    expect(onAnimationStart).toHaveBeenCalledWith(280, 100);
    expect(onAnimationEnd).toHaveBeenCalledWith(280, 100);
    expect(fakeFold.expand).not.toHaveBeenCalled();
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

describe("sequentialExpand", () => {
  it("expands folds in sequential order", async () => {
    const order: number[] = [];

    const fold1 = makeFakeFold() as unknown as FoldRef;
    fold1.expand = jest.fn(async () => {
      order.push(1);
    });

    const fold2 = makeFakeFold() as unknown as FoldRef;
    fold2.expand = jest.fn(async () => {
      order.push(2);
    });

    const fold3 = makeFakeFold() as unknown as FoldRef;
    fold3.expand = jest.fn(async () => {
      order.push(3);
    });

    await sequentialExpand([fold1, fold2, fold3]);

    expect(order).toEqual([1, 2, 3]);
    expect(fold1.expand).toHaveBeenCalledTimes(1);
    expect(fold2.expand).toHaveBeenCalledTimes(1);
    expect(fold3.expand).toHaveBeenCalledTimes(1);
  });
});

describe("sequentialCollapse", () => {
  it("collapses folds in reverse sequential order", async () => {
    const order: number[] = [];

    const fold1 = makeFakeFold() as unknown as FoldRef;
    fold1.collapse = jest.fn(async () => {
      order.push(1);
    });

    const fold2 = makeFakeFold() as unknown as FoldRef;
    fold2.collapse = jest.fn(async () => {
      order.push(2);
    });

    const fold3 = makeFakeFold() as unknown as FoldRef;
    fold3.collapse = jest.fn(async () => {
      order.push(3);
    });

    await sequentialCollapse([fold1, fold2, fold3]);

    expect(order).toEqual([3, 2, 1]);
    expect(fold1.collapse).toHaveBeenCalledTimes(1);
    expect(fold2.collapse).toHaveBeenCalledTimes(1);
    expect(fold3.collapse).toHaveBeenCalledTimes(1);
  });
});
