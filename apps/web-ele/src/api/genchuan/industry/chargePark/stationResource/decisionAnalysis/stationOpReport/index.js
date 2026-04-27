import { requestClient } from '#/api/request.js';

// 场站资源周期报表接口
const baseUrl = '/stationresource/station-op-report';

export function getStationOpReportPage(params) {
  return requestClient.get(`${baseUrl}/page`, { params });
}

export function getStationOpReportDetail(id) {
  return requestClient.get(`${baseUrl}/get`, { params: { id } });
}

export function exportStationOpReport(params) {
  return requestClient.download(`${baseUrl}/export`, { params });
}

export function getStationOpReportChart(params) {
  return requestClient.get(`${baseUrl}/chart`, { params });
}

export function generateStationOpReport(data) {
  return requestClient.post(`${baseUrl}/create`, data);
}

export function createStationOpReport(data) {
  return generateStationOpReport(data);
}
