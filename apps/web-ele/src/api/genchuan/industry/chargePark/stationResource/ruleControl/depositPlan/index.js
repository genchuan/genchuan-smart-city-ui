import { requestClient } from '#/api/request.js';

// 押金方案接口
const baseUrl = '/stationresource/deposit-plan';

export function getDepositPlanPage(params) {
  return requestClient.get(`${baseUrl}/page`, { params });
}

export function getDepositPlanDetail(id) {
  return requestClient.get(`${baseUrl}/get`, { params: { id } });
}

export function createDepositPlan(data) {
  return requestClient.post(`${baseUrl}/create`, data);
}

export function updateDepositPlan(data) {
  return requestClient.put(`${baseUrl}/update`, data);
}

export function enableDepositPlan(data) {
  return requestClient.put(`${baseUrl}/enable`, data);
}

export function disableDepositPlan(data) {
  return requestClient.put(`${baseUrl}/disable`, data);
}

export function importDepositPlan(file, updateSupport = false) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('updateSupport', updateSupport);
  return requestClient.post(`${baseUrl}/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function getDepositPlanImportTemplate() {
  return requestClient.download(`${baseUrl}/get-import-template`);
}

export function exportDepositPlan(params) {
  return requestClient.download(`${baseUrl}/export`, { params });
}

export function getDepositPlanChart(params) {
  return requestClient.get(`${baseUrl}/chart`, { params });
}
