import router from '@/plugins/router';
import store from '@/plugins/store';
import modules from '@/modules';
import api from './api';
// import menuManager from './menu';

/**
 *  加载模块service
 * @param {Object} config
 *  config 包括以下属性
 *    apis: 接口
 *    consts: 常量
 *    reoutes: 路由
 *    store: 数据存储(vuex)
 */
export function loadModuleService({
  apis,
  // consts = {},
  routes,
  stores,
  menu,
}, moduleName) {
  if (Array.isArray(routes)) {
    router.addRoutes(routes);
  }

  if (stores) {
    store.registerModule(moduleName, stores);
  }

  if (apis) {
    api.apiBuilder({
      moduleName,
      config: apis,
    });
  }

  if (menu) {
    store.commit('menu/setSecondMenu', menu);
  }
}

export default {
  install(Vue) {
    modules.forEach(module => Vue.use(module, loadModuleService, module.moduleName));
  },
};
