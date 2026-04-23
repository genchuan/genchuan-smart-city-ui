import { requestClient } from '#/api/request';

// ==================== 话术管理核心接口 ====================

export function getWordingMgmtPage(params) {
  return requestClient.get('/carservice/wording-mgmt/page', { params });
}

export function createWordingMgmt(data) {
  return requestClient.post('/carservice/wording-mgmt/create', data);
}

export function updateWordingMgmt(data) {
  return requestClient.put('/carservice/wording-mgmt/update', data);
}

export function saveWordingMgmt(data) {
  return requestClient.put('/carservice/wording-mgmt/save', data);
}

export function enableWordingMgmt(params) {
  return requestClient.put('/carservice/wording-mgmt/enable', null, { params });
}

export function disableWordingMgmt(params) {
  return requestClient.put('/carservice/wording-mgmt/disable', null, { params });
}

export function getWordingMgmtDetail(params) {
  return requestClient.get('/carservice/wording-mgmt/get', { params });
}

export function getWordingMgmtChartData() {
  return requestClient.get('/carservice/wording-mgmt/chart');
}

export function checkNameUnique(params) {
  return requestClient.get('/carservice/wording-mgmt/check-name-unique', { params });
}
