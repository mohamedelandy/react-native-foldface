import { APP_TITLE } from "./theme";

const ROWS = [{ id: "row-1" }, { id: "row-2" }, { id: "row-3" }, { id: "row-4" }];

export function useExampleListViewModel() {
  return {
    rows: ROWS,
    keyExtractor: (item: { id: string }) => item.id,
    title: APP_TITLE,
  };
}
