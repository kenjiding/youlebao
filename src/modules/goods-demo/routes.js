export default [
  {
    path: '/test',
    name: 'test',
    component: () => import(/* webpackChunkName: "about" */ '@/modules/goods-demo/views/Home.vue'),
    children: [{
      path: 'about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ '@/modules/goods-demo/views/About.vue'),
    },
    {
      path: 'about1',
      name: 'about1',
      component: () => import(/* webpackChunkName: "about" */ '@/modules/goods-demo/views/About1.vue'),
    }, {
      path: 'about2',
      name: 'about2',
      component: () => import(/* webpackChunkName: "about" */ '@/modules/goods-demo/views/Coin.vue'),
    }, {
      path: 'about3',
      name: 'about3',
      component: () => import(/* webpackChunkName: "about" */ '@/modules/goods-demo/views/Finger.vue'),
    },
    {
      path: 'layout',
      name: 'layout',
      component: () => import(/* webpackChunkName: "about" */ '@/modules/goods-demo/views/ShortcutLayout.vue'),
    }],
  },
];
