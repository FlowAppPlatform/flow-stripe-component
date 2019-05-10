module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
        "process": false,
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
      "quotes": 0,
      "semi": 2,
      "no-var": 2,
      "no-unused-vars": [1, { "vars": "all", "args": "none" }],
      "no-underscore-dangle": 0,
      "no-empty": 0,
      "space-return-throw-case": 0,
      "strict": 0,
    }
};