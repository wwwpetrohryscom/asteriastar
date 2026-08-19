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
    // Netlify build output: the adapter writes a copy of the server bundle,
    // its traced node_modules, and the static publish tree here. Linting it
    // reports thousands of problems in generated and third-party code, exactly
    // as linting .next would.
    ".netlify/**",
  ]),
]);

export default eslintConfig;
