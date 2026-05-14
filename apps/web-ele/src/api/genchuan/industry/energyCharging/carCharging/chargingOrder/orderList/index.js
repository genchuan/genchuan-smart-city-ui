import { requestClient } from '#/api/request.js';

// ==================== 列表基础接口 ====================

/** 订单列表-分页查询（筛选、刷新） */
export function getOrderListPage(params) {
  return requestClient.get('/vehiclecharging/order-list/page', { params });
}

/** 订单列表-导出 */
export function exportOrderListExcel() {
  return requestClient.download('/vehiclecharging/order-list/export');
}

/** 订单列表-刷新（复用分页接口） */
export function refreshOrderList(params) {
  return requestClient.get('/vehiclecharging/order-list/refresh', { params });
}

/** 订单列表-批量获取详情 */
export function batchGetOrderList(data) {
  return requestClient.get('/vehiclecharging/order-list/batchGet', { params: data });
}

// ==================== 列表行交互操作接口 ====================

/** 订单-获取单条详情 */
export function getOrderListDetail(params) {
  return requestClient.get('/vehiclecharging/order-list/get', { params });
}

/** 订单-取消（待支付） */
export function cancelOrderList(data) {
  return requestClient.put('/vehiclecharging/order-list/cancel', data);
}

/** 订单-支付提醒 */
export function payRemindOrderList(data) {
  return requestClient.put('/vehiclecharging/order-list/payRemind', data);
}

/** 订单-退款申请 */
export function refundApplyOrderList(data) {
  return requestClient.post('/vehiclecharging/order-list/refundApply', data);
}

/** 订单-评价 */
export function evaluateOrderList(data) {
  return requestClient.put('/vehiclecharging/order-list/evaluate', data);
}

/** 订单-终止充电 */
export function stopChargeOrderList(data) {
  return requestClient.put('/vehiclecharging/order-list/stopCharge', data);
}

// ==================== 数据可视化图表接口 ====================

/** 订单-交易趋势综合图表 */
export function getOrderListChart(params) {
  return requestClient.get('/vehiclecharging/order-list/chart', { params });
}

/** 订单-每日订单/金额趋势（折线图钻取） */
export function getOrderListDailyTrend(params) {
  return requestClient.get('/vehiclecharging/order-list/chart/dailyTrend', { params });
}

/** 订单-状态占比（饼图钻取） */
export function getOrderListStatusRatio(params) {
  return requestClient.get('/vehiclecharging/order-list/chart/statusRatio', { params });
}

/** 订单-交易统计（卡片钻取） */
export function getOrderListTradeCount(params) {
  return requestClient.get('/vehiclecharging/order-list/chart/tradeCount', { params });
}
