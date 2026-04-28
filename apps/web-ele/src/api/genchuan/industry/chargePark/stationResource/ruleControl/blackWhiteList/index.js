import { requestClient } from '#/api/request.js';

// 黑白名单接口
const baseUrl = '/stationresource/black-white-list';

export function getBlackWhiteListPage(params) {
  return requestClient.get(`${baseUrl}/page`, { params });
}

export function getBlackWhiteListDetail(id) {
  return requestClient.get(`${baseUrl}/get`, { params: { id } });
}

export function createBlackWhiteList(data) {
  return requestClient.post(`${baseUrl}/create`, data);
}

export function updateBlackWhiteList(data) {
  return requestClient.put(`${baseUrl}/update`, data);
}

export function enableBlackWhiteList(data) {
  return requestClient.put(`${baseUrl}/enable`, data);
}

export function disableBlackWhiteList(data) {
  return requestClient.put(`${baseUrl}/disable`, data);
}

export function importBlackWhiteList(file, updateSupport = false) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('updateSupport', updateSupport);
  return requestClient.post(`${baseUrl}/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function exportBlackWhiteList(params) {
  return requestClient.download(`${baseUrl}/export`, { params });
}

export function getBlackWhiteListChart(params) {
  return requestClient.get(`${baseUrl}/chart`, { params });
}
