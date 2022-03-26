module.exports = {
  extends: 'standard',
  plugins: ['filenames'],
  rules: {
    'filename/match-regex': ['error', '^([a-z_]+)([-]([a-z_]+))*$', true],
    indent: ['error', 4],
    quotes: ['error', 'single'],
    'no-var': ['error'],
    'max-len': ['error', { code: 120, tabwidth: 2 }],
  },
};
