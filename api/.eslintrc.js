/*
 * SPDX-License-Identifier: Apache-2.0
 */

module.exports = {
    env: {
        node: true,
        mocha: true
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        }
    },
    extends: "eslint:recommended",
    rules: {
        indent: ['error', 4],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'no-unused-vars': ['error', { args: 'none' }],
        'no-console': 'off',
        curly: 'error',
        eqeqeq: 'error',
        'no-throw-literal': 'error',
        strict: 'error',
        'no-var': 'error',
        'dot-notation': 'error',
        'no-tabs': 'error',
        'no-trailing-spaces': 'error',
        'no-use-before-define': 'error',
        'no-useless-call': 'error',
        'no-with': 'error',
        'operator-linebreak': [2, "after"],
        yoda: 'error',
        'quote-props': ['error', 'as-needed']
    }
};
