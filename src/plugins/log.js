// import store from '@/store'
import log from '@/utils/log';

export default {
  install(Vue) {
    // 快速打印 log
    Vue.prototype.$log = log;
    // 快速记录日志
    Vue.prototype.$logAdd = (info, show = true) => {
      // store 赋值
      // store.dispatch('d2admin/log/add', {
      //   type: 'log',
      //   info,
      // });
      // 显示在控制台
      if (show && process.env.NODE_ENV === 'development') {
        log.default(info);
      }
    };
  },
};
