const args = require('minimist')(process.argv.slice(2))
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const semver = require('semver')
const currentVersion = require('../../../package.json').version
const { prompt } = require('enquirer')
const execa = require('execa');
const preId = args.preid || (semver.prerelease(currentVersion) && semver.prerelease(currentVersion)[0])
// 获取preid
// 命令行参数的发布版本的后缀,或者是当前版本的后缀1.0.0-alpha.x => alpha

const isDryRun = args.dry
// 命令行参数控制是否空运行,打开方式：node release.js -- --dry

const branch = args.branch || 'dev'
// 推送和拉取分支

const isGitLab = true

const isWin = /^win/.test(process.platform)
// 检测当前环境是否Windows

const versionIncrements = [
  'patch',
  'minor',
  'major',
  ...(preId ? ['prepatch', 'preminor', 'premajor', 'prerelease'] : [])
]
// 版本号类型数组,有preId则把后缀类型加入

const inc = i => semver.inc(currentVersion, i, preId)
// 生成版本号函数
// 例子
// semver.inc('1.0.0', 'patch', 'beta') => 1.0.1
// semver.inc('1.0.0', 'minor', 'beta') => 1.1.0
// semver.inc('1.0.0', 'major', 'beta') => 2.0.0
// pre就是增加后缀
// semver.inc('1.0.0', 'major', 'beta') => 2.0.0-beta.0
// prerelease增加后缀的版本号
// semver.inc('1.0.0-beta.0', 'prerelease', 'beta') => 1.0.0-beta.1

const bin = name => path.resolve(__dirname, '../../.bin/' + name)
// 生成命令执行函数
// 利用node_modules下的bin，相当于bin(webapck) => node_modules/.bin/webpack

const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts })
// 终端执行命令运行函数,对execa进行二次封装

const dryRun = (bin, args, opts = {}) =>
  console.log(chalk.blue(`[dryrun] ${bin} ${args.join(' ')}`), opts)
// 空运行函数,使用chalk进行打印要执行的命令

const runIfNotDry = isDryRun ? dryRun : run
// 执行判断函数，利用外部isDryRun变量判断要进行哪个执行

const step = msg => console.log(chalk.cyan(msg))
// 终端彩色console，默认蓝色哦

const rootPath = path.resolve(__dirname, '../../../')

// 更新版本号
function updateVersions (version) {
  updatePackage(rootPath, version, 'package.json')
  updatePackage(rootPath, version, 'package-lock.json')
  updateVersionConfig(rootPath, version)
}

function updatePackage(pkgRoot, version, fileName) {
  const pkgPath = path.resolve(pkgRoot, fileName)
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  pkg.version = version
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
}

function updateVersionConfig(pkgRoot, version) {
  if (isWin) {
    run('sed', ['-i', `s/${currentVersion}/${version}/g`, path.resolve(pkgRoot, 'src/mixins/config.js')])
  } else {
    run('sed', ['-i', '', `s/${currentVersion}/${version}/g`, path.resolve(pkgRoot, 'src/mixins/config.js')])
  }
}

// main主进程
async function main () {
  // 1.生成版本号

  let targetVersion = args._[0]
  // 取出命令行内的版本号,例如node release 3.1.2 
  // args._一个包含未指定参数内容组成的数组 

  if (!targetVersion) {
  // 未指定版本号

    const { release } = await prompt({
      type: 'select',
      name: 'release',
      message: 'Select release type',
      choices: versionIncrements.map(i => `${i} (${inc(i)})`).concat(['custom'])
    })
    // 命令交互选择版本类型 例子：minor (1.0.1)
    
    if (release === 'custom') {
      // 自定义输入版本号
      targetVersion = (
        await prompt({
          type: 'input',
          name: 'version',
          message: 'Input custom version',
          initial: currentVersion
        })
      ).version
    } else {
      targetVersion = release.match(/\((.*)\)/)[1]
      // 取出release中版本号 例子：minor (1.0.1) => 1.0.1
    }
  }

  // 校验版本号是否符合标准
  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`)
  }
  
  // 确认要 release
  const { yes } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`
  })

  // 不是直接退出
  if (!yes) {
    return
  }

  step('\nUpdating version...')
  // 更新版本
  updateVersions(targetVersion)

  step('\nUpdating changlog...')
  // 生成changlog
  // 执行conventional-changelog -p angular -i CHANGELOG.md -s
  // 依赖包：conventional-changelog-cli
  // 按照angular规范生成changelog文件，即版本下列出fix，feat，revert的更新
  await run(`npm`, ['run', 'changelog'])
  // gitlab修改changlog内参数
  if (isGitLab) {
    if (isWin) {
      await run('sed', ['-i', `s/https/http/g`, path.resolve(rootPath, 'CHANGELOG.md')])
      await run('sed', ['-i', `s/commits/commit/g`, path.resolve(rootPath, 'CHANGELOG.md')])
    } else {
      await run('sed', ['-i', '', `s/https/http/g`, path.resolve(rootPath, 'CHANGELOG.md')])
      await run('sed', ['-i', '', `s/commits/commit/g`, path.resolve(rootPath, 'CHANGELOG.md')])
    }
  }
  // git提交commit

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
  // 命令行执行git diff，检查是否有更改

  if (stdout) {
    // 如果有改动

    step('\nCommitting changes...')
    // 终端输出git commit中

    await runIfNotDry('git', ['add', '-A'])
    // 提交到git暂存区

    await runIfNotDry('git', ['commit', '-m', `release: v${targetVersion}`])
    // git commit release: v1.0.1，生成版本commit信息
  } else {
    console.log('No changes to commit.')
  }

  // 打标签并推送远程仓库

  step('\nPushing to warehouse...')
  // 终端输出推送到仓库

  await runIfNotDry('git', ['pull', '--rebase', 'origin', branch])
  // 获取标签
  await runIfNotDry('git', ['fetch', '--tags'])
  await runIfNotDry('git', ['tag', `v${targetVersion}`])
  // git tag v1.0.0 => git打标签

  await runIfNotDry('git', ['push', 'origin', `refs/tags/v${targetVersion}`])
  // git push origin refs/tags/v1.0.0 => git推送标签到远程仓库

  await runIfNotDry('git', ['push'])
  // git push => git提交

  // 结束log

  // 如果是空运行，则打印空运行结束，可以使用git diff查看包的变化
  if (isDryRun) {
    console.log(`\nDry run finished - run git diff to see package changes.`)
  }
}

// 执行main
main().catch((err) => console.error(err))