import { requestClient } from '#/api/request.js';

/** 分页查询汽车充电监测列表 */
export function getCarChargeMonitorPage(params) {
  return requestClient.get('/inspectop/car-charge-monitor/page', { params });
}

/** 导出汽车充电监测数据 */
export function exportCarChargeMonitor(params) {
  return requestClient.download('/inspectop/car-charge-monitor/export', {
    params,
  });
}

/** 获取汽车充电监测定位 */
export function getCarChargeMonitorLocation(params) {
  return requestClient.get('/inspectop/car-charge-monitor/location', {
    params,
  });
}

/** 获取汽车充电监测详情 */
export function getCarChargeMonitorDetail(id) {
  return requestClient.get('/inspectop/car-charge-monitor/get', {
    params: { id },
  });
}

/** 标记汽车充电监测告警 */
export function alarmCarChargeMonitor(data) {
  return requestClient.put('/inspectop/car-charge-monitor/alarm', data);
}

/** 获取汽车充电监测看板 */
export function getCarChargeMonitorChart(params) {
  return requestClient.get('/inspectop/car-charge-monitor/chart', { params });
}
