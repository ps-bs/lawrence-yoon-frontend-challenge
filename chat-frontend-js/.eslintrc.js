module.exports = {
  'env': {
    'browser': true,
    'es2021': true
  },
  'extends': ['react-app', 'react-app/jest', 'eslint:recommended', 'plugin:react/recommended', 'plugin:jest/recommended', 'prettier'],
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    },
    'ecmaVersion': 12,
    'sourceType': 'module'
  },
  'plugins': ['react'],
  'rules': {
    'import/order': ['error', {
      alphabetize: {
        caseInsensitive: false,
        order: 'asc'
      },
      groups: ['object', 'builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'always'
    }],
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'semi': ['error', 'always']
  }
};
