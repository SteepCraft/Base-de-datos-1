import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import * as pluginReactHooks from "eslint-plugin-react-hooks";
import prettierConfig from "eslint-config-prettier/flat";

let jsxA11yFlat = null;
let jsxA11yPlugin = null;

try {
  const modFlat = await import("eslint-plugin-jsx-a11y/flat-config.js");
  jsxA11yFlat = modFlat.default ?? modFlat;
} catch {
  try {
    const modPlugin = await import("eslint-plugin-jsx-a11y");
    jsxA11yPlugin = modPlugin.default ?? modPlugin;
  } catch {
    jsxA11yFlat = null;
    jsxA11yPlugin = null;
  }
}

const config = [];

// base
config.push(js.configs.recommended);

// jsx-a11y prefer flat if available
if (jsxA11yFlat) {
  config.push(jsxA11yFlat);
} else if (jsxA11yPlugin) {
  config.push({
    plugins: { "jsx-a11y": jsxA11yPlugin },
    rules: {
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/aria-role": "warn",
      "jsx-a11y/no-static-element-interactions": "warn",
    },
  });
}

// try to use pluginReact.flatConfigs.recommended if available (this brings the helper rules)
// fallback: register plugin and add the helper rules manually
if (pluginReact.flatConfigs?.recommended) {
  config.push(pluginReact.flatConfigs.recommended);
} else {
  // register react plugin and ensure JSX helper rules are present
  config.push({
    plugins: { react: pluginReact, "react-hooks": pluginReactHooks },
    settings: { react: { version: "detect" } },
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser },
    },
    rules: {
      // react hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // JSX usage helpers: marcan variables usadas en JSX para que no sean "no-unused-vars"
      // react/jsx-uses-vars marca como usadas las variables que aparecen en JSX
      "react/jsx-uses-vars": "error",

      // para el nuevo JSX transform no necesitas react en scope, así que lo apagamos
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",

      // otras reglas React
      "react/prop-types": "off",

      // reglas generales
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "prefer-const": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  });
}

// tests
config.push({
  files: ["src/**/*.test.{js,jsx,ts,tsx}", "src/**/*.spec.{js,jsx,ts,tsx}"],
  languageOptions: { globals: { ...globals.jest } },
});

// prettier flat (al final)
config.push(prettierConfig);

// ignores
config.push({
  ignores: [
    "dist/",
    "build/",
    "node_modules/",
    "public/",
    "coverage/",
    "*.config.js",
    "*.config.mjs",
    ".eslintrc.cjs",
  ],
});

export default config;
