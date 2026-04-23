import { requestClient } from '#/api/request';

// ==================== 用户申诉核心接口 ====================

export function getUserAppealPage(params) {
  return requestClient.get('/carservice/user-appeal/page', { params });
}

export function exportUserAppeal(params) {
  return requestClient.download('/carservice/user-appeal/export', params);
}

export function getUserAppealDetail(params) {
  return requestClient.get('/carservice/user-appeal/get', { params });
}

export function approveAppeal(data) {
  return requestClient.put('/carservice/user-appeal/approve', data);
}

export function rejectAppeal(data) {
  return requestClient.put('/carservice/user-appeal/reject', data);
}

export function executeAppeal(data) {
  return requestClient.put('/carservice/user-appeal/execute', data);
}

export function feedbackAppeal(data) {
  return requestClient.put('/carservice/user-appeal/feedback', data);
}

export function batchAuditAppeal(data) {
  return requestClient.put('/carservice/user-appeal/batch-audit', data);
}

export function getUserAppealChartData(params) {
  return requestClient.get('/carservice/user-appeal/chart', { params });
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
