import { requestClient } from '#/api/request';

// ==================== 意见建议核心接口 ====================

export function getSuggestionPage(params) {
  return requestClient.get('/carservice/suggestion/page', { params });
}

export function exportSuggestionExcel(params) {
  return requestClient.download('/carservice/suggestion/export', {
    params: { ...params, format: 'excel' },
  });
}

export function exportSuggestionPdf(params) {
  return requestClient.download('/carservice/suggestion/export', {
    params: { ...params, format: 'pdf' },
  });
}

export function getSuggestionDetail(params) {
  return requestClient.get('/carservice/suggestion/get', { params });
}

export function handleSuggestion(data) {
  return requestClient.put('/carservice/suggestion/handle', data);
}

export function updateProgress(data) {
  return requestClient.put('/carservice/suggestion/update-progress', data);
}

export function feedbackSuggestion(data) {
  return requestClient.put('/carservice/suggestion/feedback', data);
}

export function getSuggestionChartData(params) {
  return requestClient.get('/carservice/suggestion/chart', { params });
}

// ==================== 辅助接口 ====================

export function getUserDetail(userId) {
  return requestClient.get('/system/user/get', { params: { id: userId } });
}

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
