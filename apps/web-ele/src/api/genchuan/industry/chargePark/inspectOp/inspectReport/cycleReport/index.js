import { requestClient } from '#/api/request.js';

export function getCycleReportPage(params) {
  return requestClient.get('/inspectop/cycle-report/page', { params });
}

export function generateCycleReport(data) {
  return requestClient.post('/inspectop/cycle-report/generate', data);
}

export function exportCycleReport(params) {
  return requestClient.download('/inspectop/cycle-report/export', {
    params,
  });
}

export function getCycleReportDetail(id) {
  return requestClient.get('/inspectop/cycle-report/get', {
    params: { id },
  });
}

export function getCycleReportChart(params) {
  return requestClient.get('/inspectop/cycle-report/chart', { params });
}
