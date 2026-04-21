import { requestClient } from '#/api/request.js';

/** 分页查询巡检上报列表 */
export function getInspectReportPage(params) {
  return requestClient.get('/inspectop/inspect-report/page', { params });
}

/** 导出巡检上报数据 */
export function exportInspectReport(params) {
  return requestClient.download('/inspectop/inspect-report/export-excel', {
    params,
  });
}

/** 批量审核巡检上报 */
export function batchAuditInspectReport(data) {
  return requestClient.put('/inspectop/inspect-report/batch-audit', data);
}

/** 获取巡检上报详情 */
export function getInspectReportDetail(id) {
  return requestClient.get('/inspectop/inspect-report/get', { params: { id } });
}

/** 审核通过巡检上报 */
export function approveInspectReport(data) {
  return requestClient.put('/inspectop/inspect-report/approve', data);
}

/** 驳回巡检上报 */
export function rejectInspectReport(data) {
  return requestClient.put('/inspectop/inspect-report/reject', data);
}

/** 执行巡检上报处置 */
export function processInspectReport(data) {
  return requestClient.put('/inspectop/inspect-report/process', data);
}

/** 获取巡检上报统计看板 */
export function getInspectReportChart(params) {
  return requestClient.get('/inspectop/inspect-report/chart', { params });
}
