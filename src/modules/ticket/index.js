import loadModuleData from '@/utils/load-module';
import createAPI from 'cube-ui/lib/create-api';

import PrintWebView from './_components/PrintWebView.vue';
import RightPage from './_components/RightPage.vue';

export { RightPage };

const service = loadModuleData(require.context('./', true, /.js$/));

export default {
  install(Vue, loadModule, moduleName) {
    loadModule(service, moduleName);

    createAPI(Vue, PrintWebView, ['complete', 'cancel'], true);
  },
};
