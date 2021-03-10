'use strict'

module.exports = {
  env: {
    browser: false,
    node: true,
    es6: true
  },
  extends: ['prettier-standard'],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'script'
  },
  rules: {
    strict: ['error', 'global'],
    indent: 'off'
  }
}
