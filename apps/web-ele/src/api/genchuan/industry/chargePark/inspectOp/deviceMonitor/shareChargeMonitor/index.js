import { requestClient } from '#/api/request.js';

/** 分页查询共享充电监测列表 */
export function getShareChargeMonitorPage(params) {
  return requestClient.get('/inspectop/share-charge-monitor/page', { params });
}

/** 导出共享充电监测数据 */
export function exportShareChargeMonitor(params) {
  return requestClient.download('/inspectop/share-charge-monitor/export', {
    params,
  });
}

/** 获取共享充电监测定位 */
export function getShareChargeMonitorLocation(params) {
  return requestClient.get('/inspectop/share-charge-monitor/location', {
    params,
  });
}

/** 获取共享充电监测详情 */
export function getShareChargeMonitorDetail(id) {
  return requestClient.get('/inspectop/share-charge-monitor/get', {
    params: { id },
  });
}

/** 标记共享充电监测告警 */
export function alarmShareChargeMonitor(data) {
  return requestClient.put('/inspectop/share-charge-monitor/alarm', data);
}

/** 获取共享充电监测看板 */
export function getShareChargeMonitorChart(params) {
  return requestClient.get('/inspectop/share-charge-monitor/chart', { params });
}
