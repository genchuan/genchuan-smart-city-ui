import { requestClient } from '#/api/request';

// ==================== 车位定位核心接口 ====================

export function getSpaceLocationPage(params) {
  return requestClient.get('/carservice/space-location/page', { params });
}

export function exportSpaceLocationExcel(params) {
  return requestClient.download('/carservice/space-location/export', params);
}

export function getSpaceLocationDetail(params) {
  return requestClient.get('/carservice/space-location/get', { params });
}

export function navigateToSpace(params) {
  return requestClient.get('/carservice/space-location/navigate', { params });
}

export function getSpaceLocationChart(params) {
  return requestClient.get('/carservice/space-location/chart', { params });
}

// ==================== 辅助接口 ====================

export async function getCarByPlateNo(plateNo) {
  const res = await requestClient.get('/usermerchant/user-car/page', {
    params: { plateNo, pageNo: 1, pageSize: 1 },
  });
  return res?.list?.[0] || null;
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
