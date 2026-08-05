import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import { DemoStoreProvider } from "./app/demoStore";
import ExampleList from "./app/ExampleList";
import ExampleSwitcher, { type ExampleName } from "./app/ExampleSwitcher";
import ProductExample from "./app/ProductExample";

export default function App() {
  const [example, setExample] = useState<ExampleName>("profile");

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <DemoStoreProvider>
            <ExampleSwitcher example={example} onChange={setExample} />
            {example === "profile" ? <ExampleList /> : <ProductExample />}
          </DemoStoreProvider>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  content: {
    flex: 1,
  },
});
