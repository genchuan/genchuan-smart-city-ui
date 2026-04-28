// /src/api/genchuan/industry/chargePark/carService/carGuide/spacePush/index.js
import { requestClient } from '#/api/request';

// 空位推送统计图表（折线图+卡片）
export function getSpacePushChart() {
  return requestClient.get('/carservice/space-push/chart');
}

// 分页查询空位推送记录
export function getSpacePushPage(params) {
  return requestClient.get('/carservice/space-push/page', { params });
}

// 折线图钻取（各日期推送量统计）
export function getSpacePushDrillLine(params) {
  return requestClient.get('/carservice/space-push/chart-drill-line', { params });
}

// 导出（支持 excel/pdf）
export function exportSpacePush(params) {
  return requestClient.download('/carservice/space-push/export', params);
}

// 批量推送
export function batchPushSpace(data) {
  return requestClient.put('/carservice/space-push/batch-push', data);
}

// 单条推送
export function pushSpace(params) {
  return requestClient.put('/carservice/space-push/push', null, { params });
}

// 详情
export function getSpacePushDetail(params) {
  return requestClient.get('/carservice/space-push/get', { params });
}

// 按状态统计推送数（卡片角标用）
export function countSpacePushByStatus() {
  return requestClient.get('/carservice/space-push/count-by-status');
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
