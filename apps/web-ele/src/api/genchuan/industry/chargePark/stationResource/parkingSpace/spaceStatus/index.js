import { requestClient } from '#/api/request.js';

// 车位状态未出现在已提供 API 清单中，当前按场站资源命名约定预留监控接口。
const baseUrl = '/stationresource/parking-space-status';

export function getParkingSpaceStatusPage(params) {
  return requestClient.get(`${baseUrl}/page`, { params });
}

export function getParkingSpaceStatusDetail(id) {
  return requestClient.get(`${baseUrl}/get`, { params: { id } });
}

export function importParkingSpaceStatus(file, updateSupport = false) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('updateSupport', updateSupport);
  return requestClient.post(`${baseUrl}/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function getParkingSpaceStatusImportTemplate() {
  return requestClient.download(`${baseUrl}/get-import-template`);
}

export function exportParkingSpaceStatus(params) {
  return requestClient.download(`${baseUrl}/export`, { params });
}

export function getParkingSpaceStatusChart(params) {
  return requestClient.get(`${baseUrl}/chart`, { params });
}
