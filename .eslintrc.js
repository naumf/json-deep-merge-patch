'use strict'

module.exports = {
  env: {
    browser: false,
    node: true,
    es6: true
  },
  plugins: ['sonarjs'],
  extends: ['prettier-standard'],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'script'
  },
  rules: {
    strict: ['error', 'global'],
    'no-unused-vars': [
      'error',
      {
        varsIgnorePattern: '^_',
        vars: 'all',
        args: 'none',
        ignoreRestSiblings: true
      }
    ],
    indent: 'off',
    curly: [2, 'all'],
    'guard-for-in': ['error'],
    'no-shadow': [2, { builtinGlobals: false, hoist: 'functions', allow: [] }],
    'no-return-await': ['error'],
    // default is 10
    complexity: ['error', { max: 15 }],
    // default is 15
    'sonarjs/cognitive-complexity': ['error', 20],
    // 'sonarjs/max-switch-cases': ['error', 30],
    'sonarjs/no-collapsible-if': 'error',
    'sonarjs/no-collection-size-mischeck': 'error',
    // 'sonarjs/no-duplicate-string': ['error', 3]
    'sonarjs/no-duplicated-branches': 'error',
    'sonarjs/no-identical-functions': 'error',
    'sonarjs/no-inverted-boolean-check': 'error',
    'sonarjs/no-redundant-boolean': 'error',
    'sonarjs/no-redundant-jump': 'error',
    // 'sonarjs/no-same-line-conditional': 'error'
    // 'sonarjs/no-small-switch': 'error',
    'sonarjs/no-unused-collection': 'error',
    'sonarjs/no-useless-catch': 'error',
    'sonarjs/prefer-immediate-return': 'error',
    // 'sonarjs/prefer-object-literal': 'error'
    'sonarjs/prefer-single-boolean-return': 'error',
    'sonarjs/prefer-while': 'error',
    'sonarjs/no-extra-arguments': 'error'
  }
}
