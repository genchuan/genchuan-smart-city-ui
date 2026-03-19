import type { RouteRecordRaw } from 'vue-router';
// 配置顺昌大屏路由
const genchuanScreenRoutes: RouteRecordRaw[] = [
  {
    path: '/ChartAll',
    component: () => import('#/views/genchuan/shunchangOpsService/smartcity/screen/index.vue'),
    name: 'ChartAll',
    meta: {
      title: '态势感知',
      hideInMenu: true,
      hideInTab: true,
      noBasicLayout: true
    }
  },

];

export default genchuanScreenRoutes;
