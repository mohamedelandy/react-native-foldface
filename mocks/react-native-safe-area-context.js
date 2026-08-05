export const SafeAreaView = ({ children, style }) => <div style={style}>{children}</div>;
export const useSafeAreaInsets = () => ({ top: 0, bottom: 0, left: 0, right: 0 });
export const useSafeAreaFrame = () => ({ x: 0, y: 0, width: 0, height: 0 });
export const SafeAreaProvider = ({ children }) => <div>{children}</div>;
export const SafeAreaConsumer = ({ children }) => <div>{children}</div>;
