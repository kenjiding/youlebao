import Vue from 'vue';
import Vuex from 'vuex';
import { VUEX_DEFAULT_CONFIG } from '@/config';

import store from '@/service/store';

Vue.use(Vuex);

export default new Vuex.Store({
  ...VUEX_DEFAULT_CONFIG,
  ...store,
});
