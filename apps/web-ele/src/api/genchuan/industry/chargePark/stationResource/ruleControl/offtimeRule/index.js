import { requestClient } from '#/api/request.js';

// 错时规则接口
const baseUrl = '/stationresource/offtime-rule';

export function getOfftimeRulePage(params) {
  return requestClient.get(`${baseUrl}/page`, { params });
}

export function getOfftimeRuleDetail(id) {
  return requestClient.get(`${baseUrl}/get`, { params: { id } });
}

export function createOfftimeRule(data) {
  return requestClient.post(`${baseUrl}/create`, data);
}

export function updateOfftimeRule(data) {
  return requestClient.put(`${baseUrl}/update`, data);
}

export function enableOfftimeRule(data) {
  return requestClient.put(`${baseUrl}/enable`, data);
}

export function disableOfftimeRule(data) {
  return requestClient.put(`${baseUrl}/disable`, data);
}

export function importOfftimeRule(file, updateSupport = false) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('updateSupport', updateSupport);
  return requestClient.post(`${baseUrl}/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function getOfftimeRuleImportTemplate() {
  return requestClient.download(`${baseUrl}/get-import-template`);
}

export function exportOfftimeRule(params) {
  return requestClient.download(`${baseUrl}/export`, { params });
}

export function getOfftimeRuleChart(params) {
  return requestClient.get(`${baseUrl}/chart`, { params });
}
