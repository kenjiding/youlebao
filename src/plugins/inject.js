// eslint-disable-next-line
import { remote } from 'electron';
import dayjs from 'dayjs';
import RelativeTime from 'dayjs/plugin/relativeTime';
import IsLeapYear from 'dayjs/plugin/isLeapYear';
import number from 'numeral';
import Log from 'electron-log';

import hasPermission, { authorization } from '@/utils/has-permission';

import ui from './ui';

import filter from '../filters';

import axios from './axios';
import apiInstance from './api';
import consts from './const';
import log from './log';
import error from './error';
import device from './device';
import moduleLoad, { loadModuleService } from './module-load';

// window.GLOBAL.ajax = axios;
export default {
  /* eslint no-param-reassign: "error" */
  install(Vue) {
    Vue.prototype.$electronStore = remote.getGlobal('electronStore');
    Vue.prototype.$webContents = remote.getGlobal('webContents');
    Vue.prototype.$mainWin = remote.getGlobal('mainWin');
    // Vue.prototype.$cookies = remote.getGlobal('cookies');
    // window.$cookies = Vue.prototype.$cookies;
    Vue.prototype.$localLog = Log;

    Vue.prototype.$api = apiInstance.api;
    window.$api = apiInstance.api;
    Vue.prototype.$ajax = axios;
    window.$ajax = axios;
    Vue.prototype.$const = consts;
    Vue.prototype.$loadModule = loadModuleService;
    Vue.prototype.$device = device;
    Vue.prototype.$hasPermission = hasPermission;
    Vue.prototype.$authorization = authorization;

    dayjs.extend(RelativeTime);
    dayjs.extend(IsLeapYear);
    Vue.prototype.$date = dayjs;
    Vue.prototype.$number = number;

    Vue.use(moduleLoad);
    Vue.use(ui);
    Vue.use(log);
    Vue.use(error);

    Vue.use(filter);
  },
};
