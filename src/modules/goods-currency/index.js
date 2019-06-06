import loadModuleData from '@/utils/load-module';
import createApi from '@/utils/create-api';
import currency from './views/GlobalIndex.vue';

const service = loadModuleData(require.context('./', true, /.js$/));

export default {

  install(Vue, loadModule, moduleName) {
    loadModule(service, moduleName);

    createApi(Vue, currency, ['close'], true);
  },
};
