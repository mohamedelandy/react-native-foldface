import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";
import { Badge } from "../components/common/Badge";
import { Chip } from "../components/common/Chip";
import { IconButton } from "../components/common/IconButton";
import { RatingStars } from "../components/common/RatingStars";
import { SectionLabel } from "../components/common/SectionLabel";
import { ThemeCard } from "../components/common/ThemeCard";

describe("shared primitives", () => {
  it("renders a ThemeCard and forwards presses", async () => {
    const onPress = jest.fn();
    const { getByTestId } = await render(
      <ThemeCard testID="card" onPress={onPress}>
        <Text>hello</Text>
      </ThemeCard>
    );
    expect(getByTestId("card")).toBeTruthy();
    await fireEvent.press(getByTestId("card"));
    expect(onPress).toHaveBeenCalled();
  });

  it("renders a SectionLabel with an optional right element", async () => {
    const { getByText } = await render(
      <SectionLabel title="Details" right={<Text testID="right">+</Text>} />
    );
    expect(getByText("Details")).toBeTruthy();
    expect(getByText("+")).toBeTruthy();
  });

  it("renders a Chip with a tone label", async () => {
    const { getByText } = await render(<Chip label="In stock" tone="success" />);
    expect(getByText("In stock")).toBeTruthy();
  });

  it("renders a Badge", async () => {
    const { getByText } = await render(<Badge label="New" />);
    expect(getByText("New")).toBeTruthy();
  });

  it("renders stars for a rating", async () => {
    const { getByTestId } = await render(<RatingStars rating={4.5} testID="stars" />);
    expect(getByTestId("stars").props.children).toBe("★★★★☆");
  });

  it("renders an IconButton that reports presses and active state", async () => {
    const onPress = jest.fn();
    const { getByTestId } = await render(
      <IconButton glyph="♥" onPress={onPress} active testID="heart" />
    );
    const button = getByTestId("heart");
    expect(button.props.accessibilityState?.selected).toBe(true);
    await fireEvent.press(button);
    expect(onPress).toHaveBeenCalled();
  });
});
