
import { Dialog } from 'element-ui';

export default {
  name: 'ElDialog',

  extends: Dialog,

  props: {
    closeOnClickModal: {
      type: Boolean,
      default: false,
    },
  },
};
