import { FlatList, StyleSheet, Text, View } from "react-native";

import NestedProductRow from "./NestedProductRow";
import ProductRow from "./ProductRow";
import { APP_TITLE, theme } from "./theme";
import { useProductExampleViewModel } from "./useProductExampleViewModel";

export default function ProductExample() {
  const { keyExtractor, rows } = useProductExampleViewModel();

  return (
    <View style={styles.container}>
      <Text style={styles.title} testID="app-title">
        {APP_TITLE}
      </Text>
      <FlatList
        testID="product-list"
        data={rows}
        keyExtractor={keyExtractor}
        renderItem={({ item }) =>
          item.variant === "nested" ? (
            <NestedProductRow product={item.product} />
          ) : (
            <ProductRow product={item.product} />
          )
        }
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
