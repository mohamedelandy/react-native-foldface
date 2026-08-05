import { createContext } from "react";
import type { Register } from "./types";

export const FoldViewContext = createContext<Register | null>(null);
