import { requestClient } from '#/api/request.js';

// 场站信息接口
const baseUrl = '/stationresource/station-info';

export function getStationInfoPage(params) {
  return requestClient.get(`${baseUrl}/page`, { params });
}

export function getStationInfoDetail(id) {
  return requestClient.get(`${baseUrl}/get`, { params: { id } });
}

export function createStationInfo(data) {
  return requestClient.post(`${baseUrl}/create`, data);
}

export function updateStationInfo(data) {
  return requestClient.put(`${baseUrl}/update`, data);
}

export function enableStationInfo(data) {
  return requestClient.put(`${baseUrl}/enable`, data);
}

export function disableStationInfo(data) {
  return requestClient.put(`${baseUrl}/disable`, data);
}

export function importStationInfo(file, updateSupport = false) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('updateSupport', updateSupport);
  return requestClient.post(`${baseUrl}/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function getStationInfoImportTemplate() {
  return requestClient.download(`${baseUrl}/get-import-template`);
}

export function exportStationInfo(params) {
  return requestClient.download(`${baseUrl}/export`, { params });
}

export function getStationInfoChart() {
  return requestClient.get(`${baseUrl}/chart`);
}
