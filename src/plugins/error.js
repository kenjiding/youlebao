/* eslint import/no-extraneous-dependencies: 0 */
import electronLog from 'electron-log';
// import sourceMap from 'source-map';
// import fs from 'fs';
// import path from 'path';

import store from '@/service/store';
import { NODE_ENV } from '@/config';

const commonErrorMsg = () => {
  const { RealName, Termina, PeriodName } = store.state.user.info;
  const termina = Termina || {};
  return [
    '\n >>>>>> 操作人 >>>>>> \n',
    RealName,
    '\n >>>>>> 账期 >>>>>> \n',
    PeriodName,
    '\n >>>>>> 终端 >>>>>> \n',
    `${termina.TerminalName}(${termina.TerminalId})\n`,
    '>>>>>> end >>>>>>',
    '\n\n\n',
  ];
};

export const errorHandler = (data, type = 'normal') => {
  const errorTypeMap = {
    normal: '普通异常',
    vue: 'Vue实例异常',
    api: 'api异常',
  };
  const errorArrPre = [
    '\n >>>>>> 类型 >>>>>> \n',
    errorTypeMap[type] || '其它异常',
  ];

  electronLog.error(...errorArrPre, ...data, ...commonErrorMsg());
};

export const apiErrorHandler = (msg, responseError) => {
  if (NODE_ENV === 'development') return;
  console.log(responseError);
  const { message, response } = responseError;
  const errorArr = [
    '\n >>>>>> 错误信息 >>>>>> \n',
    `${msg}(${message})`,
    '\n >>>>>> HTTP状态码 >>>>>> \n',
    response && response.status,
  ];

  errorHandler(errorArr, 'api');
};

export default {
  install(Vue) {
    if (NODE_ENV === 'development') return;
    Vue.config.errorHandler = (err, vm, info) => {
      // const {
      //   message, // 异常信息
      //   name, // 异常名称
      //   stack, // 异常堆栈信息
      // } = err;
      // let script; // 异常脚本url

      // const str = stack.valueOf().split('\n')[1].trim();
      // const filePath = path.join(__dirname, `${str.match(/js.*js/ig)[0]}.map`);
      // const codeNum = `${str.match(/\.js.*[^)]/)}`.split(':');

      // const line = codeNum[1];
      // const column = codeNum[2];
      // console.log(message);
      // console.log(name);
      // console.log(script);
      // console.log(line);
      // console.log(column);
      // console.log(stack);
      // console.log(stack.valueOf().split('\n')[1].trim());
      // console.log(filePath);
      // if (fs.existsSync(filePath)) {
      //   fs.readFile(filePath, 'utf8', async (err, data) => {
      //     const rawSourceMap = Object.assign(
      //       {},
      //       JSON.parse(data),
      //       { sourceRoot: __dirname },
      //     );
      //     console.log(rawSourceMap);
      //     if (err) throw err;
      //     await sourceMap.SourceMapConsumer.with(rawSourceMap, null, (consumer) => {
      //       console.log(consumer.sources);

      //       console.log(consumer.originalPositionFor({
      //         line,
      //         column,
      //       }));
      //     });
      //   });
      // }
      Vue.nextTick(() => {
        const errorArr = [
          '\n >>>>>> 错误信息 >>>>>> \n',
          info,
          '\n >>>>>> Error >>>>>> \n',
          err,
        ];

        errorHandler(errorArr, 'vue');
      });
    };

    window.addEventListener('error', ({
      colno,
      lineno,
      filename,
      message,
      error,
    }) => {
      const errorArr = [
        '\n >>>>>> 错误信息 >>>>>> \n',
        message,
        '\n >>>>>> Error >>>>>> \n',
        error,
        '\n >>>>>> 错误文件 >>>>>> \n',
        filename,
        '\n >>>>>> 行号 >>>>>> \n',
        lineno,
        '\n >>>>>> 列号 >>>>>> \n',
        colno,
      ];

      errorHandler(errorArr);
    }, true);
  },
};
