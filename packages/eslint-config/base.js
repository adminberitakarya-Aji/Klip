// @klip/eslint-config/base.js
// Shared rules for every workspace (web, mobile, and plain TS packages).
// Kept syntax-only (no type-aware rules) so it stays fast and doesn't
// require per-package `parserOptions.project` wiring across the monorepo.
import js from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/.expo/**",
      "**/.turbo/**",
      "**/.vercel/**",
      "**/coverage/**",
      "**/*.config.js",
      "**/*.config.mjs",
      "**/*.config.cjs",
      "**/*.config.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];
