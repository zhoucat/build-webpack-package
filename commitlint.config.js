const types = [
  'develop',
  'prefix'
]

module.exports = { 
  rules: {
    'type-enum': [2, 'always', types]
  },
  extends: ['@commitlint/config-angular'
] }
