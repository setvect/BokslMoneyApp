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
  extends: ["eslint:recommended"],
  globals: {
    __static: true,
    Swal: true,
    $: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["html", "vue"],
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
  },
};
