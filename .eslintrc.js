module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
  },
  extends: 'standard',
  globals: {
    __static: true,
    Swal: true,
  },
  plugins: ['html'],
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    'comma-dangle': [
      'off',
      {
        arrays: 'off',
        objects: 'off',
        imports: 'off',
        exports: 'off',
        functions: 'off',
      },
    ],
    'space-before-function-paren': ['off'],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
  },
}
