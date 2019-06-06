/* eslint import/no-extraneous-dependencies: 0 */
import { remote } from 'electron';
import menuConfig from '@/config/datas/menu';
import { assert } from '@/utils/tools';
import { orderBy as _orderBy, pick as _pick } from 'lodash';

import { keyByName as menuMap } from '@/config/datas/menu-permissions-map';
import { IS_DEVELOP } from '@/config';

const userData = JSON.parse(sessionStorage.getItem('user'), null);

export default {
  namespaced: true,
  state: {
    currentTop: null,
    top: menuConfig,
    second: (() => {
      const obj = {};
      menuConfig.forEach((item) => {
        if (item.name) {
          obj[item.name] = [];
        }
      });

      return obj;
    })(),

    menuRoles: _pick(userData, ['MenuRoles']).MenuRoles || [],
  },

  getters: {
    secondFiltered(state, getters) {
      const filtered = {};
      Object.keys(state.second).forEach((key) => {
        const item = state.second[key] || [];
        filtered[key] = item.filter((menu) => {
          const menuKey = menuMap[menu.path];
          // 调试菜单
          if (IS_DEVELOP && menu.path.indexOf('/test') === 0) return true;
          // eslint-disable-next-line
          // if (true) return true;
          if (!menuKey) return false;

          return getters.openMenus.includes(Number(menuKey));
        });
      });
      return filtered;
    },

    getTop(state, getters) {
      return state.top.filter(item => getters.secondFiltered[item.name].length);
    },

    getCurrentSecond(state, getters) {
      return (getters.sortedSecond && getters.sortedSecond[state.currentTop]) || [];
      // return state.second || {};
    },

    sortedSecond(state, getters) {
      const secondMenu = getters.secondFiltered;
      const newMenu = {};
      Object.keys(secondMenu).forEach((key) => {
        newMenu[key] = _orderBy(secondMenu[key], ['order'], ['asc']);
      });

      return newMenu;
    },

    openMenus(state) {
      const menus = [];
      state.menuRoles.forEach((item) => {
        if (item.IsOpen) {
          menus.push(item.MenuKey);
        }
      });
      return menus;
    },
  },

  mutations: {
    setSecondMenu(state, data) {
      data.forEach((item) => {
        assert(item.parent, `二级菜单“${item.label}”对象，缺少parent参数`);

        if (state.second[item.parent]) {
          state.second[item.parent].push(item);
        }
      });
    },

    setCurrentTop(state, data) {
      state.currentTop = data;
    },

    setMenuRules(state, data = []) {
      state.menuRoles = data;
    },
  },

  actions: {
    getMenuRoluesOnCookies({ commit }) {
      remote.session.defaultSession.cookies.get({ name: 'menu-rules' }, (err, cookies) => {
        console.log(cookies);
        commit('setMenuRules', JSON.parse(cookies[0].value) || []);
      });
    },
  },
};
