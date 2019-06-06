const appName = process.env.VUE_APP_PRODUCT_NAME;

module.exports = {
  lintOnSave: true,
  devServer: {
    proxy: 'http://192.168.2.106:9988',
    // proxy: 'http://192.168.1.156:9988',
    // proxy: 'http://localhost:9999',
  },
  crossorigin: 'use-credentials',
  productionSourceMap: false,
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
    },
    update: 'src/subpage/update/main.js',
    login: 'src/subpage/login/main.js',
    'check-service': 'src/subpage/check-service/main.js',
  },
  chainWebpack: (config) => {
    config.module
      .rule('fonts')
      .test(/\.(woff2?|eot|ttf|otf|ttc)(\?.*)?$/i);
  },
  pluginOptions: {
    lintStyleOnBuild: true,
    stylelint: {
      // fix: true,
    },
    electronBuilder: {
      externals: ['ffi', 'ref', 'ref-array', 'bindings', 'serialport'],
      builderOptions: {
        appId: 'net.youcaihua.cashier',
        productName: 'MallProCash',
        // createDesktopShortcut: 'always',
        // artifactName: 'ych-cashier',
        asar: false,
        win: {
          // icon: '.public/icon.ico', // 图标路径
          target: [
            {
              target: 'nsis', // 我们要的目标安装包
            },
          ],
          sign: './build/hooks/after-pack.js',
        },
        mac: { // mac
          icon: '.public/icon.icns',
        },
        publish: [
          {
            provider: 'generic',
            url: 'http://127.0.0.1:5500/', // 这里是我本地开的服务器的地址
          },
        ],
        nsis: {
          guid: 'MallProCash',
          oneClick: false, // 是否一键安装
          perMachine: true,
          allowElevation: false, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          allowToChangeInstallationDirectory: true, // 允许修改安装目录
          // eslint-disable-next-line
          artifactName: 'MallProCashSetup.${ext}',
          shortcutName: appName,
          // installerIcon: '.public/icon.ico', // 安装图标
          // uninstallerIcon: '.public/icon.ico', // 卸载图标
          // installerHeaderIcon: '.public/icon.ico', // 安装时头部图标
          createDesktopShortcut: true, // 创建桌面图标
          createStartMenuShortcut: true, // 创建开始菜单图标
          include: 'build/script/installer.nsh', // 包含的自定义nsis脚本 这个对于构建需求严格得安装过程相当有用。
          // script: 'build/script/installer.nsh', // NSIS脚本的路径，用于自定义安装程序。 默认为build / installer.nsi
        },
        // afterPack: './build/hooks/after-pack.js',
      },
      chainWebpackMainProcess: config => config,
      chainWebpackRendererProcess: (config) => {
        // Chain webpack config for electron renderer process only
        // The following example will set IS_ELECTRON to true in your app
        config.plugin('define').tap((args) => {
          args[0].IS_ELECTRON = true;
          return args;
        });
        // If you do not return the config property, your app may break!
        return config;
      },
      // Use this to change the entrypoint of your app's main process
      mainProcessFile: 'src/background.js',
    },
  },
};
