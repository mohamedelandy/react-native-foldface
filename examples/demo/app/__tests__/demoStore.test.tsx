import { act, renderHook } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { DemoStoreProvider, useDemoStore } from "../demoStore";

const wrapper = ({ children }: { children: ReactNode }) => (
  <DemoStoreProvider>{children}</DemoStoreProvider>
);

describe("DemoStore", () => {
  it("throws when used outside the provider", async () => {
    await expect(renderHook(() => useDemoStore())).rejects.toThrow();
  });

  it("selects an option per product", async () => {
    const { result } = await renderHook(() => useDemoStore(), { wrapper });
    expect(result.current.selectedOptions).toEqual({});
    await act(() => result.current.selectOption("p1", "opt-a"));
    await act(() => result.current.selectOption("p2", "opt-b"));
    expect(result.current.selectedOptions).toEqual({ p1: "opt-a", p2: "opt-b" });
  });

  it("toggles the wishlist per product", async () => {
    const { result } = await renderHook(() => useDemoStore(), { wrapper });
    expect(result.current.isWishlisted("p1")).toBe(false);
    await act(() => result.current.toggleWishlist("p1"));
    expect(result.current.isWishlisted("p1")).toBe(true);
    await act(() => result.current.toggleWishlist("p1"));
    expect(result.current.isWishlisted("p1")).toBe(false);
  });

  it("adds to cart, increments, decrements, and removes", async () => {
    const { result } = await renderHook(() => useDemoStore(), { wrapper });
    expect(result.current.quantity("p1")).toBe(0);
    await act(() => result.current.addToCart("p1"));
    await act(() => result.current.addToCart("p1"));
    expect(result.current.quantity("p1")).toBe(2);
    expect(result.current.cartCount).toBe(2);
    await act(() => result.current.decrementCart("p1"));
    expect(result.current.quantity("p1")).toBe(1);
    await act(() => result.current.removeFromCart("p1"));
    expect(result.current.quantity("p1")).toBe(0);
    expect(result.current.cartCount).toBe(0);
  });
});
