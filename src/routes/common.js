export default [
  {
    path: '/more',
    name: 'more',
    component: () => import(/* webpackChunkName: "more" */ '@/modules/more/views/Index.vue'),
  },
];
