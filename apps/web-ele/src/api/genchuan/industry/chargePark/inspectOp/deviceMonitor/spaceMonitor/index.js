import { requestClient } from '#/api/request.js';

/** 分页查询车位状态监测列表 */
export function getSpaceMonitorPage(params) {
  return requestClient.get('/inspectop/space-monitor/page', { params });
}

/** 导出车位状态监测数据 */
export function exportSpaceMonitor(params) {
  return requestClient.download('/inspectop/space-monitor/export', { params });
}

/** 获取车位状态监测定位 */
export function getSpaceMonitorLocation(params) {
  return requestClient.get('/inspectop/space-monitor/location', { params });
}

/** 获取车位状态监测详情 */
export function getSpaceMonitorDetail(id) {
  return requestClient.get('/inspectop/space-monitor/get', { params: { id } });
}

/** 标记车位状态监测告警 */
export function alarmSpaceMonitor(data) {
  return requestClient.put('/inspectop/space-monitor/alarm', data);
}

/** 获取车位状态监测看板 */
export function getSpaceMonitorChart(params) {
  return requestClient.get('/inspectop/space-monitor/chart', { params });
}
