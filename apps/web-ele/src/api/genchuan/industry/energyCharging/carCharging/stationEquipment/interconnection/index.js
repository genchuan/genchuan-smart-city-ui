import { requestClient } from '#/api/request';

/** 互联互通分页查询 */
export function getInterconnectionPage(params) {
  return requestClient.get('/vehiclecharging/interconnection/page', { params });
}

/** 互联互通申请 */
export function applyInterconnection(data) {
  return requestClient.post('/vehiclecharging/interconnection/apply', data);
}

/** 互联互通审核 */
export function auditInterconnection(data) {
  return requestClient.put('/vehiclecharging/interconnection/audit', data);
}

/** 关闭互联互通 */
export function closeInterconnection(data) {
  return requestClient.put('/vehiclecharging/interconnection/close', data);
}

/** 互联互通导出 */
export function exportInterconnectionExcel() {
  return requestClient.download('/vehiclecharging/interconnection/export');
}

/** 互联互通详情 */
export function getInterconnectionDetail(params) {
  return requestClient.get('/vehiclecharging/interconnection/get', { params });
}

/** 重新申请互联互通 */
export function reapplyInterconnection(data) {
  return requestClient.post('/vehiclecharging/interconnection/reapply', data);
}

/** 互联互通开通状态统计图表 */
export function getInterconnectionChart(params) {
  return requestClient.get('/vehiclecharging/interconnection/chart', { params });
}

/** 互联互通状态占比（饼图钻取） */
export function getInterconnectionStatusRatio() {
  return requestClient.get('/vehiclecharging/interconnection/chart/statusRatio');
}

/** 各合作方开通数量（柱状图钻取） */
export function getInterconnectionCooperatorCount() {
  return requestClient.get('/vehiclecharging/interconnection/chart/cooperatorCount');
}

/** 互联互通申请统计（卡片钻取） */
export function getInterconnectionApplyCount(params) {
  return requestClient.get('/vehiclecharging/interconnection/chart/applyCount', { params });
}
