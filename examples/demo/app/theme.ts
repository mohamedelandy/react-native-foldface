export const APP_TITLE = "FoldFace";

export const theme = {
  colors: {
    background: "#F2F2F7",
    surface: "#FFFFFF",
    text: "#1C1C1E",
    textSecondary: "#6E6E73",
    textTertiary: "#8E8E93",
    border: "#E5E5EA",
    accent: "#007AFF",
    accentSoft: "#E5F1FF",
    success: "#2E7D32",
    warning: "#F5A623",
    danger: "#D8392C",
    star: "#F5A623",
    overlay: "rgba(0,0,0,0.35)",
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  radii: { sm: 8, md: 12, lg: 16, full: 999 },
  shadows: {
    card: {
      shadowColor: "#000000",
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { height: 4, width: 0 },
      elevation: 3,
    } as const,
    elevated: {
      shadowColor: "#000000",
      shadowOpacity: 0.12,
      shadowRadius: 16,
      shadowOffset: { height: 6, width: 0 },
      elevation: 5,
    } as const,
  },
  typography: {
    title: { fontSize: 17, fontWeight: "700" as const, color: "#1C1C1E" },
    subtitle: { fontSize: 15, fontWeight: "600" as const, color: "#1C1C1E" },
    body: { fontSize: 13, color: "#3A3A3C" },
    caption: { fontSize: 12, color: "#6E6E73" },
    label: {
      fontSize: 11,
      fontWeight: "600" as const,
      textTransform: "uppercase" as const,
      letterSpacing: 1,
      color: "#6E6E73",
    },
  },
  layout: { ROW_HEIGHT: 180, CARD_MARGIN: 10, LIST_PADDING: 16 },
} as const;

export type Theme = typeof theme;
