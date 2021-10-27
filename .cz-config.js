module.exports = {
  // type 类型（定义之后，可通过上下键选择）
  types: [
    { value: 'develop', name: 'feat:     开发（未上线的功能都选这个）' },
    { value: 'feat', name: 'feat:     新增功能' },
    { value: 'fix', name: 'fix:      功能变更 或者 修复bug' },
    { value: 'refactor', name: 'refactor: 代码重构（不包括 bug 修复、功能新增）' },
    { value: 'perf', name: 'perf:     优化/性能提升' },
    { value: 'build', name: 'build:    构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）' },
    { value: 'revert', name: 'revert:   回滚 commit/撤销修改' },
    { value: 'debug', name: 'debug:      排查问题' },
    { value: 'prefix', name: 'prefix:      预修复问题，不知道是否能解决' },
    { value: 'docs', name: 'docs:     文档/注释变更' },
    { value: 'style', name: 'style:    代码格式（不影响功能，例如空格、分号等格式修正）' },
    { value: 'test', name: 'test:     添加、修改测试用例' },
    { value: 'mod', name: 'mod:     不确定分类的修改' },
    
  ],

  // scope 类型（定义之后，可通过上下键选择）
  scopes: [
    ['custom', '推荐人'],
    ['在家办公', ''],
  ].map(([value, description]) => {
    return {
      value,
      name: `${value.padEnd(30)} (${description})`
    }
  }),

  // 是否允许自定义填写 scope，在 scope 选择的时候，会有 empty 和 custom 可以选择。
  // allowCustomScopes: true,

  // allowTicketNumber: false,
  // isTicketNumberRequired: false,
  // ticketNumberPrefix: 'TICKET-',
  // ticketNumberRegExp: '\\d{1,5}',


  // 针对每一个 type 去定义对应的 scopes，例如 fix
  /*
  scopeOverrides: {
    fix: [
      { name: 'merge' },
      { name: 'style' },
      { name: 'e2eTest' },
      { name: 'unitTest' }
    ]
  },
  */

  // 交互提示信息
  messages: {
    type: '确保本次提交遵循 Angular 规范！\n选择你要提交的类型：',
    scope: '\ncustom：',
    // 选择 scope: custom 时会出下面的提示
    customScope: '请输入自定义的 review人或者不review的理由：',
    subject: '填写简短精炼的变更描述：\n',
    body:
      '填写更加详细的变更描述（可选）。使用 "|" 换行：\n',
    breaking: '列举非兼容性重大的变更（可选）：\n',
    footer: '列举出所有变更的 ISSUES CLOSED（可选）。 例如: #31, #34：\n',
    confirmCommit: '确认提交？'
  },

  // 设置只有 type 选择了 feat 或 fix，才询问 breaking message
  allowBreakingChanges: ['feat', 'fix'],

  // 跳过要询问的步骤
  // skipQuestions: ['body', 'footer'],

  // subject 限制长度
  subjectLimit: 100,
  breaklineChar: '|', // 支持 body 和 footer
  // footerPrefix : 'ISSUES CLOSED:'
  // askForBreakingChangeFirst : true,
}
