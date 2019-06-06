import dayjs from 'dayjs';

export default {
  install(Vue) {
    Vue.filter(
      'date',
      (
        value = null,
        format = 'YYYY-MM-DD HH:mm:ss',
      ) => dayjs(value).format(format),
    );
  },
};
