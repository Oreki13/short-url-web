import { defineConfig } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  // Base ESLint recommended configuration
  //   js.configs.recommended,

  // Next.js configurations using FlatCompat
  ...compat.config({
    extends: ["next/core-web-vitals"],
  }),

  // Global ignore patterns
  {
    ignores: [
      "**/node_modules/**",
      "**/build/**",
      "**/.next/**",
      "**/dist/**",
      "**/coverage/**",
      "**/.env*",
      "**/public/**",
      "**/*.config.js",
      "**/*.config.mjs",
      "**/next-env.d.ts",
    ],
  },
  // Linter options
  {
    linterOptions: {
      reportUnusedDisableDirectives: "warn",
    },
  },
]);
