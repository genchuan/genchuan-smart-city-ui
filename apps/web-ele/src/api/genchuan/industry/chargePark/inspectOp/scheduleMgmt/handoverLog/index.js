import { requestClient } from '#/api/request.js';

export { loadScheduleUserOptions, userOptions } from '../userOptions.js';

/** 分页查询交接日志列表 */
export function getHandoverLogPage(params) {
  return requestClient.get('/inspectop/handover-log/page', { params });
}

/** 导出交接日志数据 */
export function exportHandoverLog(params) {
  return requestClient.download('/inspectop/handover-log/export-excel', {
    params,
  });
}

/** 新增交接日志 */
export function createHandoverLog(data) {
  return requestClient.post('/inspectop/handover-log/create', data);
}

/** 获取交接日志详情 */
export function getHandoverLogDetail(id) {
  return requestClient.get('/inspectop/handover-log/get', { params: { id } });
}

/** 确认交接日志 */
export function confirmHandoverLog(data) {
  return requestClient.put('/inspectop/handover-log/confirm', data);
}

/** 获取交接日志统计看板 */
export function getHandoverLogChart(params) {
  return requestClient.get('/inspectop/handover-log/chart', { params });
}
