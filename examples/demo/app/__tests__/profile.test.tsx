import { fireEvent, render } from "@testing-library/react-native";
import AdditionalInfoCard from "../components/AdditionalInfoCard";
import InfoCard from "../components/InfoCard";
import PhotoCard from "../components/PhotoCard";
import ProfileCard from "../components/ProfileCard";
import ProfileDetailCard from "../components/ProfileDetailCard";

describe("profile components", () => {
  it("renders a profile summary with follow state", async () => {
    const { getByText, getByTestId } = await render(<InfoCard onPress={() => undefined} />);
    expect(getByText("Alex Morgan")).toBeTruthy();
    const followButton = getByTestId("follow-button");
    expect(followButton.props.accessibilityState?.selected).toBe(false);
    await fireEvent.press(followButton);
    expect(getByTestId("follow-button").props.accessibilityState?.selected).toBe(true);
  });

  it("renders the photo card and about card", async () => {
    const { getByText } = await render(
      <>
        <PhotoCard onPress={() => undefined} />
        <ProfileDetailCard onPress={() => undefined} />
      </>
    );
    expect(getByText("Photos")).toBeTruthy();
    expect(getByText("About")).toBeTruthy();
  });

  it("renders additional info with an interactive centerpiece", async () => {
    const onPress = jest.fn();
    const { getByTestId } = await render(<AdditionalInfoCard onPress={onPress} />);
    await fireEvent.press(getByTestId("highlights-centerpiece"));
    expect(onPress).toHaveBeenCalled();
  });

  it("preserves the nested fold structure", async () => {
    const { container } = await render(<ProfileCard onPress={() => undefined} />);
    expect(container.queryAll((node) => node.type === "Animated.View")).toHaveLength(0);
  });
});
