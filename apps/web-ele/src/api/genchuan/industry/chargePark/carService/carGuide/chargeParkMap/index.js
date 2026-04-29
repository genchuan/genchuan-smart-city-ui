import { requestClient } from '#/api/request';

// 充停地图统计图表（地图+热力图+卡片）
export function getChargeParkMapChart() {
  return requestClient.get('/carservice/charge-park-map/chart');
}

// 分页查询充停地图记录
export function getChargeParkMapPage(params) {
  return requestClient.get('/carservice/charge-park-map/page', { params });
}

// 热力图钻取（区域车位使用统计）
export function getChargeParkMapDrillHeat(params) {
  return requestClient.get('/carservice/charge-park-map/chart-drill-heat', { params });
}

// 详情
export function getChargeParkMapDetail(params) {
  return requestClient.get('/carservice/charge-park-map/get', { params });
}

// 导航（跳转外部地图）
export function navigateChargeParkMap(params) {
  return requestClient.get('/carservice/charge-park-map/navigate', { params });
}

// 预订（跳转预约页面）
export function reserveChargeParkMap(params) {
  return requestClient.get('/carservice/charge-park-map/reserve', { params });
}

export async function getUserList() {
  try {
    const res = await requestClient.get('/system/user/simple-list');
    return (res || []).map(user => ({
      userId: user.id,
      userName: user.nickname,
      nickname: user.nickname,
    }));
  } catch {
    return [
      { userId: 2001, userName: '救援张三', nickname: '救援张三' },
      { userId: 2002, userName: '救援李四', nickname: '救援李四' },
    ];
  }
}
// 获取用户详情
export function getUserDetail(userId) {
  return requestClient.get('/system/user/get', { params: { id: userId } });
}
