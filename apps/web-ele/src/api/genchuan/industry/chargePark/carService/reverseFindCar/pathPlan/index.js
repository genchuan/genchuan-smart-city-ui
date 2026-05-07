import { requestClient } from '#/api/request';

// ==================== 路径规划核心接口 ====================

export function getPathPlanPage(params) {
  return requestClient.get('/carservice/path-plan/page', { params });
}

export function exportPathPlanExcel(params) {
  return requestClient.download('/carservice/path-plan/export', {
    params: { ...params, format: 'excel' },
  });
}

export function exportPathPlanPdf(params) {
  return requestClient.download('/carservice/path-plan/export', {
    params: { ...params, format: 'pdf' },
  });
}

export function getPathPlanDetail(params) {
  return requestClient.get('/carservice/path-plan/get', { params });
}

export function navigatePathPlan(params) {
  return requestClient.get('/carservice/path-plan/navigate', { params });
}

export function getPathPlanChart(params) {
  return requestClient.get('/carservice/path-plan/chart', { params });
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
