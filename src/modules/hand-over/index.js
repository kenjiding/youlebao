import loadModuleData from '@/utils/load-module';
import createAPI from '@/utils/create-api';
import OtherExpensesDialog from './_components/OtherExpensesDialog.vue';
import OtherRevenueDialog from './_components/OtherRevenueDialog.vue';

const service = loadModuleData(require.context('./', true, /.js$/));

export default {
  install(Vue, loadModule, moduleName) {
    loadModule(service, moduleName);
    createAPI(Vue, OtherExpensesDialog, ['close'], true);
    createAPI(Vue, OtherRevenueDialog, ['close'], true);
  },
};
