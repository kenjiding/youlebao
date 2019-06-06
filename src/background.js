/* eslint import/no-extraneous-dependencies: 0 */
import * as path from 'path';
import electron from 'electron';
import { format as formatUrl } from 'url';
import {
  createProtocol,
  installVueDevtools,
} from 'vue-cli-plugin-electron-builder/lib';

import ElectronStore from 'electron-store';

import log from 'electron-log';
import dayjs from 'dayjs';

import electronDefaultData from './config/datas/electron-default-data';

import ipcMainEvent from './main-process/event';
import { SERVER_TEST_PATH } from './config';
// import checkVersion from './main-process/check-version';

const {
  app,
  net,
  protocol,
  BrowserWindow,
  ipcMain,
  globalShortcut,
  shell,
} = electron;

// 将DLL目录 放到 环境变量，
const pathToAdd = path.join(__static, 'dll', 'basic');
process.env.PATH = `${process.env.PATH}${path.delimiter}${pathToAdd}`;

const isDevelopment = process.env.NODE_ENV !== 'production';
if (isDevelopment) {
  // eslint-disable-next-line
  require('module').globalPaths.push(process.env.NODE_MODULES_PATH);
}
// 日志配置
log.transports.console.level = false;
// log.transports.file.level = isDevelopment ? false : 'warn,error';
log.transports.file.level = 'error';
log.transports.file.format = '{h}:{i}:{s}:{ms} {level} {text}';
log.transports.file.maxSize = 5 * 1024 * 1024;
log.transports.file.file = path.join(app.getPath('logs'), `${dayjs().format('YYYY-MM-DD')}.log`);

// 窗口映射对象
global.$winodws = {
  main: null,
  login: null,
  check: null,
  service: null,
};

const winodws = global.$winodws;

// 防止多次开启应用
const shouldQuit = app.makeSingleInstance(() => {
  if (winodws.main) {
    if (winodws.main.isMinimized()) winodws.main.restore();
    winodws.main.focus();
  }
});

if (shouldQuit) {
  app.quit();
}

let electronStore;

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true });

// 创建登录窗口
function createLoginWindow() {
  const loginWinInstance = new BrowserWindow({
    title: process.env.VUE_APP_PRODUCT_NAME,
    width: 1000,
    height: 600,
    resizable: false,
    center: true,
    frame: false,
    show: false,
    backgroundColor: '#fff',
    webPreferences: { webSecurity: false },
  });

  if (isDevelopment) {
    // 开发环境下加载本地服务的html
    loginWinInstance.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}/login.html`);
    if (!process.env.IS_TEST) loginWinInstance.webContents.openDevTools();
  } else {
    createProtocol('app');
    //  当不是开发环境的情况下，加载生成后的html文件
    loginWinInstance.loadURL(formatUrl({
      pathname: path.join(__dirname, 'login.html'),
      protocol: 'file',
      slashes: true,
    }));
  }

  // 优化首次窗口加载效果
  loginWinInstance.on('ready-to-show', () => {
    loginWinInstance.show();
  });

  loginWinInstance.on('closed', () => {
    loginWinInstance.login = null;
  });

  loginWinInstance.webContents.on('devtools-opened', () => {
    loginWinInstance.focus();
    setImmediate(() => {
      loginWinInstance.focus();
    });
  });

  return loginWinInstance;
}

// 创建主窗口
function createMainWindow() {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
  const mianWin = new BrowserWindow({
    title: process.env.VUE_APP_PRODUCT_NAME,
    width,
    height,
    frame: false,
    show: false,
    backgroundColor: '#4b5b79',
    minWidth: 1024,
    minHeight: 768,
    webPreferences: { webSecurity: false },
  });

  global.webContents = mianWin.webContents;
  global.mainWin = mianWin;

  if (isDevelopment) {
    // Load the url of the dev server if in development mode
    mianWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) mianWin.webContents.openDevTools();
  } else {
    createProtocol('app');
    //   Load the index.html when not in development
    mianWin.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true,
    }));
  }

  // 优化首次窗口加载效果
  mianWin.on('ready-to-show', () => {
    mianWin.show();
  });

  mianWin.on('closed', () => {
    winodws.main = null;
  });

  mianWin.webContents.on('devtools-opened', () => {
    mianWin.focus();
    setImmediate(() => {
      mianWin.focus();
    });
  });

  // 暂时是为了拦截客服新增窗口
  mianWin.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    const serviceWin = new BrowserWindow({
      show: false,
      frame: false,
    });
    if (isDevelopment) {
      serviceWin.webContents.openDevTools();
    }

    // 阻止客服窗口新增窗口的默认动作，通过sell用浏览器打开
    serviceWin.webContents.on('new-window', (serviceEvent, serviceUrl) => {
      serviceEvent.preventDefault();
      shell.openExternal(serviceUrl);
    });

    /**
    * 因为嘉信的IM SDK 用onbeforeunload事件阻止了窗口的关闭，
    * 并且聊天窗口首次加载时，会先刷新两次
    * 所以需要用到dom-ready（DOM渲染完成）事件来重置onbeforeunload事件
    * */
    serviceWin.webContents.on('dom-ready', () => {
      serviceWin
        .webContents
        .executeJavaScript(`
          window.onbeforeunload = () => {};
          const divDom = document.createElement('div');
          divDom.style = "top: 0px;left: 0px;position: fixed;width: 80%;height: 50px;-webkit-app-region: drag;";
          document.body.appendChild(divDom);
        `);
    });

    serviceWin.once('ready-to-show', () => {
      serviceWin.show();
    });

    serviceWin.loadURL(url);

    // 处理链接客服失败时
    serviceWin.webContents.on('did-fail-load', () => {
      serviceWin
        .webContents
        .executeJavaScript(`
          const wrapDiv = document.createElement('div');
          const closeBtn = document.createElement('button');
          const refreshBtn = document.createElement('button');
          const tipsP = document.createElement('p');

          wrapDiv.style = "top: 0px;left: 0px;right: 0px;bottom: 0px;position: fixed;background: rgba(0,0,0,0.5);display: flex;align-items:center;justify-content:center;";

          tipsP.innerHTML = '链接客服失败，您可以尝试重新连接';
          tipsP.style = "color:#fff;font-size: 14px;top: 35%;position:absolute;text-align:center;-webkit-app-region: drag;";

          closeBtn.innerHTML="关  闭";
          closeBtn.style = "margin-right:20px;outline:none;cursor:pointer;color:#fff;background: #409eff;width: 80px;height: 40px;border: 1px solid #409eff;border-radius: 4px;";

          refreshBtn.innerHTML="重新连接";
          refreshBtn.style = "outline:none;cursor:pointer;color:#fff;background: #409eff;width: 80px;height: 40px;border: 1px solid #409eff;border-radius: 4px;";
         
          closeBtn.onmouseover = function() {
            closeBtn.style.background = "#66b1ff";
            closeBtn.style.borderColor = "#66b1ff";
          };
          closeBtn.onmouseleave = function() {
            closeBtn.style.background = "#409eff";
            closeBtn.style.borderColor = "#409eff";
          };

          refreshBtn.onmouseover = function() {
            refreshBtn.style.background = "#66b1ff";
            refreshBtn.style.borderColor = "#66b1ff";
          };
          refreshBtn.onmouseleave = function() {
            refreshBtn.style.background = "#409eff";
            refreshBtn.style.borderColor = "#409eff";
          };

          closeBtn.addEventListener('click', () => {
            window.close();
          });
          refreshBtn.addEventListener('click', () => {
            window.location.reload();
          });
          
          wrapDiv.appendChild(tipsP);
          wrapDiv.appendChild(closeBtn);
          wrapDiv.appendChild(refreshBtn);
          document.body.appendChild(wrapDiv);
        `);
    });
    event.newGuest = serviceWin;
    winodws.service = serviceWin;
  });

  return mianWin;
}

function createCheckServiceWindow() {
  const upgradeWin = new BrowserWindow({
    title: process.env.VUE_APP_PRODUCT_NAME,
    width: 320,
    height: 160,
    frame: false,
    resizable: false,
    useContentSize: true,
    show: false,
    // parent: mainWindow,
    backgroundColor: '#FFF',
    webPreferences: { webSecurity: false },
  });

  if (isDevelopment) {
    // Load the url of the dev server if in development mode
    upgradeWin.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}/check-service.html`);
    if (!process.env.IS_TEST) upgradeWin.webContents.openDevTools();
  } else {
    createProtocol('app');
    //   Load the index.html when not in development
    upgradeWin.loadURL(formatUrl({
      pathname: path.join(__dirname, 'check-service.html'),
      protocol: 'file',
      slashes: true,
    }));
  }

  upgradeWin.on('ready-to-show', () => {
    upgradeWin.show();
  });

  return upgradeWin;
}

/**
 * 准备窗口
 */
function appReady() {
  winodws.login = createLoginWindow();
}

function serviceTest(url) {
  // eslint-disable-next-line
  const [protocol, host] = url.split('//');
  const request = net.request({
    host,
    protocol,
    method: 'POST',
    path: SERVER_TEST_PATH,
  });
  request.on('response', ({ statusCode }) => {
    if (statusCode >= 400) {
      // 创建输入服务器地址窗口
      winodws.check = createCheckServiceWindow();
    } else {
      appReady();
    }
  });

  request.on('error', () => {
    // 创建输入服务器地址窗口
    winodws.check = createCheckServiceWindow();
  });

  request.end();
}

ipcMain.on('login-after', () => {
  winodws.main = createMainWindow();
  winodws.login.close();
});

ipcMain.on('login-close', () => {
  winodws.login.close();
});

ipcMain.on('logout', () => {
  winodws.login = createLoginWindow();
  winodws.main.close();
});

ipcMain.on('service-test-success', (event, host) => {
  if (host) {
    electronStore.set('host', host);
  }
  appReady();
  winodws.check.close();
});

// 退出应用程序时,所有窗户都关闭
app.on('window-all-closed', () => {
  // 在macOS是很常见的应用程序保持开放,直到用户显式地退出
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 暂时不支持macOS
// app.on('activate', () => {
//   // 在macOS通常重新创建一个窗口即使所有窗口已经关闭
//   if (winodws.main === null) {
//     // winodws.main = createMainWindow();
//   }
// });

// 当electron准备的时候，创建主要BrowserWindow
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // 安装Vue Devtools
    await installVueDevtools();
  }

  // 调试工具
  globalShortcut.register('CommandOrControl+F12', () => {
    // 获取当前聚焦的窗口实例
    const focusWin = BrowserWindow.getFocusedWindow();
    if (focusWin) {
      focusWin.webContents.openDevTools();
    } else {
      winodws.main && winodws.main.webContents.openDevTools();
    }
  });

  // 刷新
  globalShortcut.register('CommandOrControl+F5', () => {
    const focusWin = BrowserWindow.getFocusedWindow();
    if (focusWin) {
      focusWin.webContents.reload();
    } else {
      winodws.main && winodws.main.webContents.reload();
    }
  });

  // 初始化配置文件
  electronStore = new ElectronStore({
    defaults: electronDefaultData,
    cwd: app.getPath('userData'),
  });

  global.electronStore = electronStore;
  global.electronLog = log;
  const host = electronStore.get('host');

  if (isDevelopment) {
    appReady();
    return;
  }

  if (!host || !/\w+:\/\/[^/:]+:\d*?/.test(host)) {
    // 创建输入服务器地址窗口
    winodws.check = createCheckServiceWindow();
  } else {
    serviceTest(host);
  }
});

// 退出前清空所有快捷按钮的绑定
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// 初始化事件监听
Object.keys(ipcMainEvent).forEach((key) => {
  ipcMain.on(
    key,
    (event, ...args) => {
      ipcMainEvent[key](
        event,
        winodws,
        ...args,
      );
    },
  );
});
