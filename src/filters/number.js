import numeral from 'numeral';

export default {
  install(Vue) {
    Vue.filter(
      'number',
      (
        value = null,
        format = '0,0',
      ) => numeral(value).format(format),
    );
  },
};
