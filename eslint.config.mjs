import js from "@eslint/js"
import tseslint from "typescript-eslint"

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    files: ["jest.config.js", "jest.setup.js", "commitlint.config.js"],
    languageOptions: {
      globals: {
        module: "writable",
        require: "readonly",
      },
    },
  },
  {
    ignores: ["node_modules/", ".next/", "dist/"],
  },
)
