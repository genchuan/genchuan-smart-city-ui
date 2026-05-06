import { requestClient } from '#/api/request.js';

// ==================== 列表页交互操作接口 ====================

/** 分页查询卡种订单列表
 * @param {Object} params - 请求参数
 * @param {string} params.no - 订单编号，支持模糊查询
 * @param {number} params.userId - 用户ID，支持按用户筛选
 * @param {number} params.cardId - 卡种ID，支持按卡种筛选
 * @param {string} params.payStatus - 支付状态（待支付/已支付/已完成/已取消）
 * @param {string} params.invoiceStatus - 开票状态（未开票/已开票）
 * @param {string} params.createTime - 订单时间，支持时间范围查询
 * @param {number} params.pageNo - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 */
export function getCardOrderPage(params) {
  return requestClient.get('/marketop/card-order/page', { params });
}

/** 导出卡种订单数据
 * @returns {Promise}
 */
export function exportCardOrder() {
  return requestClient.download('/marketop/card-order/export');
}

/** 批量导出卡种订单数据
 * @param {Object} params - 请求参数
 * @param {Array<number>} params.ids - 订单ID列表
 * @returns {Promise}
 */
export function batchExportCardOrder(params) {
  return requestClient.download('/marketop/card-order/batch-export', { params });
}

// ==================== 列表行交互操作接口 ====================

/** 获取卡种订单详情
 * @param {Object} params - 请求参数
 * @param {number} params.id - 订单ID
 * @returns {Promise}
 */
export function getCardOrderDetail(params) {
  return requestClient.get('/marketop/card-order/get', { params });
}

/** 支付订单
 * @param {Object} params - 请求参数
 * @param {number} params.id - 订单ID
 * @returns {Promise}
 */
export function payCardOrder(params) {
  return requestClient.put('/marketop/card-order/pay', null,{
    params,
  });
}
/** 激活订单
 * @param {Object} data - 请求参数
 * @param {number} data.id - 订单ID
 * @returns {Promise}
 */
export function activeCardOrder(data) {
  return requestClient.put('/marketop/card-order/activate', data);
}

/** 开票
 * @param {Object} data - 请求参数
 * @param {number} data.id - 订单ID
 * @param {string} data.invoiceInfo - 开票信息，包含抬头、税号等
 * @returns {Promise}
 */
export function invoiceCardOrder(data) {
  return requestClient.put('/marketop/card-order/invoice', data);
}

/** 取消订单
 * @param {Object} data - 请求参数
 * @param {number} data.id - 订单ID
 * @param {string} data.cancelReason - 取消原因
 * @returns {Promise}
 */
export function cancelCardOrder(data) {
  return requestClient.put('/marketop/card-order/cancel', data);
}

// ==================== 数据可视化图表接口 ====================

/** 卡种订单统计（折线图 + 柱状图 + 卡片）
 * @returns {Promise}
 */
export function getCardOrderChart() {
  return requestClient.get('/marketop/card-order/chart');
}
