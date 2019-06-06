import loadModuleData from '@/utils/load-module';
import createAPI from '@/utils/create-api';

import EnableStateChange from './_components/EnableStateChange.vue';
import LevelChange from './_components/LevelChange.vue';
import EditLeaguerInfo from './_components/EditLeaguerInfo.vue';
import EditPassword from './_components/EditPassword.vue';
import Renewal from './_components/Renewal.vue';
import LockAccount from './_components/LockAccount.vue';
import TransferAccount from './_components/TransferAccount.vue';
import CancelLeaguer from './_components/CancelLeaguer.vue';
import CardChange from './_components/CardChange.vue';
import StoreLottery from './_components/StoreLottery.vue';
import CompensateCoin from './_components/CompensateCoin.vue';
import GetCoin from './_components/GetCoin.vue';
import LeaguerRoamDialog from './_components/LeaguerRoamDialog.vue';
import SubCardManagement from './_components/SubCardManagement.vue';
import LotteryManagement from '../lottery/_components/LotteryManagement.vue';


const service = loadModuleData(require.context('./', true, /.js$/));

export default {
  install(Vue, loadModule, moduleName) {
    loadModule(service, moduleName);

    createAPI(Vue, EnableStateChange, ['close', 'complete'], true);
    createAPI(Vue, LevelChange, ['close', 'complete'], true);
    createAPI(Vue, EditLeaguerInfo, ['close', 'complete'], true);
    createAPI(Vue, EditPassword, ['close', 'complete'], true);
    createAPI(Vue, Renewal, ['close', 'complete'], true);
    createAPI(Vue, LockAccount, ['close', 'complete'], true);
    createAPI(Vue, TransferAccount, ['close', 'complete'], true);
    createAPI(Vue, CancelLeaguer, ['close', 'complete'], true);
    createAPI(Vue, CardChange, ['close', 'complete'], true);
    createAPI(Vue, StoreLottery, ['close', 'complete'], true);
    createAPI(Vue, CompensateCoin, ['close', 'complete'], true);
    createAPI(Vue, GetCoin, ['close', 'complete'], true);
    createAPI(Vue, LeaguerRoamDialog, ['close', 'complete'], true);
    createAPI(Vue, SubCardManagement, ['close', 'complete'], true);
    createAPI(Vue, LotteryManagement, ['close', 'complete'], true);
  },
};
