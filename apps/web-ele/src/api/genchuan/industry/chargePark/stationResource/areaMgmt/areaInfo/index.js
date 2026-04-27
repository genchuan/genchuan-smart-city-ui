import { requestClient } from '#/api/request.js';

// 片区信息接口
const baseUrl = '/stationresource/area-info';

export function getAreaInfoPage(params) {
  return requestClient.get(`${baseUrl}/page`, { params });
}

export function getAreaInfoDetail(id) {
  return requestClient.get(`${baseUrl}/get`, { params: { id } });
}

export function createAreaInfo(data) {
  return requestClient.post(`${baseUrl}/create`, data);
}

export function updateAreaInfo(data) {
  return requestClient.put(`${baseUrl}/update`, data);
}

export function enableAreaInfo(data) {
  return requestClient.put(`${baseUrl}/enable`, data);
}

export function disableAreaInfo(data) {
  return requestClient.put(`${baseUrl}/disable`, data);
}

export function importAreaInfo(file, updateSupport = false) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('updateSupport', updateSupport);
  return requestClient.post(`${baseUrl}/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function exportAreaInfo(params) {
  return requestClient.download(`${baseUrl}/export`, { params });
}

export function getAreaInfoChart() {
  return requestClient.get(`${baseUrl}/chart`);
}
