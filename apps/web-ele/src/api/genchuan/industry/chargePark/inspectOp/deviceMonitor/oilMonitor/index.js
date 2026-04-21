import { requestClient } from '#/api/request.js';

/** 分页查询油车占位监测列表 */
export function getOilMonitorPage(params) {
  return requestClient.get('/inspectop/oil-monitor/page', { params });
}

/** 导出油车占位监测数据 */
export function exportOilMonitor(params) {
  return requestClient.download('/inspectop/oil-monitor/export-excel', {
    params,
  });
}

/** 批量处置油车占位 */
export function batchProcessOilMonitor(data) {
  return requestClient.put('/inspectop/oil-monitor/batch-process', data);
}

/** 获取油车占位监测详情 */
export function getOilMonitorDetail(id) {
  return requestClient.get('/inspectop/oil-monitor/get', { params: { id } });
}

/** 处置油车占位 */
export function processOilMonitor(data) {
  return requestClient.put('/inspectop/oil-monitor/process', data);
}

/** 忽略油车占位 */
export function ignoreOilMonitor(data) {
  return requestClient.put('/inspectop/oil-monitor/ignore', data);
}

/** 更新油车占位处置进度 */
export function updateOilMonitorProgress(data) {
  return requestClient.put('/inspectop/oil-monitor/update-process', data);
}

/** 获取油车占位监测看板 */
export function getOilMonitorChart(params) {
  return requestClient.get('/inspectop/oil-monitor/chart', { params });
}
