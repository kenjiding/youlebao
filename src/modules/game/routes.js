export default [
  {
    path: '/swiping-card',
    name: 'swiping-card',
    component: () => import(/* webpackChunkName: "game-swiping-card" */ '@/modules/game/views/SwipingCard.vue'),
  },
  {
    path: '/check-ticket',
    name: 'check-ticket',
    component: () => import(/* webpackChunkName: "game-check-ticket" */ '@/modules/game/views/CheckTicket.vue'),
  },
  {
    path: '/cancel-order',
    name: 'cancel-order',
    component: () => import(/* webpackChunkName: "game-cancel-order" */ '@/modules/game/views/CancelOrder.vue'),
  },
  {
    path: '/manual-gate-out',
    name: 'manual-gate-out',
    component: () => import(/* webpackChunkName: "game-manual-gate-out" */ '@/modules/game/views/ManualGateOut.vue'),
  },
];
