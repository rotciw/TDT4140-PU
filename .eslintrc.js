module.exports = {
  root: true,

  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },

  env: {
    browser: true,
    node: true
  },

  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: [
    'plugin:vue/recommended',
    'eslint:recommended',
    '@vue/standard'
  ],

  // required to lint *.vue files
  plugins: [
    'vue'
  ],

  // add your custom rules here
  /*'rules': [
    'plugin:vue/recommended',
    'eslint:recommended',
    'plugin:vue/essential',
    '@vue/standard',

  ],*/

  rules: {
    'arrow-parens': [
      'error',
      'as-needed'
    ],
    'dot-location': [
      'error',
      'property'
    ],
    eqeqeq: [
      'error',
      'always'
    ],
    'no-multi-spaces': [
      2,
      {
        exceptions: {
          VariableDeclarator: true,
          ImportDeclaration: true
        }
      }
    ],
    'one-var': 0,
    indent: [
      'error',
      2,
      {
        VariableDeclarator: {
          'var': 2,
          'let': 2,
          'const': 3
        }
      }
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'brace-style': [
      2,
      'stroustrup',
      {
        allowSingleLine: true
      }
    ],
    'prefer-arrow-callback': [
      'error'
    ]
  }
}
