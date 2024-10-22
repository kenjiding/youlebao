/* eslint-disable */
import dayjs from 'dayjs';
import { get, toString } from 'lodash';
// import cookies from '@/utils/cookies';
// import util from '@/libs/util.js';

export default {
  namespaced: true,
  state: {
    // 错误日志
    list: [],
  },
  getters: {
    /**
     * @description 返回现存 log (all) 的条数
     * @param {*} state vuex state
     */
    length(state) {
      return state.list.length;
    },
    /**
     * @description 返回现存 log (error) 的条数
     * @param {*} state vuex state
     */
    lengthError(state) {
      return state.list.filter(l => l.type === 'error').length;
    },
  },
  mutations: {
    /**
     * @description 清空日志
     * @param {Object} state vuex state
     */
    clean(state) {
      // store 赋值
      state.list = [];
    },

    push (state, {
      type, err, vm, info,
    }) {
      state.list.push({ type });
    }
  },
  actions: {
    /**
     * @description 添加一个日志
     * @param {Object} param type {String} 类型
     * @param {Object} param err {Error} 错误对象
     * @param {Object} param vm {Object} vue 实例
     * @param {Object} param info {String} 信息
     */
    add({ state, commit }, data) {
      // console.log(data);
      // console.log(type);
      // commit('push')
      // state.list.push(data)
      // store 赋值
      // state.list.push(Object.assign({
      //   // 记录类型
      //   type: 'log', // or error
      //   // 信息
      //   info: '',
      //   // 错误对象
      //   err: '',
      //   // vue 实例
      //   vm: '',
      //   // 当前用户信息
      //   // user: rootState.d2admin.user.info,
      //   // 当前用户的 uuid
      //   // uuid: cookies.get('uuid'),
      //   // 当前的 token
      //   // token: cookies.get('token'),
      //   // 当前地址
      //   url: get(window, 'location.href', ''),
      //   // 当前时间
      //   time: dayjs().format('YYYY-M-D HH:mm:ss'),
      // }, {
      //   type,
      //   err,
      //   vm,
      //   info: toString(info),
      // }));
    },
  },
};
