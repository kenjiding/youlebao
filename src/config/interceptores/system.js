import { Message } from 'element-ui';

export function systemMessageHandler(msg) {
  Message({
    type: 'error',
    message: msg,
  });
}

export function authFail() {

}

export function systemErrorHandler() {

}
