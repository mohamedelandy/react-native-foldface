import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../theme";

type SectionLabelProps = {
  title: string;
  right?: ReactNode;
  testID?: string;
};

export function SectionLabel({ title, right, testID }: SectionLabelProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label} testID={testID}>
        {title}
      </Text>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  label: theme.typography.label,
});
