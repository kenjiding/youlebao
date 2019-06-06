export default [
  {
    path: '/hand-over',
    name: 'hand-over',
    component: () => import(/* webpackChunkName: "hand-over" */ '@/modules/hand-over/views/HandOver.vue'),
  },
  {
    path: '/other-revenue',
    name: 'other-revenue',
    component: () => import(/* webpackChunkName: "hand-over-other-revenue" */ '@/modules/hand-over/views/OtherRevenue.vue'),
  },
  {
    path: '/other-expenses',
    name: 'other-expenses',
    component: () => import(/* webpackChunkName: "hand-over-other-expenses" */ '@/modules/hand-over/views/OtherExpenses.vue'),
  },
];
