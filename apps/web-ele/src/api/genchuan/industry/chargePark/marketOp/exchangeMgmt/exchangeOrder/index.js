import { requestClient } from '#/api/request.js';

// ==================== 列表页交互操作接口 ====================

/** 分页查询兑换订单列表
 * @param {Object} params - 请求参数
 * @param {string} params.no - 订单编号，支持模糊查询
 * @param {number} params.userId - 用户ID，支持按用户筛选
 * @param {number} params.categoryId - 类目ID，支持按类目筛选
 * @param {string} params.payStatus - 支付状态（待支付 / 已支付 / 已完成 / 已取消）
 * @param {string} params.createTime - 订单时间，支持时间范围查询
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getExchangeOrderPage(params) {
  return requestClient.get('/marketop/exchange-order/page', { params });
}

/** 导出兑换订单数据
 * @returns {Promise}
 */
export function exportExchangeOrder() {
  return requestClient.download('/marketop/exchange-order/export');
}

/** 批量导出兑换订单
 * @param {Object} params - 请求参数
 * @param {Array<number>} params.ids - 订单ID列表
 * @returns {Promise}
 */
export function batchExportExchangeOrder(params) {
  return requestClient.download('/marketop/exchange-order/batch-export', { params });
}

// ==================== 列表行交互操作接口 ====================

/** 获取兑换订单详情
 * @param {Object} params - 请求参数
 * @param {number} params.id - 订单ID
 * @returns {Promise}
 */
export function getExchangeOrderDetail(params) {
  return requestClient.get('/marketop/exchange-order/get', { params });
}

/** 支付订单
 * @param {Object} data - 请求参数
 * @param {number} data.id - 订单ID
 * @returns {Promise}
 */
export function payExchangeOrder(data) {
  return requestClient.put('/marketop/exchange-order/pay', data);
}

/** 发货
 * @param {Object} data - 请求参数
 * @param {number} data.id - 订单ID
 * @param {string} data.logisticsInfo - 物流信息，包含快递公司、快递单号
 * @returns {Promise}
 */
export function shipExchangeOrder(data) {
  return requestClient.put('/marketop/exchange-order/ship', data);
}

/** 取消订单
 * @param {Object} data - 请求参数
 * @param {number} data.id - 订单ID
 * @param {string} data.cancelReason - 取消原因
 * @returns {Promise}
 */
export function cancelExchangeOrder(data) {
  return requestClient.put('/marketop/exchange-order/cancel', data);
}

// ==================== 数据可视化图表接口 ====================

/** 兑换订单统计（折线图 + 柱状图 + 卡片）
 * @param {Object} params - 请求参数
 * @param {string} params.startTime - 统计开始时间
 * @param {string} params.endTime - 统计结束时间
 * @param {number} params.stationId - 场站ID，支持按场站筛选
 * @returns {Promise}
 */
export function getExchangeOrderChart(params) {
  return requestClient.get('/marketop/exchange-order/chart', { params });
}
