import { renderHook } from "@testing-library/react-native";
import { useExampleListViewModel } from "../useExampleListViewModel";

describe("useExampleListViewModel", () => {
  it("provides four rows", async () => {
    const { result } = await renderHook(() => useExampleListViewModel());
    expect(result.current.rows).toHaveLength(4);
    expect(result.current.rows.map((row) => result.current.keyExtractor(row))).toEqual([
      "row-1",
      "row-2",
      "row-3",
      "row-4",
    ]);
  });

  it("provides the app title", async () => {
    const { result } = await renderHook(() => useExampleListViewModel());
    expect(result.current.title).toBe("FoldFace");
  });
});
