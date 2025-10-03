import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["node_modules/", "dist/", ".prettierrc.js", ".eslintrc.js", "env.d.ts"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    extends: [
      // By extending from a plugin config, we can get recommended rules without having to add them manually.
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:import/recommended",
      "plugin:jsx-a11y/recommended",
      "plugin:@typescript-eslint/recommended",
      // This disables the formatting rules in ESLint that Prettier is going to be responsible for handling.
      // Make sure it's always the last config, so it gets the chance to override other configs.
      "eslint-config-prettier",
    ],
    plugins: ["react-hooks"],
    settings: {
      react: {
        // Tells eslint-plugin-react to automatically detect the version of React to use.
        version: "detect",
      },
      // Tells eslint how to resolve imports
      "import/resolver": {
        node: {
          paths: ["src"],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "import/named": "off",
      "import/no-unresolved": "off",
      "jsx-a11y/aria-role": [2, { allowedInvalidRoles: ["list-box"] }],
      "jsx-a11y/no-autofocus": "off",
      "jsx-a11y/media-has-caption": "off",
      "jsx-a11y/no-noninteractive-element-interactions": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "no-unused-vars": "off",
      "react-hooks/exhaustive-deps": "warn",
      "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx", ".tsx"] }], //should add ".ts" if typescript project
      "react/no-unescaped-entities": "off",
      // allow jsx syntax in js files (for next.js project)
      "react/prop-types": [0, { extensions: [".jsx"] }],
      // suppress errors for missing 'import React' in files
      "react/react-in-jsx-scope": "off",
    },
  },
]);
