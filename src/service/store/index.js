import actions from './common/actions';
import getters from './common/getters';
import { mutations, state } from './common/mutations';

import log from './modules/log';
import menu from './modules/menu';
import user from './modules/user';
import machine from './modules/machine';
import tips from './modules/tips';
import gobalConfig from './modules/gobal-config';

export default {
  state,
  getters,
  mutations,
  actions,
  modules: {
    log,
    menu,
    user,
    machine,
    gobalConfig,
    tips,
  },
};
