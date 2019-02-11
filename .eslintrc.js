module.exports = {
  root: true,
  parserOptions: {
    "parser": "babel-eslint",
    "sourceType": "module"
  },
  env: {
    browser: true,
    node: true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'plugin:vue/recommended',
  // required to lint *.vue files
  /*plugins: [
    'html'
  ],*/
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': ['error', 'as-needed'],
    // 'one-var': ['error', 'always'],
    'dot-location': ['error', 'property'],
    'eqeqeq': ['error', 'always'],
    'no-multi-spaces': [2, { exceptions: { 'VariableDeclarator': true, 'ImportDeclaration': true } }],
    'one-var': 0,
    'indent': ['error', 2, { 'VariableDeclarator': { 'var': 2, 'let': 2, 'const': 3 } }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'brace-style': [2, 'stroustrup', { 'allowSingleLine': true }],
    'prefer-arrow-callback': ['error']
  }
}
