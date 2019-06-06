export default [
  {
    path: '/sell',
    name: 'sell',
    component: () => import(/* webpackChunkName: "sell" */ '@/modules/sell/views/Index.vue'),
  },
];
