import { renderHook } from "@testing-library/react-native";
import { useProductExampleViewModel } from "../useProductExampleViewModel";

describe("useProductExampleViewModel", () => {
  it("provides four product rows", async () => {
    const { result } = await renderHook(() => useProductExampleViewModel());
    expect(result.current.rows).toHaveLength(4);
    expect(result.current.rows.map((row) => row.variant)).toEqual([
      "nested",
      "nested",
      "single",
      "single",
    ]);
    expect(result.current.rows.map((row) => result.current.keyExtractor(row))).toEqual([
      "aurora-sneakers",
      "pulse-headphones",
      "apex-watch",
      "terra-backpack",
    ]);
  });
});
