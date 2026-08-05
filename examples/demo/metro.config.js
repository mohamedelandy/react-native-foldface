const { getDefaultConfig } = require("expo/metro-config");

const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// Deduplicate the React-native dependency family across the monorepo.
// The library is linked via `file:../..` (symlink), so without this metro
// resolves `react`/`react-native`/`react-native-reanimated`/`react-native-worklets`
// from BOTH the workspace root and the example app, producing two React
// instances and "Invalid hook call / Cannot read property 'useContext' of null".
const DEDUPE_MODULES = new Set([
  "react",
  "react-native",
  "react-native-reanimated",
  "react-native-worklets",
]);

const defaultResolver = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (DEDUPE_MODULES.has(moduleName)) {
    return context.resolveRequest(
      { ...context, originModulePath: path.join(projectRoot, "index.ts") },
      moduleName,
      platform
    );
  }
  return defaultResolver
    ? defaultResolver(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
