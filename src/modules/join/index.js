import loadModuleData from '@/utils/load-module';
import createAPI from '@/utils/create-api';

import JoinMealDialog from './_components/JoinMealDialog.vue';

const service = loadModuleData(require.context('./', true, /.js$/));

export default {
  install(Vue, loadModule, moduleName) {
    loadModule(service, moduleName);

    createAPI(Vue, JoinMealDialog, ['close', 'complete'], true);
  },
};
