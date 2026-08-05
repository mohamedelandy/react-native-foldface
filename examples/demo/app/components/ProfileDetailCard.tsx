import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";
import { Chip } from "./common/Chip";
import { SectionLabel } from "./common/SectionLabel";

type ProfileDetailCardProps = {
  onPress: () => void;
};

export default function ProfileDetailCard(_props: ProfileDetailCardProps) {
  return (
    <View style={styles.container}>
      <SectionLabel title="About" />
      <View style={styles.row}>
        <Text style={styles.key}>Location</Text>
        <Text style={styles.value}>San Francisco, CA</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.key}>Joined</Text>
        <Text style={styles.value}>March 2021</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.key}>Website</Text>
        <Text style={styles.value}>alexmorgan.design</Text>
      </View>
      <View style={styles.tags}>
        <Chip label="Design" />
        <Chip label="React Native" />
        <Chip label="Motion" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  key: {
    ...theme.typography.caption,
  },
  value: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
});
