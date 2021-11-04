const types = [
  'develop',
  'prefix',
  'feat',
  'fix',
  'refactor',
  'build',
  'perf',
  'revert',
  'debug',
  'docs',
  'style',
  'test',
  'mod'
]

module.exports = { 
  rules: {
    'type-enum': [2, 'always', types]
  },
  extends: ['@commitlint/config-angular'
] }
