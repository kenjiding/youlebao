import createAPI from '@/utils/create-api';

import Scroll from './scroll';
import ReadCard from './read-card';
import Page from './page';
import SvgIcon from './svg-icon';
import ColorSelect from './color-select';

import coinComponents from './coin-machine/index';
import AuthDialog from './auth-dialog/index';
import overrideDialog from './override/dialog/index';

const components = [
  Scroll,
  ReadCard,
  Page,
  SvgIcon,
  ColorSelect,
  overrideDialog,
];

export default {
  install(Vue) {
    components.forEach(item => Vue.component(item.name, item));

    createAPI(Vue, coinComponents.inventoryCoin, ['success', 'closeDialog'], true);
    createAPI(Vue, coinComponents.outCoin, ['complete', 'closeDialog', 'error'], true);
    createAPI(Vue, coinComponents.outCoinLog, ['close'], true);
    createAPI(Vue, AuthDialog, ['result'], false);
  },
};
