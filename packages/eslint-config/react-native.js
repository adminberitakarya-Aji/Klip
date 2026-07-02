// @klip/eslint-config/react-native.js
// Config for the Expo/React Native app.
//
// NOTE: `eslint-plugin-react-native` is intentionally NOT used here.
// Its component-detection utility (lib/util/Components.js) still calls
// the removed `context.getScope()` API and hard-crashes ESLint on almost
// every rule it ships (no-unused-styles, no-inline-styles, etc.) as soon
// as it touches a component — confirmed against eslint-plugin-react-native@4.1.0
// + eslint@9.39.4. Revisit once upstream publishes an ESLint-9-compatible release.
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import base from "./base.js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...base,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // expo-router/RN entry points don't import React explicitly,
      // and prop-types are redundant with TypeScript.
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
  {
    ignores: ["**/android/**", "**/ios/**", "**/metro.config.*"],
  },
];
