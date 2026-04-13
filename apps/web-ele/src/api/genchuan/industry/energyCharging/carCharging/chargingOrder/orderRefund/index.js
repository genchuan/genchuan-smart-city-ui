import { requestClient } from '#/api/request.js';

// ==================== 列表页交互操作接口 ====================

/** 分页查询订单退款列表 */
export function getOrderRefundPage(params) {
  return requestClient.get('/vehiclecharging/order-refund/page', { params });
}

/** 导出订单退款数据 */
export function exportOrderRefund() {
  return requestClient.download('/vehiclecharging/order-refund/export-excel');
}

// ==================== 列表行交互操作接口 ====================

/** 获取订单退款详情 */
export function getOrderRefundDetail(id) {
  return requestClient.get('/vehiclecharging/order-refund/get', {
    params: { id },
  });
}

/** 审核订单退款（批量）
 * @param {object} data - 请求参数
 * @param {array} data.ids - 退款申请 ID 集合
 * @param {string} data.auditRemark - 审核备注
 */
export function auditOrderRefundBatch(data) {
  return requestClient.put('/vehiclecharging/order-refund/audit', data);
}



/** 驳回订单退款
 * @param {object} data - 请求参数
 * @param {number} data.id - 退款申请 ID
 * @param {string} data.rejectReason - 驳回原因
 */
export function rejectOrderRefund(data) {
  return requestClient.put('/vehiclecharging/order-refund/reject', data);
}

/** 退款操作（批量）
 * @param {object} data - 请求参数
 * @param {array} data.ids - 退款申请 ID 集合
 */
export function refundOrderRefundBatch(data) {
  return requestClient.put('/vehiclecharging/order-refund/refund', data);
}

/** 重新申请退款
 * @param {object} data - 请求参数
 * @param {number} data.id - 原退款申请 ID
 * @param {number} data.refundAmount - 新退款金额
 * @param {string} data.refundReason - 新退款原因
 */
export function reapplyOrderRefund(data) {
  return requestClient.post('/vehiclecharging/order-refund/reapply', data);
}

/** 更新订单退款备注
 * @param {object} data - 请求参数
 * @param {number} data.id - 退款申请 ID
 * @param {string} data.remark - 备注内容
 */
export function updateOrderRefundRemark(data) {
  return requestClient.put('/vehiclecharging/order-refund/remark', data);
}

// ==================== 数据可视化图表接口 ====================

/** 订单退款统计图表（折线图 + 饼图 + 卡片） */
export function getOrderRefundChart(params) {
  return requestClient.get('/vehiclecharging/order-refund/chart', { params });
}
