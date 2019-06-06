import { omit as _omit } from 'lodash';
import { keyByName as menuRulesByName } from '@/config/datas/menu-permissions-map';
import { IS_DEVELOP } from '@/config';
import hasPermission from '@/utils/has-permission';

const userData = JSON.parse(sessionStorage.getItem('user'), null);

export default {
  namespaced: true,
  state: {
    info: Object.assign({
      LevelName: null,
      LevelId: null,
      TargetLevelName: null,
      TargetLevelId: null,
      RealName: null,
      LoginName: null,
      MallName: null,
      BusinessId: null,
      BusinessName: null,
      PeriodName: null,
      ServerIsChain: true,
      Termina: null,
    }, _omit(userData, ['MenuRoles'])),
  },

  getters: {
    loginName(state) {
      return state.info.LoginName;
    },
  },

  mutations: {
    setInfo(state, data) {
      Object.assign(state.info, data);
      sessionStorage.setItem('user', JSON.stringify(state.info || null));
    },

    clearInfo(state) {
      Object.assign(state.info, {
        LevelName: null,
        LevelId: null,
        TargetLevelName: null,
        TargetLevelId: null,
        RealName: null,
        LoginName: null,
        MallName: null,
        BusinessId: null,
        BusinessName: null,
        PeriodName: null,
        ServerIsChain: true,
        Termina: null,
      });

      sessionStorage.removeItem('user');
    },
  },

  actions: {
    init({ dispatch }, vm) {
      dispatch('gobalConfig/asyncGobalConfig', vm, { root: true });
    },

    asyncGetUserInfo({ commit, rootGetters }, vm) {
      return window.$api['login/getUserLoginInfo']().then((res) => {
        const menuRules = res.MenuRoles;
        commit('menu/setMenuRules', menuRules, { root: true });
        commit('setInfo', res);
        // 一级菜单
        const getTopMenu = rootGetters['menu/getTop'] || [];
        // 二级菜单
        const getSortedSecond = rootGetters['menu/sortedSecond'] || {};
        const topName = (getTopMenu[0] || {}).name || null;
        const secondName = getSortedSecond[topName] || [];
        const secondPath = (secondName[0] || {}).path || null;
        const hasAccess = hasPermission(menuRulesByName[secondPath]);
        const hashVal = window.location.hash.replace('#', '');
        let routeName;
        let pathName = secondPath;
        routeName = hashVal;
        // 取得hash路由
        if (hashVal.indexOf('?') > -1) {
          [routeName] = hashVal.split('?');
        }

        if (routeName === '/' && secondPath === '/test/about' && IS_DEVELOP) { // 开发环境
          pathName = '/test/about';
        } else if (!topName || secondName.length === 0 // 无任何权限
          || (routeName === '/' && !hasAccess) // 初始化进入
          || routeName === '/more' // 更多页刷新
          || (secondPath !== '/test/about' && !IS_DEVELOP && !hasAccess)) {
          pathName = '/more';
        } else if (routeName !== '/' && hasPermission(menuRulesByName[routeName])) { // 当前页刷新
          pathName = routeName;
        }
        vm.$router.push({
          path: pathName,
        });
        return true;
      });
    },
  },
};
