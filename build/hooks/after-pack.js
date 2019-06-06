const { spawnSync } = require('child_process');
const fs = require('fs');

const TOOLS_DIR = 'C:\\Program Files\\DeviceAuth.exe';

exports.default = async (configuration) => {
  const { path } = configuration;

  if (fs.existsSync(TOOLS_DIR) && path.indexOf('win-ia32-unpacked\\MallProCash.exe') >= 0) {
    const { stdout } = spawnSync(`"${TOOLS_DIR}"`, ['SignExe', `"${path}"`], {
      timeout: 10000,
      windowsVerbatimArguments: true,
      windowsHide: true,
      encoding: 'utf8',
      shell: true,
    });
    console.log(stdout);
    if (stdout.indexOf('OK') === -1) {
      throw new Error('收银台签名失败');
    }
  }

  return true;
};
