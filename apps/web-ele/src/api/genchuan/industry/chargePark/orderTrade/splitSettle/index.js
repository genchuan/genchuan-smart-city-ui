import { requestClient } from '#/api/request';
 

/** 结算单据分页 */
export function getSettleBillPage(params) {
  return requestClient.get('/ordertrade/settle-bill/page', {
    params,
  });
}
/** 结算单据导出 */
export function exportSettleBillExcel() {
  return requestClient.download('/ordertrade/settle-bill/export');
}
/** 结算单据图表 */
export function getSettleBillChart(params) {
  return requestClient.get('/ordertrade/settle-bill/chart', {
    params,
  });
} 
/** 结算单据更新 */
export function updateSettleBill(data) {
  return requestClient.put('/ordertrade/settle-bill/update', data);
}
/** 结算单据删除 */
export function deleteSettleBill(params) {
  return requestClient.delete('/ordertrade/settle-bill/delete', {params});
}
/** 结算单据创建 */
export function createSettleBill(data) {
  return requestClient.post('/ordertrade/settle-bill/create', data);
}
/** 结算单据重新生成 */
export function regenerateSettleBill(data) {
  return requestClient.put('/ordertrade/settle-bill/regenerate', data);
}
/** 结算单据结算 */
export function settleSettleBill(data) {
  return requestClient.put('/ordertrade/settle-bill/settle', data);
}
/** 结算单据审核驳回 */
export function rejectSettleBill(data) {
  return requestClient.post('/ordertrade/settle-bill/audit-reject', data);
}
/** 结算单据审核通过 */
export function passSettleBill(data) {
  return requestClient.post('/ordertrade/settle-bill/audit-pass', data);
}
