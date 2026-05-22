import { requestClient } from '#/api/request.js';

// 充停联动接口
const baseUrl = '/stationresource/charge-park-link';

export function getChargeParkLinkPage(params) {
  return requestClient.get(`${baseUrl}/page`, { params });
}

export function getChargeParkLinkDetail(id) {
  return requestClient.get(`${baseUrl}/get`, { params: { id } });
}

export function createChargeParkLink(data) {
  return requestClient.post(`${baseUrl}/create`, data);
}

export function updateChargeParkLink(data) {
  return requestClient.put(`${baseUrl}/update`, data);
}

export function enableChargeParkLink(data) {
  return requestClient.put(`${baseUrl}/enable`, data);
}

export function disableChargeParkLink(data) {
  return requestClient.put(`${baseUrl}/disable`, data);
}

export function importChargeParkLink(file, updateSupport = false) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('updateSupport', updateSupport);
  return requestClient.post(`${baseUrl}/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function getChargeParkLinkImportTemplate() {
  return requestClient.download(`${baseUrl}/get-import-template`);
}

export function exportChargeParkLink(params) {
  return requestClient.download(`${baseUrl}/export`, { params });
}

export function getChargeParkLinkChart(params) {
  return requestClient.get(`${baseUrl}/chart`, { params });
}
