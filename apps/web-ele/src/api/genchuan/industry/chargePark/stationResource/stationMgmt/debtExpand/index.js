import { requestClient } from '#/api/request.js';

// 联合追缴拓场接口
const baseUrl = '/stationresource/debt-expand';

export function getDebtExpandPage(params) {
  return requestClient.get(`${baseUrl}/page`, { params });
}

export function getDebtExpandDetail(id) {
  return requestClient.get(`${baseUrl}/get`, { params: { id } });
}

export function createDebtExpand(data) {
  return requestClient.post(`${baseUrl}/create`, data);
}

export function updateDebtExpand(data) {
  return requestClient.put(`${baseUrl}/update`, data);
}

export function enableDebtExpand(data) {
  return requestClient.put(`${baseUrl}/enable`, data);
}

export function disableDebtExpand(data) {
  return requestClient.put(`${baseUrl}/disable`, data);
}

export function importDebtExpand(file, updateSupport = false) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('updateSupport', updateSupport);
  return requestClient.post(`${baseUrl}/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function exportDebtExpand(params) {
  return requestClient.download(`${baseUrl}/export`, { params });
}

export function getDebtExpandChart(params) {
  return requestClient.get(`${baseUrl}/chart`, { params });
}
