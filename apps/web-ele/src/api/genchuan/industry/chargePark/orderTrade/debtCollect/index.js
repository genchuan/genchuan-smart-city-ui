import { requestClient } from '#/api/request';
/** 逃费识别分页 */
export function getDebtIdentifyPage(params) {
  return requestClient.get('/ordertrade/debt-identify/page', {
    params,
  });
}
/** 逃费识别标记 */
export function markDebtIdentify(data) {
  return requestClient.put('/ordertrade/debt-identify/mark', data);
}
/** 逃费识别 */
export function identifyDebtIdentify(data) {
  return requestClient.put('/ordertrade/debt-identify/identify', data);
}
/** 逃费识别导出 */
export function exportDebtIdentifyExcel() {
  return requestClient.download('/ordertrade/debt-identify/export');
}
/** 逃费识别批量处理 */
export function batchIdentifyDebtIdentify(data) {
  return requestClient.post('/ordertrade/debt-identify/batch-identify', data);
}
/** 逃费识别图表 */
export function getDebtIdentifyChart() {
  return requestClient.get('/ordertrade/debt-identify/chart');
} 
