import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = [
  ...coreWebVitals,
  ...nextTypeScript,
  { ignores: [".next/**", "coverage/**", "playwright-report/**", "test-results/**"] },
];

export default eslintConfig;
