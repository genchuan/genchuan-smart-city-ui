import { requestClient } from '#/api/request.js';

/** 分页查询两轮充电监测列表 */
export function getBikeChargeMonitorPage(params) {
  return requestClient.get('/inspectop/bike-charge-monitor/page', { params });
}

/** 导出两轮充电监测数据 */
export function exportBikeChargeMonitor(params) {
  return requestClient.download('/inspectop/bike-charge-monitor/export-excel', {
    params,
  });
}

/** 获取两轮充电监测定位 */
export function getBikeChargeMonitorLocation(params) {
  return requestClient.get('/inspectop/bike-charge-monitor/location', {
    params,
  });
}

/** 获取两轮充电监测详情 */
export function getBikeChargeMonitorDetail(id) {
  return requestClient.get('/inspectop/bike-charge-monitor/get', {
    params: { id },
  });
}

/** 标记两轮充电监测告警 */
export function alarmBikeChargeMonitor(data) {
  return requestClient.put('/inspectop/bike-charge-monitor/alarm', data);
}

/** 获取两轮充电监测看板 */
export function getBikeChargeMonitorChart(params) {
  return requestClient.get('/inspectop/bike-charge-monitor/chart', { params });
}
