import { requestClient } from '#/api/request.js';

export function getInspectOpReportPage(params) {
  return requestClient.get('/inspectop/inspect-op-report/page', { params });
}

export function exportInspectOpReport(params) {
  return requestClient.download('/inspectop/inspect-op-report/export-excel', {
    params,
  });
}

export function getInspectOpReportDetail(id) {
  return requestClient.get('/inspectop/inspect-op-report/get', {
    params: { id },
  });
}

export function getInspectOpReportChart(params) {
  return requestClient.get('/inspectop/inspect-op-report/chart', { params });
}
