import { act, renderHook } from "@testing-library/react-native";
import { ROW_HEIGHT, useRowViewModel } from "../useRowViewModel";

describe("useRowViewModel", () => {
  it("starts collapsed with a zero spacer", async () => {
    const { result } = await renderHook(() => useRowViewModel());
    expect(result.current.expanded).toBe(false);
    expect(result.current.spacerHeight.value).toBe(0);
  });

  it("toggles expanded on flip", async () => {
    const { result } = await renderHook(() => useRowViewModel());
    await act(() => result.current.flip());
    expect(result.current.expanded).toBe(true);
    await act(() => result.current.flip());
    expect(result.current.expanded).toBe(false);
  });

  it("targets the spacer height from the reported animation height", async () => {
    const { result } = await renderHook(() => useRowViewModel());
    await act(() => result.current.handleAnimationStart(560, 360));
    expect(result.current.spacerHeight.value).toBe(360 - ROW_HEIGHT);
  });

  it("animates the spacer back to zero on collapse", async () => {
    const { result } = await renderHook(() => useRowViewModel());
    await act(() => result.current.handleAnimationStart(560, 360));
    await act(() => result.current.handleAnimationStart(560, ROW_HEIGHT));
    expect(result.current.spacerHeight.value).toBe(0);
  });
});
