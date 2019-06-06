export default [{
  path: '/goods-currency',
  name: 'goods-currency',
  component: () => import(/* webpackChunkName: "goods-currency" */ '@/modules/goods-currency/views/index.vue'),
}];
