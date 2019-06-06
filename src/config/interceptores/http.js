/* eslint-disable no-case-declarations */
// eslint-disable-next-line
import { ipcRenderer } from 'electron';
import Vue from 'vue';
import { Message as ElMessage, MessageBox as ElMessageBox } from 'element-ui';
import log from '@/utils/log';
import { apiErrorHandler } from '@/plugins/error';
import { CONSOLE_REQUEST_ENABLE, CONSOLE_RESPONSE_ENABLE } from '../index';

const vm = new Vue();

const systemErrorHandler = (msg) => {
  ElMessage({
    type: 'error',
    message: msg,
  });
};

const httpErrorHandler = (msg, responseError) => {
  apiErrorHandler(msg, responseError);
  ElMessage({
    type: 'error',
    message: msg,
  });
};

const loginTimeout = () => {
  ElMessageBox.alert('登录超时，请重新登录！', '提示', {
    type: 'error',
    showClose: false,
  }).then(() => ipcRenderer.send('logout'));
};

// 账期已做实
const period = () => {
  ElMessageBox.alert('账期已做实，请退出系统并重新登录！', '提示', {
    type: 'error',
    showClose: false,
  }).then(() => ipcRenderer.send('logout'));
};

// 请求成功
export function requestSuccessFunc(requestObj) {
  if (CONSOLE_REQUEST_ENABLE) {
    log.capsule('YCH-FE', '发送请求前');
    log.primary('>>>>>> 请求URL >>>>>>');
    console.info(requestObj.url);
    log.primary('>>>>>> 发送请求参数 >>>>>>');
    console.info(requestObj);
  }
  // 自定义请求拦截逻辑，可以处理权限，请求发送监控等
  // ...
  return requestObj;
}

// 请求失败
export function requestFailFunc(requestError) {
  // 自定义发送请求失败逻辑，断网，请求发送监控等
  // ...
  console.log(requestError);
  return Promise.reject(requestError);
}

// 响应成功
export function responseSuccessFunc(responseObj) {
  if (CONSOLE_RESPONSE_ENABLE) {
    log.capsule('YCH-FE', '响应成功后', 'success');
    log.success('>>>>>> 请求URL >>>>>>');
    console.info(responseObj.config.url);
    log.success('>>>>>> 发送请求参数 >>>>>>');
    console.info(responseObj);
  }
  // 自定义响应成功逻辑，全局拦截接口，根据不同业务做不同处理，响应成功监控等
  const resData = responseObj.data;
  const { Data, ResponseStatus } = resData;
  const { ErrorCode, Message } = ResponseStatus;

  if (!ResponseStatus) {
    return Promise.resolve(resData);
  }

  switch (Number(ErrorCode)) {
    case 0: // 如果业务成功，直接进成功回调
      return Promise.resolve(Data);
    default:
      const { errorCodeIgnore } = responseObj.config;
      if (errorCodeIgnore !== true
        && !(Array.isArray(errorCodeIgnore) && errorCodeIgnore.includes(ErrorCode))
      ) {
        systemErrorHandler(`${Message}(${ErrorCode})`);
      }
      return Promise.reject(resData);
  }
}

// 处理http错误
function handleHttpError({ response }) {
  let errorMsg;
  const { status } = response;
  const responseData = response.data.ResponseStatus;

  if (status >= 500) {
    errorMsg = (responseData && responseData.Message) || '服务器异常';
  } else if (status === 401) {
    loginTimeout();
    return false;
  } else if (status === 405) {
    period();
    return false;
  } else if (status >= 300) {
    // http 请求超时
    const statusMap = {
      404: '请求地址不存在',
      408: '请求超时，请重试！',
      401: '授权失败！',
    };

    errorMsg = statusMap[status] || '请求错误！';
  }
  return errorMsg;
}

// 响应失败
export function responseFailFunc(responseError) {
  return new Promise((resolve, reject) => {
    const { code, response, message } = responseError;
    let errorMsg;
    // 发送请求后，服务端返回的响应码不是 2xx;

    if (response && response.status === 417) {
      const responseData = response.data;
      const responseConfig = response.config;
      const { method, url, data } = responseConfig;
      const resMsg = JSON.parse(responseData.ResponseStatus.Message || null);

      const { AllAction = [], UIName = '' } = resMsg;
      const actionName = (AllAction[0].ActionName || '');

      vm.$createAuthDialog({
        $attrs: {
          visible: true,
          permission: Number(resMsg.ModelNum) + Number(resMsg.AllAction[0].ActionID),
          uiName: UIName,
          actionName,
          isPortAuth: true,
        },
        $events: {
          result: (is) => {
            if (!is) {
              reject(responseData);
              return;
            }
            window
              .$ajax[method](url, JSON.parse(data))
              .then(res => resolve(res), res => reject(res));
          },
        },
      });
    } else {
      if (response) {
        errorMsg = handleHttpError(responseError);
      } else if (code === 'ECONNABORTED') {
        errorMsg = '请求超时，请重试！';
      } else {
        const errorMap = {
          'Network Error': '网络异常，请查看网络设置！',
        };
        errorMsg = errorMap[message] || message;
      }

      errorMsg && httpErrorHandler(errorMsg, responseError);

      reject(responseError);
    }
  });
}
