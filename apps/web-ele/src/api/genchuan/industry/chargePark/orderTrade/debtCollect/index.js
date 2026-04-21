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
/*逃费记录分页 */
export function getDebtRecordPage(params) {
  return requestClient.get('/ordertrade/debt-record/page', {
    params,
  });
}

/** 逃费记录追缴 */
export function startCollectDebtRecord(data) {
  return requestClient.put('/ordertrade/debt-record/start-collect', data);
}
/** 逃费记录追缴进度 */
export function updateCollectProgress(data) {
  return requestClient.put('/ordertrade/debt-record/update-progress', data);
}
/** 逃费记录导出 */
export function exportDebtRecordExcel() {
  return requestClient.download('/ordertrade/debt-record/export');
}
/** 逃费记录图表 */
export function getDebtRecordChart() {
  return requestClient.get('/ordertrade/debt-record/chart');
}
/** 欠费记录分页 */
export function getDebtRecordCollectPage(params) {
  return requestClient.get('/ordertrade/arrear-record/page', {
    params,
  });
}
/** 催缴 */
export function remindDebtRecordCollect(data) {
  return requestClient.put('/ordertrade/arrear-record/remind', data);
}
/** 催缴导出 */
export function exportDebtRecordCollectExcel() {
  return requestClient.download('/ordertrade/arrear-record/export');
}
/** 催缴图表 */
export function getDebtRecordCollectChart() {
  return requestClient.get('/ordertrade/arrear-record/chart');
}
