import loadModuleData from '@/utils/load-module';
import Main from './views/Index.vue';

const service = loadModuleData(require.context('./', true, /.js$/));

export { Main };

export default {
  install(Vue, loadModule, moduleName) {
    loadModule(service, moduleName);
  },
};
