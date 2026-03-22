import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { globalIgnores } from "eslint/config";

const config = [
  globalIgnores([".next/**", ".worktrees/**", "node_modules/**"]),
  ...coreWebVitals,
  ...nextTypescript,
];

export default config;
