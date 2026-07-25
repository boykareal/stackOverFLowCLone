import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Appwrite responses and third-party visual components expose dynamic data.
      // Keep these visible as warnings while allowing production checks to run.
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      // These components intentionally synchronize local UI state with browser APIs
      // and route parameters. React's new lint rule flags those established patterns.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    files: ["src/components/magicui/**/*.{ts,tsx}"],
    rules: {
      // The vendor-style animation helpers mutate refs for canvas/DOM performance.
      "react-hooks/immutability": "off",
    },
  },
]);

export default eslintConfig;
