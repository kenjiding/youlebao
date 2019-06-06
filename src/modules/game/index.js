import loadModuleData from '@/utils/load-module';
import createAPI from '@/utils/create-api';
import CheckTicketDialog from './_components/CheckTicketDialog.vue';
import CancelOrderDialog from './_components/CancelOrderDialog.vue';
import ManualGateOutDialog from './_components/ManualGateOutDialog.vue';
import SwipingCardDialog from './_components/SwipingCardDialog.vue';
import CashTimeTicketDialog from './_components/CashTimeTicketDialog.vue';

const service = loadModuleData(require.context('./', true, /.js$/));

export default {
  install(Vue, loadModule, moduleName) {
    loadModule(service, moduleName);
    createAPI(Vue, CheckTicketDialog, ['close'], true);
    createAPI(Vue, CancelOrderDialog, ['close'], true);
    createAPI(Vue, ManualGateOutDialog, ['close'], true);
    createAPI(Vue, SwipingCardDialog, ['close'], true);
    createAPI(Vue, CashTimeTicketDialog, ['close'], true);
  },
};
