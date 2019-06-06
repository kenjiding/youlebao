export default [{
  path: '/goods-exchange',
  name: 'goods-exchange',
  component: () => import(/* webpackChunkName: "goods-exchange" */ '@/modules/goods-exchange/views/index.vue'),
}, {
  path: '/exchange-query',
  name: 'exchange-query',
  component: () => import(/* webpackChunkName: "goods-exchange-query" */ '@/modules/goods-exchange/views/ExchangeQuery.vue'),
}];
