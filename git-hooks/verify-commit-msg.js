/* eslint-disable */
const chalk = require('chalk');

const msgPath = process.env.GIT_PARAMS;
const msg = require('fs').readFileSync(msgPath, 'utf-8').trim();

const commitRE = /^(revert: )?(feat|fix|polish|docs|style|refactor|perf|test|workflow|ci|chore|types|build)(\(.+\))?: .{1,50}/;

if (msg.indexOf('Merge branch') > -1) {
  return;
} else if (!commitRE.test(msg)) {
  console.log(msg);
  console.error(`  ${chalk.bgRed.white(' 错误 ')} ${chalk.red('提交信息格式不规范')}\n\n${
    chalk.red('  建议使用符合规范的提交信息。 例如:\n\n')
  }    ${chalk.green('feat(compiler): add \'comments\' option')}\n` +
    `    ${chalk.green('fix(v-model): handle events on blur (close #28)')}\n\n${
      chalk.red(`  您可以使用命令 ${chalk.cyan('yarn commit/commit:custom')} 生成提交信息。\n`)}` );
  process.exit(1);
}
