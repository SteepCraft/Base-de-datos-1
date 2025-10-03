// eslint.config.mjs
import js from "@eslint/js";
import globals from "globals";
import nodePlugin from "eslint-plugin-n";
import prettierConfig from "eslint-config-prettier/flat";
import importPlugin from "eslint-plugin-import";

const config = [];

config.push(js.configs.recommended);

// Plugin node (usando eslint-plugin-n)
config.push({
  plugins: { n: nodePlugin },
  rules: {
    "n/no-missing-import": "off",
  },
});

// Plugin import (import/export check)
config.push({
  plugins: { import: importPlugin },
  rules: {
    "import/no-unresolved": "error", // import a archivo inexistente
    "import/extensions": [
      "error",
      "ignorePackages",
      { js: "always", mjs: "always" },
    ],
    "import/export": "error", // export duplicados o inválidos
    "import/no-named-as-default": "warn",
    "import/no-named-as-default-member": "warn",
    "import/no-anonymous-default-export": "warn",
  },
});

config.push({
  files: ["**/*.js", "**/*.mjs"],
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    globals: { ...globals.node },
  },
  rules: {
    "no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "prefer-const": "warn",
    "no-console": "off",
    "no-process-exit": "off",
    "handle-callback-err": "warn",
  },
});

// Prettier
config.push(prettierConfig);

// Ignorar carpetas
config.push({
  ignores: [
    "node_modules/",
    "dist/",
    "build/",
    "coverage/",
    "/*.config.js",
    "/*.config.mjs",
    ".eslintrc.cjs",
    "src/errors/theme.js",
  ],
});

export default config;
