import { render } from "@testing-library/react-native";
import ExampleList from "../ExampleList";

describe("ExampleList", () => {
  it("renders all four rows", async () => {
    const { getAllByTestId } = await render(<ExampleList />);
    expect(getAllByTestId("row-spacer")).toHaveLength(4);
  });

  it("renders a scrollable list", async () => {
    const { getByTestId } = await render(<ExampleList />);
    expect(getByTestId("example-list")).toBeTruthy();
  });

  it("renders the app title header", async () => {
    const { getByTestId } = await render(<ExampleList />);
    expect(getByTestId("app-title")).toBeTruthy();
  });
});
