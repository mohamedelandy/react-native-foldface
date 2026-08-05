import { render } from "@testing-library/react-native";
import PriceTag from "../components/PriceTag";

describe("PriceTag", () => {
  it("renders a final price", async () => {
    const { getByText } = await render(
      <PriceTag priceBeforeDiscount={129} discountValue={0} finalPrice={129} />
    );
    expect(getByText("$129.00")).toBeTruthy();
  });

  it("renders compare price and discount badge when discounted", async () => {
    const { getByText } = await render(
      <PriceTag priceBeforeDiscount={129} discountValue={25.8} finalPrice={103.2} />
    );
    expect(getByText("$103.20")).toBeTruthy();
    expect(getByText("$129.00")).toBeTruthy();
    expect(getByText("-20%")).toBeTruthy();
  });
});
