import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  // Only TypeScript files under the src directory will be subject to checks.
  { files: ["src/**/*.ts"], languageOptions: { sourceType: "module" } },
  {
    ignores: ["dist/*.*"]
  },
  { languageOptions: { globals: globals.node } },
  ...tseslint.configs.recommended
];