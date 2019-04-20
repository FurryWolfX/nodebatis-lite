// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module"
  },
  env: {
    node: true
  },
  extends: "plugin:prettier/recommended",
  plugins: ["prettier"],
  // add your custom rules here
  rules: {
    "prettier/prettier": "error",
    "no-console": "warn",
    "no-unused-vars": "warn",
    "max-len": ["warn", {"code": 120, "ignoreUrls": true}]
  }
};
