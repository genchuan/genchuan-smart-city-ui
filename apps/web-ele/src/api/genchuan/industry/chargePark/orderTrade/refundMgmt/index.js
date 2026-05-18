import { requestClient } from '#/api/request';

/** 订单分页 */
export function getRefundApplyPage(params) {
  return requestClient.get('/ordertrade/refund-apply/page', {
    params,
  });
}
/** 订单重新申请 */
export function reApplyRefundApply(data) {
  return requestClient.put('/ordertrade/refund-apply/re-apply', data);
}
/** 订单拒绝 */
export function rejectRefundApply(data) {
  return requestClient.put('/ordertrade/refund-apply/reject', data);
}
/** 订单导出 */
export function exportRefundApplyExcel() {
  return requestClient.download('/ordertrade/refund-apply/export');
}
/** 订单执行 */
export function executeRefundApply(data) {
  return requestClient.put('/ordertrade/refund-apply/execute', data);
}
/** 订单批量审核 */
export function batchAuditRefundApply(data) {
  return requestClient.post('/ordertrade/refund-apply/batch-audit', data);
}
/** 订单审核 */
export function approveRefundApply(data) {
  return requestClient.put('/ordertrade/refund-apply/approve', data);
}

/** 订单图表 */
export function getRefundApplyChart(params) {
  return requestClient.get('/ordertrade/refund-apply/chart', {
    params,
  });
}
/** 订单退款记录分页 */
export function getRefundRecordPage(params) {
  return requestClient.get('/ordertrade/refund-record/page', {
    params,
  });
}
/** 订单退款记录导出 */
export function exportRefundRecordExcel() {
  return requestClient.download('/ordertrade/refund-record/export');
}
/** 订单退款记录检查 */
export function checkRefundRecord(data) {
  return requestClient.put('/ordertrade/refund-record/check', data);
}
/** 订单退款记录图表 */
export function getRefundRecordChart(params) {
  return requestClient.get('/ordertrade/refund-record/chart', {
    params,
  });
}
/** 订单金额核算分页 */
export function getAmountCheckPage(params) {
  return requestClient.get('/ordertrade/amount-check/page', {
    params,
  });
}
/** 订单金额核算导出 */
export function exportAmountCheckExcel() {
  return requestClient.download('/ordertrade/amount-check/export');
}
/** 订单金额核算确认 */
export function confirmAmountCheck(data) {
  return requestClient.put('/ordertrade/amount-check/confirm', data);
}
/** 订单金额核算计算 */
export function calculateAmountCheck(data) {
  return requestClient.post('/ordertrade/amount-check/calculate', data);
}
/** 订单金额核算图表 */
export function getAmountCheckChart(params) {
  return requestClient.get('/ordertrade/amount-check/chart', {
    params,
  });
}
