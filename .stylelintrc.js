module.exports = {
  rules: {
    'color-named': 'never',
    'color-no-hex': true,
    'color-hex-case': 'upper',
    'no-empty-source': null,
    'property-no-vendor-prefix': [true, {
      ignoreProperties: [
        'background-clip', 'box-orient', 'line-clamp',
      ],
    }],
    'number-leading-zero': 'never',
    'number-no-trailing-zeros': true,
    'length-zero-no-unit': true,
    'value-list-comma-space-after': 'always',
    'declaration-colon-space-after': 'always',
    'value-list-max-empty-lines': 0,
    'shorthand-property-no-redundant-values': true,
    'declaration-block-no-duplicate-properties': true,
    'declaration-block-no-redundant-longhand-properties': true,
    'declaration-block-semicolon-newline-after': 'always',
    'block-closing-brace-newline-after': 'always',
    'media-feature-colon-space-after': 'always',
    'media-feature-range-operator-space-after': 'always',
    'at-rule-name-space-after': 'always',
    indentation: 2,
    'no-eol-whitespace': true,
    'string-no-newline': null,
    'at-rule-no-unknown': [true, {
      ignoreAtRules: [
        'mixin', 'extend', 'content', 'if', 'include',
      ],
    }],
    'declaration-property-unit-blacklist': {
      'border-radius': ['px', 'rem', 'pt', 'vw', 'vh', 'em', '%'],
      'font-size': ['px', 'rem', 'pt', 'vw', 'vh', 'em', '%'],
    },
    'no-duplicate-at-import-rules': null,
  },
};
