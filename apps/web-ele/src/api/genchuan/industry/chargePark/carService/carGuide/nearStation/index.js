import { requestClient } from '#/api/request';

// 周边场站统计图表（地图+柱状图+卡片）
export function getNearStationChart() {
  return requestClient.get('/carservice/near-station/chart');
}

// 分页查询周边场站记录
export function getNearStationPage(params) {
  return requestClient.get('/carservice/near-station/page', { params });
}

// 柱状图钻取（各距离区间场站统计）
export function getNearStationDrillBar(params) {
  return requestClient.get('/carservice/near-station/chart-drill-bar', { params });
}

// 详情
export function getNearStationDetail(params) {
  return requestClient.get('/carservice/near-station/get', { params });
}

// 导航（跳转到周边场站位置）
export function navigateNearStation(params) {
  return requestClient.get('/carservice/near-station/navigate', { params });
}

// 预订（跳转预约页面）
export function reserveNearStation(params) {
  return requestClient.get('/carservice/near-station/reserve', { params });
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
