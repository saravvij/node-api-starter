module.exports = {
  env: {
    browser: false,
    commonjs: true,
    es6: true,
  },
  extends: [
    'prettier',
    'airbnb-base',
    'plugin:promise/recommended',
    'plugin:security/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "prettier/prettier": ["error"]
  },
  plugins: [
    'prettier',
    'promise',
    'security'
  ]
};