export default [
  {
    path: '/leaguer',
    name: 'leaguer',
    component: () => import(/* webpackChunkName: "leaguer" */ '@/modules/leaguer/views/Index.vue'),
  },
  {
    path: '/leaguer-roam',
    name: 'leaguer-roam',
    component: () => import('@/modules/leaguer/_components/LeaguerRoam.vue'),
  },
];
