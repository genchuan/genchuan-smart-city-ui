import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/member/upgrade',
    name: 'MemberUpgrade',
    component: () => import('#/views/genchuan/memberUpgrade/index.vue'),
    meta: {
      title: '升级会员',
      icon: 'mdi:crown',
      keepAlive: true,
      hideInMenu: true,
    },
  },
];

export default routes;
