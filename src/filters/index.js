import dateFormat from './date';
import numberFormat from './number';

const filters = [
  dateFormat,
  numberFormat,
];

export default {
  install(Vue) {
    filters.forEach(filter => Vue.use(filter));
  },
};
