import { requestClient } from '#/api/request';

// 分页列表
export function getChargingPilePage(params) {
  return requestClient.get('/vehiclecharging/charging_pile/page', { params });
}

// 新增
export function createChargingPile(data) {
  return requestClient.post('/vehiclecharging/charging_pile/create', data);
}

// 编辑
export function updateChargingPile(data) {
  return requestClient.put('/vehiclecharging/charging_pile/update', data);
}

// 详情
export function getChargingPileDetail(id) {
  return requestClient.get(`/vehiclecharging/charging_pile/get?id=${id}`);
}

// 调试
export function debugChargingPile(data) {
  return requestClient.put('/vehiclecharging/charging_pile/debug', data);
}

// 启用
export function enableChargingPile(data) {
  return requestClient.put('/vehiclecharging/charging_pile/enable', data);
}

// 停用
export function disableChargingPile(data) {
  return requestClient.put('/vehiclecharging/charging_pile/disable', data);
}

// 重启
export function restartChargingPile(data) {
  return requestClient.put('/vehiclecharging/charging_pile/restart', data);
}

// 导出
export function exportChargingPile(params) {
  return requestClient.download('/vehiclecharging/charging_pile/export', { params });
}

// 刷新（即时获取最新数据）
export function refreshChargingPile(params) {
  return requestClient.get('/vehiclecharging/charging_pile/refresh', { params });
}

// 充电枪二维码预览
export function getQrcode(id) {
  return requestClient.get(`/vehiclecharging/charging_pile/qrcode?id=${id}`);
}

// 图表数据
export function getChartData(params) {
  return requestClient.get('/vehiclecharging/charging_pile/chart', { params });
}

// 运行时长趋势（钻取）
export function getRunTimeTrend(params) {
  return requestClient.get('/vehiclecharging/charging_pile/chart/runTimeTrend', { params });
}

// 各类型充电桩数量（钻取）
export function getTypeCount(params) {
  return requestClient.get('/vehiclecharging/charging_pile/chart/typeCount', { params });
}

// 状态统计钻取列表
export function getStatusList(params) {
  return requestClient.get('/vehiclecharging/charging_pile/chart/statusCount', { params });
}
