export default [
  {
    path: '/join',
    name: 'join',
    component: () => import(/* webpackChunkName: "join" */ '@/modules/join/views/Index.vue'),
  },
];
