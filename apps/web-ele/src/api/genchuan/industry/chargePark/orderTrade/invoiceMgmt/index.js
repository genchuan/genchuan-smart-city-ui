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
/** 发票列表开票 */
export function invoice(data) {
  return requestClient.post('/ordertrade/invoice-list/invoice', data);
}
/** 发票列表下载 */
export function download(params) {
  return requestClient.get('/ordertrade/invoice-list/download', {
    params,
  });
}


/** 发票列表审核分页 */
export function getInvoiceAuditPage(params) {
  return requestClient.get('/ordertrade/invoice-audit/page', {
    params,
  });
}
/** 发票列表审核导出 */
export function exportInvoiceAuditExcel() {
  return requestClient.download('/ordertrade/invoice-audit/export');
}
/** 发票列表审核批量操作 */
export function batchAudit(data) {
  return requestClient.put('/ordertrade/invoice-audit/batch-audit', data);
}



/** 发票列表审核批量通过 */
export function batchAuditPass(data) {
  return requestClient.post('/ordertrade/invoice-audit/audit-pass', data);
}
/** 发票列表审核批量拒绝 */
export function batchAuditReject(data) {
  return requestClient.post('/ordertrade/invoice-audit/audit-reject', data);
}
/** 发票列表审核批量确认开票 */
export function batchConfirm(data) {
  return requestClient.post('/ordertrade/invoice-audit/confirm', data);
}
/** 发票列表审核批量重新申请 */
export function batchReapply(data) {
  return requestClient.post('/ordertrade/invoice-audit/reapply', data);
}
/** 发票列表审核图表 */
export function getInvoiceAuditChart(params) {
  return requestClient.get('/ordertrade/invoice-audit/chart', {
    params,
  });
}
