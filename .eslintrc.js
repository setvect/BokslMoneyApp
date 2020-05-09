module.exports = {
  root: true,
  parserOptions: {
    sourceType: "module",
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:vue/essential"],
  globals: {
    __static: true,
    Swal: true,
    $: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["standard", "vue"],
  rules: {
    indent: ["error", 2],
    "comma-dangle": [
      "error",
      {
        arrays: "never",
        objects: "always",
        imports: "never",
        exports: "never",
        functions: "never",
      },
    ],
    "no-unused-vars": "warn", // off, error
    "space-before-function-paren": ["error", "never"],
    "semi": ["error", "always"],
    "comma-spacing": ["error", { "before": false, "after": true }]
  },
};
