import { requestClient } from '#/api/request.js';

// 收费规则接口
const baseUrl = '/stationresource/fee-rule';

export function getFeeRulePage(params) {
  return requestClient.get(`${baseUrl}/page`, { params });
}

export function getFeeRuleDetail(id) {
  return requestClient.get(`${baseUrl}/get`, { params: { id } });
}

export function createFeeRule(data) {
  return requestClient.post(`${baseUrl}/create`, data);
}

export function updateFeeRule(data) {
  return requestClient.put(`${baseUrl}/update`, data);
}

export function enableFeeRule(data) {
  return requestClient.put(`${baseUrl}/enable`, data);
}

export function disableFeeRule(data) {
  return requestClient.put(`${baseUrl}/disable`, data);
}

export function importFeeRule(file, updateSupport = false) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('updateSupport', updateSupport);
  return requestClient.post(`${baseUrl}/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function exportFeeRule(params) {
  return requestClient.download(`${baseUrl}/export`, { params });
}

export function getFeeRuleChart(params) {
  return requestClient.get(`${baseUrl}/chart`, { params });
}
