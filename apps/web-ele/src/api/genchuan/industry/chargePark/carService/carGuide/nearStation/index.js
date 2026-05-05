import { requestClient } from '#/api/request';

// 周边场站统计图表（地图+柱状图+卡片）
// params 支持 { lon, lat, startTime, endTime }；lon/lat 是"当前位置"参考点，柱状图以此计算各场站距离分桶
export function getNearStationChart(params) {
  return requestClient.get('/carservice/near-station/chart', { params });
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

// 某次查询返回的场站明细快照（点击列表"周边场站数"/"空位场站数"用）
// params: { nearStationId, onlyHasEmpty }
export function getNearStationResult(params) {
  return requestClient.get('/carservice/near-station/result', { params });
}

// 获取用户详情（点击列表"用户"列用）
export function getUserDetail(userId) {
  return requestClient.get('/system/user/get', { params: { id: userId } });
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
