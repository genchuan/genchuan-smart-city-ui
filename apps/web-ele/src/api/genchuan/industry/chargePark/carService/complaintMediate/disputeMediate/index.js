import { requestClient } from '#/api/request';

// ==================== 纠纷调解核心接口 ====================

export function getDisputeMediatePage(params) {
  return requestClient.get('/carservice/dispute-mediate/page', { params });
}

export function exportDisputeMediate(params) {
  return requestClient.download('/carservice/dispute-mediate/export', params);
}

export function getDisputeMediateDetail(params) {
  return requestClient.get('/carservice/dispute-mediate/get', { params });
}

export function mediateDispute(data) {
  return requestClient.put('/carservice/dispute-mediate/mediate', data);
}

export function updateDisputeProgress(data) {
  return requestClient.put('/carservice/dispute-mediate/update-progress', data);
}

export function confirmDispute(data) {
  return requestClient.put('/carservice/dispute-mediate/confirm', data);
}

export function getDisputeMediateChartData(params) {
  return requestClient.get('/carservice/dispute-mediate/chart', { params });
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

export async function getMerchantList() {
  try {
    const res = await requestClient.get('/system/merchant/simple-list');
    return (res || []).map(merchant => ({
      merchantId: merchant.id,
      merchantName: merchant.name,
    }));
  } catch {
    return [];
  }
}
