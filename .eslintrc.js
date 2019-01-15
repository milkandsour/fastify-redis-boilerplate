module.exports = {
    extends: 'airbnb-base',
    rules: {
      'no-restricted-syntax': 'off',
      'class-methods-use-this': 'off',
      'func-names': ['error', 'always', { generators: 'never' }],
    }
};
