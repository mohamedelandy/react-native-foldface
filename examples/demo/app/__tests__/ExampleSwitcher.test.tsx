import { fireEvent, render } from "@testing-library/react-native";
import ExampleSwitcher from "../ExampleSwitcher";

describe("ExampleSwitcher", () => {
  it("renders both example options", async () => {
    const { getByTestId } = await render(
      <ExampleSwitcher example="profile" onChange={() => undefined} />
    );
    expect(getByTestId("switcher-profile")).toBeTruthy();
    expect(getByTestId("switcher-products")).toBeTruthy();
  });

  it("reports the chosen example", async () => {
    const onChange = jest.fn();
    const { getByTestId } = await render(<ExampleSwitcher example="profile" onChange={onChange} />);
    await fireEvent.press(getByTestId("switcher-products"));
    expect(onChange).toHaveBeenCalledWith("products");
  });
});
