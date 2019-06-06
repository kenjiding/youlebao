module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'plugin:vue/essential',
    'plugin:vue/strongly-recommended',
    '@vue/airbnb',
  ],

  globals: {
    __static: true,
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'no-unused-expressions': 0,
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,
    'no-plusplus': 0,
    'no-bitwise': 0,
    'linebreak-style': 0,
    'no-restricted-syntax': 0,
    'no-mixed-operators': 0,
    'no-await-in-loop': 0,
    'vue/attributes-order': 'error',
    'vue/order-in-components': ['error', {
      order: [
        'el',
        'name',
        'parent',
        'functional',
        ['delimiters', 'comments'],
        ['components', 'directives', 'filters'],
        'extends',
        'mixins',
        'inheritAttrs',
        'model',
        ['props', 'propsData'],
        'data',
        'computed',
        'watch',
        'LIFECYCLE_HOOKS',
        'methods',
        ['template', 'render'],
        'renderError',
      ],
    }],
  },

  parserOptions: {
    parser: 'babel-eslint',
  },
};
