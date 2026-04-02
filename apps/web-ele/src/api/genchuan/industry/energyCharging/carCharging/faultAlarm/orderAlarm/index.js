import { requestClient } from '#/api/request.js';

// ==================== 列表页交互操作接口 ====================

/** 分页查询订单告警列表 */
export function getOrderAlarmPage(params) {
  return requestClient.get('/vehiclecharging/order-alarm/page', { params });
}

/** 创建订单告警 */
export function createOrderAlarm(data) {
  return requestClient.post('/vehiclecharging/order-alarm/create', data);
}

/** 编辑订单告警 */
export function updateOrderAlarm(data) {
  return requestClient.put('/vehiclecharging/order-alarm/update', data);
}

/** 删除订单告警 */
export function deleteOrderAlarm(id) {
  return requestClient.delete('/vehiclecharging/order-alarm/delete', {
    params: { id },
  });
}

/** 批量删除订单告警 */
export function batchDeleteOrderAlarm(ids) {
  return requestClient.delete('/vehiclecharging/order-alarm/batch-delete', {
    data: { ids },
  });
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
  return requestClient.download('/vehiclecharging/order-alarm/export-excel');
}

// ==================== 列表行交互操作接口 ====================

/** 获取订单告警详情 */
export function getOrderAlarmDetail(id) {
  return requestClient.get('/vehiclecharging/order-alarm/get', {
    params: { id },
  });
}

/** 更新订单告警备注
 * @param {Object} data - 请求参数
 * @param {number} data.id - 告警 ID
 * @param {string} data.remark - 备注内容
 * @returns {Promise<boolean>} 操作结果，true 为成功，false 为失败
 * @permission vehiclecharging:order_alarm:remark
 * @description 更新告警的备注信息，自动记录操作人、操作时间审计日志，支持多租户数据隔离
 * @example
 * // 请求示例
 * { id: 1, remark: "用户充电过程中误触停止按钮导致中断，已协助恢复" }
 * // 响应示例
 * { code: 200, data: true, msg: "成功" }
 */
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
