import ProductExample from "../ProductExample";
import { renderWithStore } from "./renderWithStore";

describe("ProductExample", () => {
  it("renders one row per product", async () => {
    const { getAllByTestId } = await renderWithStore(<ProductExample />);
    expect(getAllByTestId("product-row-spacer")).toHaveLength(4);
  });

  it("renders a scrollable list", async () => {
    const { getByTestId } = await renderWithStore(<ProductExample />);
    expect(getByTestId("product-list")).toBeTruthy();
  });

  it("renders the app title header", async () => {
    const { getByTestId } = await renderWithStore(<ProductExample />);
    expect(getByTestId("app-title")).toBeTruthy();
  });
});
