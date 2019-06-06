import Element from 'element-ui';

import base from '@/components/';

import 'reset-css/reset.css';
import '@/styles/element-variables.scss';
import '@/styles/icon/iconfont.css';
import '@/styles/common.scss';
import '@/styles/transition.scss';

export default {
  install(Vue) {
    Vue.use(Element);
    Vue.use(base);
    Element.MessageBox.setDefaults({
      closeOnClickModal: false,
    });
  },
};
