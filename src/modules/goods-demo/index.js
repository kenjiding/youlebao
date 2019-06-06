import loadModuleData from '@/utils/load-module';

const service = loadModuleData(require.context('./', true, /\.js$/));

export default {
  install(Vue, loadModule, moduleName) {
    loadModule(service, moduleName);
  },
};
