import { requestClient } from '#/api/request';
         
        /** 发票列表图表 */
export function getInvoiceListChart(params) {
  return requestClient.get('/ordertrade/invoice-list/chart', {
    params,
  });
}

/** 发票列表分页 */
export function getInvoiceListPage(params) {
  return requestClient.get('/ordertrade/invoice-list/page', {
    params,
  });
}
/** 发票列表导出 */
export function exportInvoiceListExcel() {
  return requestClient.download('/ordertrade/invoice-list/export');
}
/** 发票列表批量发票 */
export function batchInvoice(data) {
  return requestClient.put('/ordertrade/invoice-list/batch-invoice', data);
}


/** 发票列表审核通过 */
export function auditPass(data) {
  return requestClient.post('/ordertrade/invoice-list/audit-pass', data);
}

/** 发票列表审核拒绝 */
export function auditReject(data) {
  return requestClient.post('/ordertrade/invoice-list/audit-reject', data);
}
/** 发票列表重新申请 */
export function reapply(data) {
  return requestClient.post('/ordertrade/invoice-list/reapply', data);
}
/** 发票列表确认 */
export function push(data) {
  return requestClient.post('/ordertrade/invoice-list/push', data);
}
