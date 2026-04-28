import { requestClient } from '#/api/request';

// ==================== 预约列表核心接口 ====================

export function getReserveListPage(params) {
  return requestClient.get('/carservice/reserve-list/page', { params });
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
    // 请替换为实际场站列表接口
    const res = await requestClient.get('/carservice/station/list');
    return res || [];
  } catch {
    return [];
  }
}

export async function getSpaceList() {
  try {
    // 请替换为实际车位列表接口
    const res = await requestClient.get('/carservice/space/list');
    return res || [];
  } catch {
    return [];
  }
}
