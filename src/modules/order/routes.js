export default [
  {
    path: '/order',
    name: 'order',
    component: () => import(/* webpackChunkName: "order" */ '@/modules/order/views/Index.vue'),
  },
];
