import Vue from 'vue';
import { sync } from 'vuex-router-sync';

import '@/directives';

import router from '@/plugins/router';
import store from '@/plugins/store';
import inject from '@/plugins/inject';
import VueQriously from 'vue-qriously';

import App from './App.vue';

// store.dispatch('menu/getMenuRoluesOnCookies');

sync(store, router);
Vue.use(inject);
// 注册生成二维码插件
Vue.use(VueQriously);

Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

