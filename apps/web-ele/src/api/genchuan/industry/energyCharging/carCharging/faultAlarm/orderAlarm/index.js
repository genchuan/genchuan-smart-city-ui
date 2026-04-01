import { requestClient } from '#/api/request.js';

// ==================== 列表页交互操作接口 ====================

/** 分页查询订单告警列表 */
export function getOrderAlarmPage(params) {
  return requestClient.get('/vehiclecharging/order-alarm/page', { params });
}

/** 核实订单告警 */
export function verifyOrderAlarm(data) {
  return requestClient.put('/vehiclecharging/order-alarm/verify', data);
}

/** 处理订单告警 */
export function handleOrderAlarm(data) {
  return requestClient.put('/vehiclecharging/order-alarm/handle', data);
}

/** 完结订单告警 */
export function completeOrderAlarm(data) {
  return requestClient.put('/vehiclecharging/order-alarm/complete', data);
}

/** 导出订单告警数据 */
export function exportOrderAlarm() {
  return requestClient.download('/vehiclecharging/order-alarm/export');
}

// ==================== 列表行交互操作接口 ====================

/** 获取订单告警详情 */
export function getOrderAlarmDetail(id) {
  return requestClient.get('/vehiclecharging/order-alarm/get', {
    params: { id },
  });
}

/** 更新订单告警备注 */
export function updateOrderAlarmRemark(data) {
  return requestClient.put('/vehiclecharging/order-alarm/remark', data);
}

// ==================== 数据可视化图表接口 ====================

/** 订单告警处理趋势图（折线图 + 饼图 + 卡片） */
export function getOrderAlarmChart(params) {
  return requestClient.get('/vehiclecharging/order-alarm/chart', { params });
}

/** 订单告警数量及处理完成趋势（折线图钻取） */
export function getOrderAlarmTrend(params) {
  return requestClient.get('/vehiclecharging/order-alarm/chart/trend', { params });
}

/** 告警原因占比（饼图钻取） */
export function getOrderAlarmReasonRatio(params) {
  return requestClient.get('/vehiclecharging/order-alarm/chart/reasonRatio', { params });
}

/** 订单告警统计（卡片钻取） */
export function getOrderAlarmCount(params) {
  return requestClient.get('/vehiclecharging/order-alarm/chart/count', { params });
}
