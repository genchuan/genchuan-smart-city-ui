import { requestClient } from '#/api/request.js';

// 时段权限接口
const baseUrl = '/stationresource/time-permission';

export function getTimePermissionPage(params) {
  return requestClient.get(`${baseUrl}/page`, { params });
}

export function getTimePermissionDetail(id) {
  return requestClient.get(`${baseUrl}/get`, { params: { id } });
}

export function createTimePermission(data) {
  return requestClient.post(`${baseUrl}/create`, data);
}

export function updateTimePermission(data) {
  return requestClient.put(`${baseUrl}/update`, data);
}

export function enableTimePermission(data) {
  return requestClient.put(`${baseUrl}/enable`, data);
}

export function disableTimePermission(data) {
  return requestClient.put(`${baseUrl}/disable`, data);
}

export function importTimePermission(file, updateSupport = false) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('updateSupport', updateSupport);
  return requestClient.post(`${baseUrl}/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function getTimePermissionImportTemplate() {
  return requestClient.download(`${baseUrl}/get-import-template`);
}

export function exportTimePermission(params) {
  return requestClient.download(`${baseUrl}/export`, { params });
}

export function getTimePermissionChart(params) {
  return requestClient.get(`${baseUrl}/chart`, { params });
}
