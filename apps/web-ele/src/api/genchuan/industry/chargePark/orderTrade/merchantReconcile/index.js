import { requestClient } from '#/api/request';

/** 对账单分页查询 */
export function getReconcileBillListPage(params) {
  return requestClient.get('/ordertrade/reconcile-bill/page', {
    params,
  });
} 


/** 对账单导出 */
export function exportReconcileBill(data) {
  return requestClient.download('/ordertrade/reconcile-bill/export', data);
}
/** 对账单批量对账 */
export function batchReconcileBill(data) {
  return requestClient.post('/ordertrade/reconcile-bill/batch-reconcile', data);
}

/** 对账单确认 */
export function confirmReconcileBill(data) {
  return requestClient.post('/ordertrade/reconcile-bill/confirm', data);
}
/** 对账单修复 */
export function fixReconcileBill(data) {
  return requestClient.post('/ordertrade/reconcile-bill/fix', data);
}

/** 对账单图表数据 */
export function getReconcileBillChart(params) {
  return requestClient.get('/ordertrade/reconcile-bill/chart', {
    params,
  });
}
/** 对账单对账 */
export function reconcileBill(data) { 
  return requestClient.post('/ordertrade/reconcile-bill/reconcile', data);
} 

/** 对账单对账记录分页查询 */
export function getReconcileRecordListPage(params) {
  return requestClient.get('/ordertrade/reconcile-record/page', {
    params,
  });
}
/** 对账单对账记录导出 */
export function exportReconcileRecord(data) {
  return requestClient.download('/ordertrade/reconcile-record/export', data);
}
/** 对账单对账记录检查 */
export function checkReconcileRecord(data) {
  return requestClient.post('/ordertrade/reconcile-record/check', data);
}
/** 对账单对账记录图表数据 */
export function getReconcileRecordChart(params) {
  return requestClient.get('/ordertrade/reconcile-record/chart', {
    params,
  });
}
