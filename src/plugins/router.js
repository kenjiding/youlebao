import Vue from 'vue';
import Router from 'vue-router';
import routes from '@/routes';

import { ROUTER_DEFAULT_CONFIG } from '@/config/index';
import { routerBeforeFunc, routerAfterFunc } from '@/config/interceptores';

Vue.use(Router);

const routerInstance = new Router({
  ...ROUTER_DEFAULT_CONFIG,
  routes,
});

routerInstance.beforeEach(routerBeforeFunc);
routerInstance.afterEach(routerAfterFunc);

export default routerInstance;
