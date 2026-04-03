import { requestClient } from '#/api/request';  
 

/** 列表 */
export function getSettlementBillList(params) {
  return requestClient.get('/vehiclecharging/settlement-bill/page', {
    params,   
})
}
/** 生成结算单 */
export function createSettlementBillBatch(data) {
  return requestClient.post('/vehiclecharging/settlement-bill/createBatch', data)
}
/** 导出excel */
export function exportSettlementBillExcel(data) {
  return requestClient.download('/vehiclecharging/settlement-bill/export-excel', data)
}
/** 审核结算单 */
export function auditSettlementBill(data) {
  return requestClient.put('/vehiclecharging/settlement-bill/audit', data)
}
/** 驳回 */
export function rejectSettlementBill(data) {
  return requestClient.put('/vehiclecharging/settlement-bill/reject', data)
}
/** 结算结算单 */
export function settleSettlementBill(data) {
  return requestClient.put('/vehiclecharging/settlement-bill/settle', data)
}
 /** 重新审核结算单 */
export function reAuditSettlementBill(data) {
  return requestClient.put('/vehiclecharging/settlement-bill/reaudit', data)
}
/** 修改结算单备注 */
export function updateRemarkSettlementBill(data) {
  return requestClient.put('/vehiclecharging/settlement-bill/remark', data)
}
