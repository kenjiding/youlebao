// import store from '@/plugins/store';

export function routerBeforeFunc(to, from, next) {
  // const { name } = to;
  // if (name !== 'login' && !store.getters['user/loginName']) {
  //   return next('/login');
  // }
  return next();
}

export function routerAfterFunc() {
  // console.log(to, from);
}
