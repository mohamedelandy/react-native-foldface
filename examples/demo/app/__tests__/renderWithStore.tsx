import { render } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { DemoStoreProvider } from "../demoStore";

export const renderWithStore = (ui: ReactElement) =>
  render(<DemoStoreProvider>{ui}</DemoStoreProvider>);
