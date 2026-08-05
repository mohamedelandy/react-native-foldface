import { FlatList, StyleSheet, Text, View } from "react-native";

import Row from "./Row";
import { theme } from "./theme";
import { useExampleListViewModel } from "./useExampleListViewModel";

export default function ExampleList() {
  const { keyExtractor, rows, title } = useExampleListViewModel();

  return (
    <View style={styles.container}>
      <Text style={styles.title} testID="app-title">
        {title}
      </Text>
      <FlatList
        testID="example-list"
        data={rows}
        keyExtractor={keyExtractor}
        renderItem={() => <Row />}
        contentContainerStyle={styles.content}
        initialNumToRender={rows.length}
        maxToRenderPerBatch={rows.length}
        removeClippedSubviews={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  title: {
    ...theme.typography.title,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
  },
  content: {
    paddingBottom: theme.spacing.xl,
  },
});
