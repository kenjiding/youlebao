export default [{
  path: '/ticket',
  name: 'ticket',
  component: () => import(/* webpackChunkName: "ticket" */ '@/modules/ticket/views/index.vue'),
}];
