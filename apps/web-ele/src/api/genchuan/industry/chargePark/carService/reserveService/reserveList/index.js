import { requestClient } from '#/api/request';

// ==================== 预约列表核心接口 ====================

export function getReserveListPage(params) {
  return requestClient.get('/carservice/reserve-list/page', { params });
}

export function createReserve(data) {
  return requestClient.post('/carservice/reserve-list/create', data);
}

export function exportReserveListExcel(params) {
  return requestClient.download('/carservice/reserve-list/export', params);
}

export function batchAuditReserve(data) {
  return requestClient.put('/carservice/reserve-list/batch-audit', data);
}

export function approveReserve(data) {
  return requestClient.put('/carservice/reserve-list/approve', data);
}

export function rejectReserve(data) {
  return requestClient.put('/carservice/reserve-list/reject', data);
}

export function cancelReserve(data) {
  return requestClient.put('/carservice/reserve-list/cancel', null, { params: data });
}

export function completeReserve(data) {
  return requestClient.put('/carservice/reserve-list/complete', null, { params: data });
}

export function evaluateReserve(data) {
  return requestClient.put('/carservice/reserve-list/evaluate', data);
}

export function getReserveDetail(params) {
  return requestClient.get('/carservice/reserve-list/get', { params });
}

export function getReserveChartData(params) {
  return requestClient.get('/carservice/reserve-list/chart', { params });
}

// ==================== 辅助接口 ====================

export async function getUserList() {
  try {
    const res = await requestClient.get('/system/user/simple-list');
    return (res || []).map(user => ({
      userId: user.id,
      userName: user.nickname,
    }));
  } catch {
    return [];
  }
}

export async function getStationList() {
  try {
    // 调 stationresource 模块的场站分页接口（pageSize 设大一点保证全部拿到）
    const res = await requestClient.get('/stationresource/station-info/page', {
      params: { pageNo: 1, pageSize: 200 },
    });
    return res?.list || [];
  } catch (e) {
    console.warn('获取场站列表失败', e);
    return [];
  }
}

export async function getSpaceList() {
  try {
    const res = await requestClient.get('/stationresource/parking-space-info/page', {
      params: { pageNo: 1, pageSize: 200 },
    });
    // 车位字段一般是 spaceNo，UI 里展示就用它当 name
    return (res?.list || []).map(s => ({ ...s, name: s.name || s.spaceNo }));
  } catch (e) {
    console.warn('获取车位列表失败', e);
    return [];
  }
}
